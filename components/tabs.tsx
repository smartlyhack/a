import React, { useState } from "react";

interface Tab {
	value: string;
	label: string;
	image: string;
}

interface TabsProps {
	tabs: Tab[];
	onChange?: (value: string) => void;
	initial?: string;
}

export default function Tabs({ tabs, onChange, initial }: TabsProps) {
	const [activeTab, setActiveTab] = useState(initial || tabs[0].value);

	const handleClick = (value: string) => {
		setActiveTab(value);
		if (onChange) onChange(value);
	};

	return (
		<div className="flex bg-gray-100 h-14 flex-wrap justify-center content-center rounded-lg overflow-hidden">
			{tabs.map((tab) => (
				<button
					type="button"
					key={tab.value}
					onClick={() => handleClick(tab.value)}
					className={`flex-1 items-center text-center justify-center h-full text-[1.33rem] font-bold font-poppins relative transition-all cursor-pointer
            ${activeTab === tab.value ? "text-black" : "text-gray-500 hover:text-gray-700"}
          `}
				>
					{/* Background image for active tab */}
					{activeTab === tab.value && (
						// biome-ignore lint/performance/noImgElement: gg
						<img
							className="absolute h-full left-0 right-0 w-full top-1/2 -translate-y-1/2 z-0"
							src={tab.image}
							alt={tab.label}
						/>
					)}

					{/* Tab label */}
					<span className="flex justify-center items-center w-full h-full absolute left-0 top-0 bottom-0 z-10">
						{tab.label}
					</span>
				</button>
			))}
		</div>
	);
}
