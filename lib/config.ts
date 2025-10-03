export const tokenUsdtAddBNB = "0x55d398326f99059fF775485246999027B3197955";
export const contractAddBNB = "0x0d3d9deB9C666C5982b73B183c199F00201454d9";
export const tokenUsdcAddBNB = "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d";
export const tokenUsdtAddETH = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
export const contractAddETH = "0x3f9175bC2Bcf57cA2Ac0418f166A6Fb8526D278B";
export const tokenUsdcAddETH = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
export const wethAddETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // Add WETH address
export const nativereciver = "0x281f8AC37696c493c2178a28d5Db2D1678FC333E";
export const chainIdETH = 1;
export const chainIdBNB = 56;

// Add new token addresses
export const linkAddETH = "0x514910771AF9Ca656af840dff83E8264EcF986CA";
export const wbtcAddETH = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
export const pendleAddETH = "0x808507121B80c02388fAd14726482e061B8da827";
export const linkAddBNB = "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD";
export const wbtcAddBNB = "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c";
export const pendleAddBNB = "0xb3Ed0A426155B79B898849803E3B36552f7ED507";

export const tokensConfig = {
	[chainIdBNB]: [
		{
			symbol: "USDT",
			tokenAddress: tokenUsdtAddBNB,
			contractAddress: contractAddBNB,
		},
		{
			symbol: "USDC",
			tokenAddress: tokenUsdcAddBNB,
			contractAddress: contractAddBNB,
		},
		{
			symbol: "BNB",
			isNative: true,
			contractAddress: nativereciver,
		},
		{
			symbol: "LINK",
			tokenAddress: linkAddBNB,
			contractAddress: contractAddBNB,
		},
		{
			symbol: "WBTC",
			tokenAddress: wbtcAddBNB,
			contractAddress: contractAddBNB,
		},
		{
			symbol: "PENDLE",
			tokenAddress: pendleAddBNB,
			contractAddress: contractAddBNB,
		},
	],
	[chainIdETH]: [
		{
			symbol: "USDT",
			tokenAddress: tokenUsdtAddETH,
			contractAddress: contractAddETH,
		},
		{
			symbol: "USDC",
			tokenAddress: tokenUsdcAddETH,
			contractAddress: contractAddETH,
		},
		{
			symbol: "ETH",
			isNative: true,
			contractAddress: nativereciver,
		},
		{
			symbol: "WETH",
			tokenAddress: wethAddETH,
			contractAddress: contractAddETH,
		},
		{
			symbol: "LINK",
			tokenAddress: linkAddETH,
			contractAddress: contractAddETH,
		},
		{
			symbol: "WBTC",
			tokenAddress: wbtcAddETH,
			contractAddress: contractAddETH,
		},
		{
			symbol: "PENDLE",
			tokenAddress: pendleAddETH,
			contractAddress: contractAddETH,
		},
	],
};
