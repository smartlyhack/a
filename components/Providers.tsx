"use client";

import { type ReactNode, useState } from "react";
import { WagmiProvider } from "wagmi";

import { cookieStorage, createStorage, http } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import {
	mainnet,
	bsc,
	polygon,
	avalanche,
	arbitrum,
	type AppKitNetwork,
} from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";

// Only include supported networks
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [
	mainnet,
	bsc,
	polygon,
	avalanche,
	arbitrum,
];

export const projectId = process.env
	.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string;

const wagmiAdapter = new WagmiAdapter({
	storage: createStorage({
		storage: cookieStorage,
	}),
	transports: {
		[mainnet.id]: http("https://eth-mainnet.public.blastapi.io"),
		[bsc.id]: http("https://bsc-dataseed1.binance.org"),
		[polygon.id]: http("https://polygon-rpc.com"),
		[avalanche.id]: http("https://api.avax.network/ext/bc/C/rpc"),
		[arbitrum.id]: http("https://arb1.arbitrum.io/rpc"),
	},
	ssr: true,
	projectId,
	networks,
});

const metadata = {
	name: "DevilDrain.us",
	description: "Project description",
	url: "https://yourwebsiteurl.com",
	icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

createAppKit({
	adapters: [wagmiAdapter],
	projectId,
	networks,
	metadata,
	features: {
		email: false,
		socials: false,
		emailShowWallets: false,
		analytics: false,
		swaps: false,
		onramp: false,
	},
	coinbasePreference: "smartWalletOnly",
	themeMode: "dark",
});

export default function Providers({ children }: { children: ReactNode }) {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<WagmiProvider config={wagmiAdapter.wagmiConfig}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</WagmiProvider>
	);
}