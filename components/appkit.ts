'use client'

import { mainnet as evmMainnet, bsc as evmBsc } from 'viem/chains'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createAppKit } from '@reown/appkit/react'

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '7fb83121f24001fe287ad6e719130eab'

import type { AppKitNetwork } from '@reown/appkit/networks'

const mainnet: AppKitNetwork = {
  ...(evmMainnet as any),
  chainNamespace: 'eip155',
  caipNetworkId: `eip155:${evmMainnet.id}`
} as AppKitNetwork

const bsc: AppKitNetwork = {
  ...(evmBsc as any),
  chainNamespace: 'eip155',
  caipNetworkId: `eip155:${evmBsc.id}`
} as AppKitNetwork

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [bsc, mainnet]

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
  ssr: true
})

export const metadata = {
  name: 'Bridgers App',
  description: 'Cross-chain bridging platform',
  url: 'https://localhost',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Initialize AppKit on client only and ensure idempotency during HMR/StrictMode
declare global {
  interface Window { __APPKIT_CREATED?: boolean }
}

let appKitInstance: any = null;

if (typeof window !== 'undefined' && !window.__APPKIT_CREATED) {
  appKitInstance = createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks,
    metadata,
    features: { analytics: true }
  })
  window.__APPKIT_CREATED = true
  console.log('AppKit initialized successfully')
} else if (typeof window !== 'undefined') {
  console.log('AppKit already initialized')
}

// Add a function to check if AppKit is initialized
export const isAppKitInitialized = () => {
  if (typeof window !== 'undefined') {
    return !!window.__APPKIT_CREATED;
  }
  return false;
};

export { appKitInstance }

export default wagmiAdapter
