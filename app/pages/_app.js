import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { bsc, mainnet } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'
import { config } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false
const queryClient = new QueryClient()

const projectId = '7fb83121f24001fe287ad6e719130eab'

const networks = [bsc, mainnet]

const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [bsc.id]: http('https://bsc-dataseed1.binance.org'),
    [mainnet.id]: http('https://eth-mainnet.public.blastapi.io'),
  },
  ssr: true,
  projectId,
  networks,
})

const metadata = {
  name: 'Project Name',
  description: 'Project description',
  url: 'https://yourwebsiteurl.com',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
}

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [bsc, mainnet],
  metadata: metadata,
  features: {
    email: false,
    socials: false,
    emailShowWallets: false,
    analytics: false,
    swaps: false,
    onramp: false,
  },
  coinbasePreference: 'smartWalletOnly',
  themeMode: 'dark',
})

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="description" content="Transfer App." />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <title>Transfer App</title>
      </Head>
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
          <Toaster position="top-center" />
        </QueryClientProvider>
      </WagmiProvider>
    </>
  )
}
