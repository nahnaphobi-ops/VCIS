import { defineConfig, loadEnv, type Plugin, type Connect } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { ServerResponse } from 'node:http'

/** Rewrite Clerk upstream cookies so the browser will store them for this app origin. */
function rewriteClerkCookie(cookie: string) {
  const parts = cookie.split(';').map((part) => part.trim()).filter(Boolean)
  if (parts.length === 0) return cookie

  const [nameValue, ...attrs] = parts
  const kept = attrs.filter((attr) => {
    const lower = attr.toLowerCase()
    // Drop upstream FAPI domain — cookie must be host-only for localhost / the site host.
    if (lower.startsWith('domain=')) return false
    return true
  })

  // Local Vite is http:// — Secure cookies are often dropped.
  const withoutSecure = kept.filter((attr) => attr.toLowerCase() !== 'secure')

  // Prefer Lax on localhost so the client cookie sticks across the modal flow.
  const hasSameSite = withoutSecure.some((attr) => attr.toLowerCase().startsWith('samesite='))
  if (!hasSameSite) withoutSecure.push('SameSite=Lax')

  return [nameValue, ...withoutSecure].join('; ')
}

function appendUpstreamCookies(upstream: Response, res: ServerResponse) {
  const cookies =
    typeof upstream.headers.getSetCookie === 'function' ? upstream.headers.getSetCookie() : []

  for (const cookie of cookies) {
    res.appendHeader('set-cookie', rewriteClerkCookie(cookie))
  }
}

function clerkProxyPlugin(secret: string, proxyUrl: string): Plugin {
  return {
    name: 'clerk-fapi-proxy',
    enforce: 'pre',
    configureServer(server) {
      const handler: Connect.NextHandleFunction = async (req, res, next) => {
        if (!req.url?.startsWith('/__clerk')) {
          next()
          return
        }

        try {
          const incoming = new URL(req.url, 'http://localhost')
          const targetPath = incoming.pathname.replace(/^\/__clerk/, '') || '/'
          const target = `https://frontend-api.clerk.dev${targetPath}${incoming.search}`

          const headers = new Headers()
          for (const [key, value] of Object.entries(req.headers)) {
            if (
              !value ||
              key === 'host' ||
              key === 'connection' ||
              key === 'content-length' ||
              key === 'accept-encoding'
            ) {
              continue
            }
            headers.set(key, Array.isArray(value) ? value.join(',') : value)
          }
          headers.set('Clerk-Proxy-Url', proxyUrl)
          if (secret) headers.set('Clerk-Secret-Key', secret)
          try {
            const proxyHost = new URL(proxyUrl).origin
            headers.set('Origin', proxyHost)
            headers.set('Referer', `${proxyHost}/`)
          } catch {
            /* ignore */
          }
          const forwarded =
            (typeof req.headers['x-forwarded-for'] === 'string'
              ? req.headers['x-forwarded-for'].split(',')[0]
              : null) ||
            req.socket.remoteAddress ||
            '127.0.0.1'
          headers.set('X-Forwarded-For', forwarded.replace(/^::ffff:/, ''))

          const method = req.method || 'GET'
          let body: Buffer | undefined
          if (method !== 'GET' && method !== 'HEAD') {
            const chunks: Buffer[] = []
            for await (const chunk of req) chunks.push(Buffer.from(chunk))
            body = Buffer.concat(chunks)
          }

          const upstream = await fetch(target, {
            method,
            headers,
            body,
            redirect: 'manual',
          })

          res.statusCode = upstream.status
          upstream.headers.forEach((value, key) => {
            const lower = key.toLowerCase()
            if (
              lower === 'transfer-encoding' ||
              lower === 'content-encoding' ||
              lower === 'content-length' ||
              lower === 'set-cookie'
            ) {
              return
            }
            res.setHeader(key, value)
          })
          appendUpstreamCookies(upstream, res)
          const buffer = Buffer.from(await upstream.arrayBuffer())
          res.end(buffer)
        } catch (error) {
          console.error('Clerk proxy error', error)
          res.statusCode = 502
          res.end('Clerk proxy failed')
        }
      }

      server.middlewares.stack.unshift({ route: '', handle: handler })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const clerkSecret = env.CLERK_SECRET_KEY || ''
  const clerkProxyUrl = env.CLERK_PROXY_URL || 'https://vcis-alpha.vercel.app/__clerk'

  return {
    plugins: [react(), tailwindcss(), clerkProxyPlugin(clerkSecret, clerkProxyUrl)],
  }
})
