import { useMemo, type ReactNode } from 'react'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { ConvexProvider, ConvexProviderWithAuth, ConvexReactClient } from 'convex/react'

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined

function useConvexAuth() {
  const { isLoaded, isSignedIn, getToken } = useAuth()
  return {
    isLoading: !isLoaded,
    isAuthenticated: Boolean(isSignedIn),
    fetchAccessToken: async ({ forceRefreshToken }: { forceRefreshToken: boolean }) =>
      getToken({ template: 'convex', skipCache: !forceRefreshToken }),
  }
}

export function AppProviders({ children }: { children: ReactNode }) {
  const client = useMemo(
    () => (convexUrl ? new ConvexReactClient(convexUrl) : null),
    [],
  )

  if (!client) {
    return clerkPublishableKey ? (
      <ClerkProvider publishableKey={clerkPublishableKey}>{children}</ClerkProvider>
    ) : (
      children
    )
  }

  if (!clerkPublishableKey) {
    return <ConvexProvider client={client}>{children}</ConvexProvider>
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <ConvexProviderWithAuth client={client} useAuth={useConvexAuth}>
        {children}
      </ConvexProviderWithAuth>
    </ClerkProvider>
  )
}
