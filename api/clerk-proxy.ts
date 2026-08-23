import type { VercelRequest, VercelResponse } from '@vercel/node'

const FAPI = 'https://frontend-api.clerk.dev'
const PROXY_PATH = '/__clerk'

function proxyUrlFromRequest(req: VercelRequest) {
  const configured = process.env.CLERK_PROXY_URL || process.env.VITE_CLERK_PROXY_URL
  if (configured) return configured.replace(/\/$/, '')

  const host = req.headers['x-forwarded-host'] || req.headers.host
  const proto = (req.headers['x-forwarded-proto'] as string) || 'https'
  return `${proto}://${host}${PROXY_PATH}`
}

function clientIp(req: VercelRequest) {
  const cf = req.headers['cf-connecting-ip']
  if (typeof cf === 'string' && cf) return cf
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded) return forwarded.split(',')[0].trim()
  return req.socket.remoteAddress?.replace(/^::ffff:/, '') || '0.0.0.0'
}

function rewriteClerkCookie(cookie: string) {
  const parts = cookie.split(';').map((part) => part.trim()).filter(Boolean)
  if (parts.length === 0) return cookie
  const [nameValue, ...attrs] = parts
  // Drop upstream FAPI Domain so the cookie is host-only for this site.
  const kept = attrs.filter((attr) => !attr.toLowerCase().startsWith('domain='))
  return [nameValue, ...kept].join('; ')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const secret = process.env.CLERK_SECRET_KEY
  if (!secret) {
    res.status(500).json({ error: 'CLERK_SECRET_KEY is not configured' })
    return
  }

  const pathParam = req.query.path
  const suffix = Array.isArray(pathParam) ? pathParam.join('/') : pathParam || ''
  const searchIndex = req.url?.indexOf('?') ?? -1
  const search = searchIndex >= 0 ? req.url!.slice(searchIndex) : ''
  const target = `${FAPI}/${suffix}${search}`
  const proxyUrl = proxyUrlFromRequest(req)

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
  headers.set('Clerk-Secret-Key', secret)
  headers.set('X-Forwarded-For', clientIp(req))
  try {
    const proxyHost = new URL(proxyUrl).origin
    headers.set('Origin', proxyHost)
    headers.set('Referer', `${proxyHost}/`)
  } catch {
    /* ignore */
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: 'manual',
  }

  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body != null) {
    init.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
  }

  const upstream = await fetch(target, init)
  res.status(upstream.status)

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

  const cookies =
    typeof upstream.headers.getSetCookie === 'function' ? upstream.headers.getSetCookie() : []
  for (const cookie of cookies) {
    res.appendHeader('set-cookie', rewriteClerkCookie(cookie))
  }

  const buffer = Buffer.from(await upstream.arrayBuffer())
  res.send(buffer)
}
