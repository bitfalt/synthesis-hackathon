import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as React from 'react'
import { WagmiProvider } from 'wagmi'
import { walletConfig } from '~/lib/wallet'

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 15_000,
          refetchOnWindowFocus: true,
        },
        mutations: {
          retry: 0,
        },
      },
    }),
  )

  return (
    <WagmiProvider config={walletConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
