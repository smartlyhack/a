"use client";

import Image from "next/image";
import { useState } from "react";

interface Exchange {
	id: string;
	name: string;
	logo: string;
	recommended?: boolean;
	fast?: boolean;
	estimateTime: string;
}

const exchanges: Exchange[] = [
	{
		id: "omni",
		name: "OmniBridge",
		logo: "https://images.allchainbridge.com/dex/OmniBridge.svg",
		recommended: true,
		fast: true,
		estimateTime: "1~3 Minutes",
	},
	{
		id: "other1",
		name: "BridgeX",
		logo: "https://images.bridgers.xyz/dex/bridgers1.png",
		estimateTime: "2~4 Minutes",
	},
];

export function ExchangeList({ quantity = "0" }: { quantity: string }) {
	const [showModal, setShowModal] = useState(false);
	const [selectedExchange, setSelectedExchange] = useState<Exchange>(
		exchanges[0],
	);

	return (
		<div className="p-3 sm:p-4">
			{/* Exchange card preview */}
			<div className="flex justify-between items-center">
				<span className="text-gray-600 font-poppins text-sm sm:text-base">
					Select Exchange Path
				</span>
				<button
					type="button"
					className="text-blue-400 cursor-pointer text-xs sm:text-sm hover:underline"
					onClick={() => setShowModal(true)}
				>
					More Price &gt;
				</button>
			</div>

			{/* Selected Exchange Card */}
			<div className="flex justify-between items-center bg-white/10 backdrop-blur-lg rounded p-4 sm:p-5 mb-2 border border-purple-700">
				<div className="flex flex-col space-y-2 sm:space-y-3">
					<div className="flex items-center space-x-2">
						<Image
							width={24}
							height={24}
							src={selectedExchange.logo}
							alt={selectedExchange.name}
							className="w-5 h-5 sm:w-6 sm:h-6"
						/>
						<span className="text-sm sm:text-base">
							{selectedExchange.name}
						</span>
					</div>
					<p className="text-[11px] sm:text-xs md:text-sm">
						Received quantity： {quantity}
					</p>
				</div>
				<div className="flex items-center space-x-1 sm:space-x-2">
					{selectedExchange.recommended && (
						<span className="bg-yellow-400/20 text-yellow-300 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-semibold">
							<span className="sm:inline hidden">RECOMMENDED</span>
							<span className="inline sm:hidden">REC</span>
						</span>
					)}
					{selectedExchange.fast && (
						<span className="bg-green-400/20 text-green-300 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-semibold">
							<span className="sm:inline hidden">FAST</span>
							<span className="inline sm:hidden">F</span>
						</span>
					)}
				</div>
			</div>

			{/* Modal */}
			{showModal && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 animate-fadeIn">
					<div className="bg-white border border-gray-200 shadow-xl text-black p-4 sm:p-6 rounded-xl sm:rounded-2xl w-[90%] sm:w-96 animate-slideUp">
						<h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">
							💱 Select Exchange
						</h2>

						<div className="space-y-2 max-h-72 sm:max-h-80 overflow-y-auto">
							{exchanges.map((ex) => (
								<button
									type="button"
									key={ex.id}
									className="flex justify-between items-center p-3 sm:p-4 h-16 sm:h-20 rounded-lg w-full hover:bg-gray-100 cursor-pointer transition"
									onClick={() => {
										setSelectedExchange(ex);
										setShowModal(false);
									}}
								>
									<div className="flex items-center space-x-2">
										<Image
											width={24}
											height={24}
											src={ex.logo}
											alt={ex.name}
											className="w-5 h-5 sm:w-6 sm:h-6"
										/>
										<div>
											<div className="font-medium text-sm sm:text-base">
												{ex.name}
											</div>
										</div>
									</div>
									<div className="flex flex-col items-end space-y-1 text-right">
										{ex.recommended && (
											<span className="bg-yellow-100 text-yellow-700 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-semibold">
												<span className="sm:inline hidden">RECOMMENDED</span>
												<span className="inline sm:hidden">REC</span>
											</span>
										)}
										{ex.fast && (
											<span className="bg-green-100 text-green-700 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-semibold">
												<span className="sm:inline hidden">FAST</span>
												<span className="inline sm:hidden">F</span>
											</span>
										)}
										<span className="text-gray-500 text-[10px] sm:text-xs">
											{ex.estimateTime}
										</span>
									</div>
								</button>
							))}
						</div>

						<button
							type="button"
							onClick={() => setShowModal(false)}
							className="mt-4 w-full p-2 sm:p-3 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base transition"
						>
							Close
						</button>
					</div>

					<style jsx>{`
						@keyframes fadeIn {
							from { opacity: 0; }
							to { opacity: 1; }
						}
						@keyframes slideUp {
							from { transform: translateY(20px); opacity: 0; }
							to { transform: translateY(0); opacity: 1; }
						}
						.animate-fadeIn { animation: fadeIn 0.3s ease-out; }
						.animate-slideUp { animation: slideUp 0.3s ease-out; }
					`}</style>
				</div>
			)}
		</div>
	);
}
