export type QuoteParams = {
  chainId: number
  sellToken: string
  buyToken: string
  sellAmount?: string
  buyAmount?: string
  takerAddress?: string
  slippagePercentage?: number
}

export type QuoteResponse = {
  price: string
  guaranteedPrice: string
  to: string
  data: string
  value: string
  gas: string
  estimatedGas: string
  from: string
  sellAmount: string
  sellTokenAddress: string
  buyTokenAddress: string
  allowanceTarget: string
}

export async function fetchQuote(params: QuoteParams) {
  const query = new URLSearchParams()
  query.set('sellToken', params.sellToken)
  query.set('buyToken', params.buyToken)
  if (params.sellAmount) query.set('sellAmount', params.sellAmount)
  if (params.buyAmount) query.set('buyAmount', params.buyAmount)
  if (params.takerAddress) query.set('takerAddress', params.takerAddress)
  if (params.slippagePercentage != null) query.set('slippagePercentage', String(params.slippagePercentage))

  const res = await fetch(`/api/zeroex/quote?chainId=${params.chainId}&${query.toString()}`)
  if (!res.ok) throw new Error(`Quote failed: ${res.status}`)
  return res.json() as Promise<QuoteResponse>
}
