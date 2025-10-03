/** biome-ignore-all lint/a11y/noSvgWithoutTitle: explanation */
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BookOpen, Mail} from "lucide-react";

export default function Footer() {
	const [hidden, setHidden] = useState(false);
	const [lastScroll, setLastScroll] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			const currentScroll = window.scrollY;
			if (currentScroll > lastScroll && currentScroll > 50) {
				// scrolling down
				setHidden(true);
			} else {
				// scrolling up
				setHidden(false);
			}
			setLastScroll(currentScroll);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [lastScroll]);

	return (
		<footer
			className={`fixed bottom-0 left-0 right-0 z-30 bg-[#F1F3F9] backdrop-blur-sm border-t border-gray-200 transition-transform duration-300 ${
				hidden ? "translate-y-full" : "translate-y-0"
			}`}
		>
			<div className="max-w-7xl mx-auto px-2 sm:px-6 py-2 sm:py-3">
				<div className="flex md:flex-row md:items-center justify-between gap-4 ">
					{/* Left Section */}
					<div className="flex sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
						<Image
							src="/bridgers-logo.png"
							alt="Bridgers"
							width={120}
							height={28}
							className="h-7 w-auto opacity-30 grayscale brightness-75 contrast-50 hidden sm:block"
						/>
						<div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide">
							<Button
								variant="ghost"
								size="sm"
								className="p-1 h-8 w-8 text-gray-400 hover:text-blue-400"
							>
								<svg
									className="w-4 h-4"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
								</svg>
							</Button>
							{/* Telegram */}
							<Button
								variant="ghost"
								size="sm"
								className="p-1 h-8 w-8 text-gray-400 hover:text-blue-500"
							>
								<svg
									className="w-4 h-4"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
								</svg>
							</Button>
							{/* Discord */}
							<Button
								variant="ghost"
								size="sm"
								className="p-1 h-8 w-8 text-gray-400 hover:text-indigo-500"
							>
								<svg
									className="w-4 h-4"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.3604-.698.7719-1.3628 1.225-1.9932a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719-1.3628 1.225-1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1568-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z" />
								</svg>
							</Button>
							{/* Medium */}
							<Button
								variant="ghost"
								size="sm"
								className="p-1 h-8 w-8 text-gray-400 hover:text-gray-600"
							>
								<svg
									className="w-4 h-4"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
								</svg>
							</Button>
						</div>
					</div>

					{/* Center Section */}
					<div className="flex sm:flex-row items-start sm:items-center gap-2 sm:gap-6 text-center sm:text-left">
						<Button
							variant="ghost"
							className="text-gray-600 hover:text-gray-800 font-poppins text-xs sm:text-sm flex items-center space-x-2"
						>
							<Image
								src="/docs-icon.png"
								alt="Docs"
								width={16}
								height={16}
								className="w-4 h-4"
							/>
							<span className="hidden sm:inline">Docs</span>
						</Button>
						<span className="text-gray-400 text-xs sm:text-sm font-poppins hidden sm:inline">
							©2025 Bridgers All Rights Reserved
						</span>
					</div>

					{/* Right Section */}
					<div className="flex sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
						<Button
							variant="ghost"
							className="text-gray-600 hover:text-gray-800 font-poppins text-xs sm:text-sm flex items-center space-x-2"
						>
							<BookOpen className="w-4 h-4" />
							<span className="hidden sm:inline">Tutorial</span>
						</Button>
						<Button
							variant="ghost"
							className="text-gray-600 hover:text-gray-800 font-poppins text-xs sm:text-sm flex items-center space-x-2 truncate"
						>
							<Mail className="w-4 h-4" />
							<span className="hidden sm:inline">contact@bridgers</span>
						</Button>
					</div>
				</div>
			</div>
		</footer>
	);
}
