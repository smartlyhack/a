"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ArrowUpDown } from "lucide-react";

export default function SwapSection() {
	const [activeTab, setActiveTab] = useState("SWAP");
	const [fromAmount, setFromAmount] = useState("0");
	const [toAmount, setToAmount] = useState("0");
	const [receivingAddress, setReceivingAddress] = useState("");
	const [fromToken, setFromToken] = useState("BTC(BTC)");
	const [toToken, setToToken] = useState("BTC(BTC)");

	const handleMaxClick = () => {
		setFromAmount("0"); // In real app, this would be the actual balance
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
		// In real app, calculate exchange rate here
		setToAmount(value); // Simplified 1:1 for demo
	};

	return (
		<div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 mt-8">
			{/* Tab Navigation */}
			<div className="flex bg-gray-100 rounded-xl p-1 mb-6">
				{["SWAP", "Gas Swap", "Bridge", "NFT"].map((tab) => (
					<button
						type="button"
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm font-poppins relative transition-all ${
							activeTab === tab
								? "bg-white text-black shadow-sm"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						{tab}
						{tab === "Gas Swap" && (
							<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
								NEW
							</span>
						)}
					</button>
				))}
			</div>

			{/* Token Selection Areas */}
			<div className="space-y-4 mb-6">
				{/* From Token */}
				<div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
					<button className="flex items-center space-x-3 hover:bg-gray-100 rounded-lg p-2 transition-colors">
						<div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
							<span className="text-white font-bold text-lg">₿</span>
						</div>
						<span className="font-semibold text-lg font-poppins">
							{fromToken}
						</span>
						<ChevronDown className="w-5 h-5 text-gray-400" />
					</button>

					<button className="flex items-center space-x-3 hover:bg-gray-100 rounded-lg p-2 transition-colors">
						<div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
							<span className="text-white font-bold text-lg">₿</span>
						</div>
						<span className="font-semibold text-lg font-poppins">
							{toToken}
						</span>
						<ChevronDown className="w-5 h-5 text-gray-400" />
					</button>
				</div>

				{/* Swap Arrow */}
				<div className="flex justify-center">
					<button
						onClick={handleSwapTokens}
						className="bg-blue-100 hover:bg-blue-200 p-3 rounded-full transition-colors"
					>
						<ArrowUpDown className="w-5 h-5 text-blue-600" />
					</button>
				</div>

				{/* Balance and Receive */}
				<div className="flex justify-between items-start">
					<div className="flex-1 pr-4">
						<div className="text-gray-500 text-sm mb-2 font-poppins">
							Balance: 0
						</div>
						<div className="flex items-center space-x-2">
							<Input
								type="number"
								value={fromAmount}
								onChange={(e) => handleAmountChange(e.target.value)}
								className="text-3xl font-bold border-none p-0 h-auto bg-transparent font-poppins text-gray-600 focus:ring-0"
								placeholder="0"
							/>
							<Button
								onClick={handleMaxClick}
								className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 text-sm font-poppins rounded-md"
							>
								MAX
							</Button>
						</div>
					</div>

					<div className="flex-1 text-right pl-4">
						<div className="text-gray-500 text-sm mb-2 font-poppins">
							Receive
						</div>
						<div className="text-3xl font-bold text-gray-600 font-poppins">
							{toAmount}
						</div>
					</div>
				</div>
			</div>

			{/* Receiving Address */}
			<div className="mb-6">
				<h3 className="text-xl font-semibold mb-3 font-poppins text-black">
					Receiving Address
				</h3>
				<Input
					value={receivingAddress}
					onChange={(e) => setReceivingAddress(e.target.value)}
					placeholder="Please enter the receiving address"
					className="w-full p-4 border border-gray-200 rounded-lg font-poppins text-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
				/>
				<p className="text-red-500 text-sm mt-2 font-poppins">
					Receiver can not be Exchange address
				</p>
			</div>

			{/* Transaction Details */}
			<div className="space-y-4 mb-6 bg-gray-50 rounded-xl p-4">
				<div className="flex justify-between items-center">
					<span className="text-gray-600 font-poppins">
						Select Exchange Path
					</span>
					<button className="text-blue-500 text-sm font-poppins hover:text-blue-600">
						More Price {">"}
					</button>
				</div>
				<div className="flex justify-between items-center">
					<span className="text-gray-600 font-poppins">Estimated Rate</span>
					<span className="text-gray-400 font-poppins">-</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="text-gray-600 font-poppins">Service Fee</span>
					<span className="text-gray-400 font-poppins">-</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="text-gray-600 font-poppins">You Will Received</span>
					<span className="text-gray-400 font-poppins">-</span>
				</div>
			</div>

			{/* Authorize Button */}
			<Button
				className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 text-lg font-semibold rounded-xl font-poppins transition-colors disabled:opacity-50"
				disabled={!receivingAddress || fromAmount === "0"}
			>
				Authorize & Route
			</Button>
		</div>
	);
}
