"use client";

import { useState } from "react";
import { LuFileBox } from "react-icons/lu";

export const RouteLogs: React.FC = () => {
	const tabs = ["OmniBridge", "Bridgers", "Aggregator", "CrossChainX", "NFT"];
	const [activeTab, setActiveTab] = useState<string>("OmniBridge");

	return (
		<div className="font-sans bg-white rounded-xl p-6 max-w-[650px] mx-auto shadow-md">
			{/* Header */}
			<div className="flex justify-between items-center mb-6 text-lg sm:text-2xl">
				<div className="flex items-center text-2xl font-semibold text-gray-800">
					<span className="mr-3 text-gray-600">
						<LuFileBox size={24} />
					</span>
					Route Logs
				</div>
				<a
					href="#s"
					className="text-blue-500 text-base font-medium hover:underline cursor-pointer"
				>
					more &gt;
				</a>
			</div>

			{/* Tabs */}
			<div className="flex gap-5 pb-2 border-b border-gray-200 mb-7 overflow-x-auto whitespace-wrap">
				{tabs.map((tab) => (
					<button
						key={tab}
						type="button"
						onClick={() => setActiveTab(tab)}
						className={`relative pb-2 cursor-pointer transition-colors text-xs sm:text-sm ${
							activeTab === tab
								? "font-semibold text-black after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[2px] after:bg-black"
								: "font-medium text-gray-500 hover:text-black"
						}`}
					>
						{tab}
					</button>
				))}
			</div>

			{/* Info text */}
			<p className="text-gray-500 leading-relaxed px-2 text-xs sm:text-sm">
				The protocol does not custody assets. Transactions are executed via
				user-authorized smart contracts.
			</p>
		</div>
	);
};
