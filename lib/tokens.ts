export type Chain = {
  id: number
  name: string
  native: { symbol: string; wrapped: string }
}

export type Token = {
  chainId: number
  symbol: string
  address: string // 'ETH'|'MATIC' etc for native, or ERC-20 address
  name: string
  decimals: number
}

export const CHAINS: Chain[] = [
  { id: 1, name: 'Ethereum', native: { symbol: 'ETH', wrapped: '0xC02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2' } },
  { id: 10, name: 'Optimism', native: { symbol: 'ETH', wrapped: '0x4200000000000000000000000000000000000006' } },
  { id: 56, name: 'BNB Chain', native: { symbol: 'BNB', wrapped: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' } },
  { id: 137, name: 'Polygon', native: { symbol: 'MATIC', wrapped: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270' } },
  { id: 42161, name: 'Arbitrum', native: { symbol: 'ETH', wrapped: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1' } },
  { id: 43114, name: 'Avalanche', native: { symbol: 'AVAX', wrapped: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7' } },
  { id: 8453, name: 'Base', native: { symbol: 'ETH', wrapped: '0x4200000000000000000000000000000000000006' } },
]

// 50+ tokens across chains (native placeholders use symbol instead of address for 0x)
export const TOKENS: Token[] = [
  // ================== Ethereum ==================
  { chainId: 1, symbol: 'ETH',   address: 'ETH',  name: 'Ether', decimals: 18 },
  { chainId: 1, symbol: 'WETH',  address: '0xC02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2', name: 'Wrapped Ether', decimals: 18 },
  { chainId: 1, symbol: 'USDC',  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', name: 'USD Coin', decimals: 6 },
  { chainId: 1, symbol: 'USDT',  address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', name: 'Tether USD', decimals: 6 },
  { chainId: 1, symbol: 'DAI',   address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', name: 'Dai', decimals: 18 },
  { chainId: 1, symbol: 'WBTC',  address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', name: 'Wrapped BTC', decimals: 8 },
  { chainId: 1, symbol: 'UNI',   address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', name: 'Uniswap', decimals: 18 },
  { chainId: 1, symbol: 'LINK',  address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', name: 'Chainlink', decimals: 18 },
  { chainId: 1, symbol: 'AAVE',  address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', name: 'Aave', decimals: 18 },
  { chainId: 1, symbol: 'MKR',   address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', name: 'Maker', decimals: 18 },
  { chainId: 1, symbol: 'PEPE',  address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933', name: 'Pepe', decimals: 18 },
  { chainId: 1, symbol: 'SHIB',  address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', name: 'Shiba Inu', decimals: 18 },
  { chainId: 1, symbol: 'COMP',  address: '0xc00e94Cb662C3520282E6f5717214004A7f26888', name: 'Compound', decimals: 18 },
  { chainId: 1, symbol: 'SNX',   address: '0xC011A73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F', name: 'Synthetix', decimals: 18 },
  { chainId: 1, symbol: 'CRV',   address: '0xD533a949740bb3306d119CC777fa900bA034cd52', name: 'Curve DAO', decimals: 18 },
  { chainId: 1, symbol: 'SUSHI', address: '0x6B3595068778DD592e39A122f4f5a5CF09C90fE2', name: 'Sushi', decimals: 18 },
  { chainId: 1, symbol: 'BAL',   address: '0xba100000625a3754423978a60c9317c58a424e3D', name: 'Balancer', decimals: 18 },
  { chainId: 1, symbol: 'GRT',   address: '0xc944E90C64B2c07662A292be6244BDf05Cda44a7', name: 'The Graph', decimals: 18 },
  { chainId: 1, symbol: 'MANA',  address: '0x0f5D2fB29fb7d3CFeE444a200298f468908cC942', name: 'Decentraland', decimals: 18 },
  { chainId: 1, symbol: 'SAND',  address: '0x3845badAde8e6dFF049820680d1F14bD3903a5d0', name: 'The Sandbox', decimals: 18 },
  { chainId: 1, symbol: 'LDO',   address: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32', name: 'Lido DAO', decimals: 18 },
  { chainId: 1, symbol: 'ENS',   address: '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72', name: 'Ethereum Name Service', decimals: 18 },
  { chainId: 1, symbol: 'RPL',   address: '0xD33526068D116cE69F19A9ee46F0bd304F21A51f', name: 'Rocket Pool', decimals: 18 },
  { chainId: 1, symbol: '1INCH', address: '0x111111111117dC0aa78b770fA6A738034120C302', name: '1inch', decimals: 18 },
  { chainId: 1, symbol: 'BAT',   address: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF', name: 'Basic Attention Token', decimals: 18 },
  { chainId: 1, symbol: 'YFI',   address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e', name: 'yearn.finance', decimals: 18 },

  // ================== Optimism ==================
  { chainId: 10, symbol: 'ETH',  address: 'ETH', name: 'Ether', decimals: 18 },
  { chainId: 10, symbol: 'WETH', address: '0x4200000000000000000000000000000000000006', name: 'Wrapped Ether', decimals: 18 },
  { chainId: 10, symbol: 'USDC', address: '0x0b2c639c533813f4aa9d7837caf62653d097ff85', name: 'USD Coin', decimals: 6 },
  { chainId: 10, symbol: 'USDT', address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58', name: 'Tether USD', decimals: 6 },
  { chainId: 10, symbol: 'DAI',  address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', name: 'Dai', decimals: 18 },
  { chainId: 10, symbol: 'OP',   address: '0x4200000000000000000000000000000000000042', name: 'Optimism', decimals: 18 },
  { chainId: 10, symbol: 'LINK', address: '0x350a791Bfc2c21F9Ed5d10980Dad2e2638ffa7f6', name: 'Chainlink', decimals: 18 },
  { chainId: 10, symbol: 'WBTC', address: '0x68f180fcce6836688e9084f035309e29bf0a2095', name: 'Wrapped BTC', decimals: 8 },

  // ================== BNB Chain ==================
  { chainId: 56, symbol: 'BNB',  address: 'BNB', name: 'BNB', decimals: 18 },
  { chainId: 56, symbol: 'WBNB', address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', name: 'Wrapped BNB', decimals: 18 },
  { chainId: 56, symbol: 'USDT', address: '0x55d398326f99059ff775485246999027b3197955', name: 'Tether USD', decimals: 18 },
  { chainId: 56, symbol: 'USDC', address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', name: 'USD Coin', decimals: 18 },
  { chainId: 56, symbol: 'BUSD', address: '0xe9e7cea3dedca5984780bafc599bd69add087d56', name: 'Binance USD', decimals: 18 },
  { chainId: 56, symbol: 'CAKE', address: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', name: 'PancakeSwap', decimals: 18 },
  { chainId: 56, symbol: 'BTCB', address: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c', name: 'Binance-Peg BTCB', decimals: 18 },
  { chainId: 56, symbol: 'ETH',  address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', name: 'Binance-Peg ETH', decimals: 18 },

  // ================== Polygon ==================
  { chainId: 137, symbol: 'MATIC',  address: 'MATIC', name: 'MATIC', decimals: 18 },
  { chainId: 137, symbol: 'WMATIC', address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', name: 'Wrapped MATIC', decimals: 18 },
  { chainId: 137, symbol: 'USDC',   address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', name: 'USD Coin', decimals: 6 },
  { chainId: 137, symbol: 'USDT',   address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', name: 'Tether USD', decimals: 6 },
  { chainId: 137, symbol: 'WETH',   address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', name: 'Wrapped Ether', decimals: 18 },
  { chainId: 137, symbol: 'WBTC',   address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', name: 'Wrapped BTC', decimals: 8 },
  { chainId: 137, symbol: 'AAVE',   address: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B', name: 'Aave', decimals: 18 },
  { chainId: 137, symbol: 'LINK',   address: '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39', name: 'Chainlink', decimals: 18 },
  { chainId: 137, symbol: 'QUICK',  address: '0x831753dd7087cac61ab5644b308642cc1c33dc13', name: 'Quickswap', decimals: 18 },

  // ================== Arbitrum ==================
  { chainId: 42161, symbol: 'ETH',  address: 'ETH', name: 'Ether', decimals: 18 },
  { chainId: 42161, symbol: 'WETH', address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', name: 'Wrapped Ether', decimals: 18 },
  { chainId: 42161, symbol: 'USDC', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', name: 'USD Coin', decimals: 6 },
  { chainId: 42161, symbol: 'USDT', address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', name: 'Tether USD', decimals: 6 },
  { chainId: 42161, symbol: 'ARB',  address: '0x912CE59144191C1204E64559FE8253a0e49E6548', name: 'Arbitrum', decimals: 18 },
  { chainId: 42161, symbol: 'WBTC', address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f', name: 'Wrapped BTC', decimals: 8 },
  { chainId: 42161, symbol: 'GMX',  address: '0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a', name: 'GMX', decimals: 18 },
  { chainId: 42161, symbol: 'MAGIC',address: '0x539bdE0d7Dbd336b79148AA742883198BBF60342', name: 'Magic', decimals: 18 },
  { chainId: 42161, symbol: 'LINK', address: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4', name: 'Chainlink', decimals: 18 },
  { chainId: 42161, symbol: 'RDNT', address: '0x3082CC23568ea640225c2467653dB90e9250AaA0', name: 'Radiant', decimals: 18 },

  // ================== Avalanche ==================
  { chainId: 43114, symbol: 'AVAX',   address: 'AVAX', name: 'Avalanche', decimals: 18 },
  { chainId: 43114, symbol: 'WAVAX',  address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', name: 'Wrapped AVAX', decimals: 18 },
  { chainId: 43114, symbol: 'USDC',   address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', name: 'USD Coin', decimals: 6 },
  { chainId: 43114, symbol: 'USDT',   address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7', name: 'Tether USD', decimals: 6 },
  { chainId: 43114, symbol: 'WETH.e', address: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB', name: 'Wrapped Ether (Bridge)', decimals: 18 },
  { chainId: 43114, symbol: 'WBTC.e', address: '0x50b7545627a5162F82A992c33b87aDc75187B218', name: 'Wrapped BTC (Bridge)', decimals: 8 },
  { chainId: 43114, symbol: 'JOE',    address: '0x6e84a6216ea6dacc71ee8e6b0a5b7322eb0bdb00', name: 'Trader Joe', decimals: 18 },
  { chainId: 43114, symbol: 'LINK.e', address: '0x5947BB275c521040051D82396192181b413227A3', name: 'Chainlink (Bridge)', decimals: 18 },
  { chainId: 43114, symbol: 'DAI.e',  address: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70', name: 'Dai (Bridge)', decimals: 18 },

  // ================== Base ==================
  { chainId: 8453, symbol: 'ETH',  address: 'ETH', name: 'Ether', decimals: 18 },
  { chainId: 8453, symbol: 'WETH', address: '0x4200000000000000000000000000000000000006', name: 'Wrapped Ether', decimals: 18 },
  { chainId: 8453, symbol: 'USDC', address: '0x833589fCD6EDb6E08f4c7C32D4f71B54bDa02913', name: 'USD Coin', decimals: 6 },
  { chainId: 8453, symbol: 'cbETH',address: '0xBe9895146f7AF43049ca1c1AE358B0541Ea49704', name: 'Coinbase Wrapped Staked ETH', decimals: 18 },
  { chainId: 8453, symbol: 'AERO', address: '0x9401819dffb4a8c3ad4eb3c2de0dffa8a3f5a7e9', name: 'Aerodrome', decimals: 18 },
]
