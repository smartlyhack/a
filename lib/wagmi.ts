import { http, createConfig } from 'wagmi'
import { mainnet, bsc, polygon, arbitrum, avalanche, base, optimism } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

const connectors = [
  injected(),
  ...(projectId
    ? [
        walletConnect({
          projectId,
          metadata: {
            name: 'Swap App',
            description: 'Connect with Reown (WalletConnect)',
            url: 'https://localhost',
            icons: ['https://raw.githubusercontent.com/WalletConnect/web3modal/HEAD/packages/html/public/images/walletconnect-logo.svg']
          }
        })
      ]
    : [])
]

export const config = createConfig({
  chains: [mainnet, bsc, polygon, arbitrum, avalanche, base, optimism],
  connectors,
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [avalanche.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
  },
})
