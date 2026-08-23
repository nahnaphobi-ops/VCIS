import { useMemo, type ReactNode } from 'react'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { ConvexProvider, ConvexProviderWithAuth, ConvexReactClient } from 'convex/react'

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined
const clerkProxyUrl = (import.meta.env.VITE_CLERK_PROXY_URL as string | undefined) || '/__clerk'

function useConvexAuth() {
  const { isLoaded, isSignedIn, getToken } = useAuth()
  return {
    isLoading: !isLoaded,
    isAuthenticated: Boolean(isSignedIn),
    fetchAccessToken: async ({ forceRefreshToken }: { forceRefreshToken: boolean }) =>
      getToken({ template: 'convex', skipCache: !forceRefreshToken }),
  }
}

function withClerk(children: ReactNode) {
  if (!clerkPublishableKey) return children
  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      proxyUrl={clerkProxyUrl}
      // Load Clerk JS from the public CDN so Vite doesn't swallow `/__clerk/npm/@clerk/...` paths.
      clerkJSUrl="https://cdn.jsdelivr.net/npm/@clerk/clerk-js@5/dist/clerk.browser.js"
      allowedRedirectOrigins={[
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'https://vcis-alpha.vercel.app',
        'https://vcis.edu.gh',
        'https://www.vcis.edu.gh',
      ]}
    >
      {children}
    </ClerkProvider>
  )
}

export function AppProviders({ children }: { children: ReactNode }) {
  const client = useMemo(
    () => (convexUrl ? new ConvexReactClient(convexUrl) : null),
    [],
  )

  if (!client) return withClerk(children)

  if (!clerkPublishableKey) {
    return <ConvexProvider client={client}>{children}</ConvexProvider>
  }

  return withClerk(
    <ConvexProviderWithAuth client={client} useAuth={useConvexAuth}>
      {children}
    </ConvexProviderWithAuth>,
  )
}
