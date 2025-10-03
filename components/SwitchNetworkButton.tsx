"use client";

import { useState } from "react";
import { useAccount, useChainId, useDisconnect, useSwitchChain } from "wagmi";

function sliceAddress(addr?: string) {
	if (!addr || addr.length < 8) return addr || "";
	return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function SwitchNetworkButton() {
	const { address } = useAccount();
	const { disconnect } = useDisconnect();
	const chainId = useChainId();
	const { chains, switchChain } = useSwitchChain();
	const [isOpen, setIsOpen] = useState(false);

	const currentChain = chains.find((c) => c.id === chainId);

	return (
		<button
			type="button"
			className="relative flex flex-col items-center"
			onMouseEnter={() => setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
		>
			{/* Hover Trigger */}
			<div className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer shadow-md transition hover:bg-blue-700">
				{sliceAddress(address)}
			</div>

			{/* Hover Card */}
			{isOpen && (
				<div className="absolute top-full mt-2 w-64 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl p-4 text-white z-50 animate-slideDown">
					{/* Wallet */}
					<div className="mb-2">
						<span className="text-gray-300 text-xs">Wallet:</span>
						<div className="font-semibold truncate">
							{sliceAddress(address) || "Not connected"}
						</div>
					</div>
					{address &&
					<button
						className="w-full py-2 px-4 rounded-lg font-semibold transition-all bg-red-500 hover:bg-red-600 text-white"
						onClick={() => disconnect()}>Disconnect</button>}

					{/* Network */}
					<div className="mb-3">
						<span className="text-gray-300 text-xs">Network:</span>
						<div className="flex items-center justify-between mt-1">
							<span className="font-semibold">
								{currentChain?.name || "Unknown"}
							</span>
							{chains.length > 0 && (
								<button
									type="button"
									className="px-2 py-1 text-xs bg-blue-500/60 hover:bg-blue-500 rounded transition"
								>
									Change
								</button>
							)}
						</div>
					</div>

					{/* Network Switch Buttons */}
					{chains.length > 0 && (
						<div className="mt-2 flex flex-col space-y-1  overflow-y-auto">
							{chains.map((chain) => (
								<button
									type="button"
									key={chain.id}
									onClick={() => switchChain?.({ chainId: chain.id })}
									className={`text-left p-2 rounded hover:bg-white/20 transition ${chain.id === chainId ? "bg-blue-600" : ""
										}`}
								>
									{chain.name}
								</button>
							))}
						</div>
					)}
				</div>
			)}

			<style jsx>{`
				@keyframes slideDown {
					from {
						transform: translateY(-5px);
						opacity: 0;
					}
					to {
						transform: translateY(0);
						opacity: 1;
					}
				}
				.animate-slideDown {
					animation: slideDown 0.2s ease-out;
				}
			`}</style>
		</button>
	);
}
