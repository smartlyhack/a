import Footer from "./components/footer";
import SwapWidget from "./components/SwapWidget";
import Image from "next/image";

export default function Component() {
	return (
		<div className="min-h-screen relative overflow-hidden font-poppins">
			{/* Curved Blue Background */}
			<div className="fixed inset-0 z-0">
				{/** biome-ignore lint/a11y/noSvgWithoutTitle: explanation */}
				<svg
					viewBox="0 0 1200 800"
					className="w-full h-full"
					preserveAspectRatio="xMidYMid slice"
				>
					<defs>
						{/** biome-ignore lint/correctness/useUniqueElementIds: explanation */}
						<linearGradient
							id="blueGradient"
							x1="0%"
							y1="0%"
							x2="100%"
							y2="100%"
						>
							<stop offset="0%" stopColor="#3B82F6" />
							<stop offset="100%" stopColor="#1D4ED8" />
						</linearGradient>
					</defs>

					{/* Background */}
					<rect width="100%" height="100%" fill="#F8F9FA" />

					{/* Curved Blue Section */}
					<path
						d="M0,0 L1200,0 L1200,400 Q600,600 0,400 Z"
						fill="url(#blueGradient)"
					/>
				</svg>
			</div>

			{/* Content Area */}
			<div className="relative z-10 p-8 pt-4 pb-20">
				<div className="text-center mt-4">
					{/* Header Info Image */}
					<div className="mb-6">
						<Image
							src="/header-info.png"
							alt="Allchain Bridge - Simpler, Faster, Safer"
							width={400}
							height={80}
							className="mx-auto"
							priority
						/>
					</div>

					{/* Banner Slider */}
					{/* <BannerSlider /> */}

					{/* Swap Section */}
					<SwapWidget />
				</div>
			</div>

			{/* Fixed Footer */}
			<Footer />
		</div>
	);
}
