import { type NextRequest, NextResponse } from 'next/server'

const ENDPOINTS: Record<number, string> = {
  1: 'https://api.0x.org/swap/v1/quote',
  10: 'https://optimism.api.0x.org/swap/v1/quote',
  56: 'https://bsc.api.0x.org/swap/v1/quote',
  137: 'https://polygon.api.0x.org/swap/v1/quote',
  42161: 'https://arbitrum.api.0x.org/swap/v1/quote',
  43114: 'https://avalanche.api.0x.org/swap/v1/quote',
  8453: 'https://base.api.0x.org/swap/v1/quote',
}

export async function GET(req: NextRequest) {
  const apiKey = process.env.ZEROEX_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'Missing ZEROEX_API_KEY' }, { status: 500 })

  const { searchParams } = new URL(req.url)
  const chainId = Number(searchParams.get('chainId') || '1')
  const endpoint = ENDPOINTS[chainId]
  if (!endpoint) return NextResponse.json({ error: 'Unsupported chainId' }, { status: 400 })

  searchParams.delete('chainId')
  const upstream = `${endpoint}?${searchParams.toString()}`

  const res = await fetch(upstream, {
    headers: {
      '0x-api-key': apiKey,
    },
    cache: 'no-store',
  })

  const body = await res.text()
  return new NextResponse(body, {
    status: res.status,
    headers: { 'content-type': res.headers.get('content-type') || 'application/json' },
  })
}
