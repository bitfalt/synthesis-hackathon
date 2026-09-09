import { createConfig, http } from 'wagmi'
import { base, mainnet } from 'wagmi/chains'
import { coinbaseWallet, injected } from 'wagmi/connectors'

export const walletConfig = createConfig({
  chains: [base, mainnet],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
    coinbaseWallet({
      appName: 'Aegis Treasury Guardrails',
    }),
  ],
  multiInjectedProviderDiscovery: true,
  ssr: true,
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
})
