"use client"

import './appkit'
import { useAppKit } from '@reown/appkit/react'
import { useAccount, useChainId } from 'wagmi'
import { useEffect, useState } from 'react'
import { useLogger } from '@/hooks/useLogger'

export default function ConnectButton({ className }: { className?: string }) {
  const { open } = useAppKit()
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [hasLoggedConnection, setHasLoggedConnection] = useState(false)
  
  const getNetworkName = (id: number) => {
    const networkNames: Record<number, string> = {
      1: "Ethereum",
      56: "BSC",
      137: "Polygon",
      43114: "Avalanche",
      42161: "Arbitrum",
    };
    return networkNames[id] || "Unknown";
  };
  
  const logger = useLogger(address as `0x${string}` | undefined, getNetworkName(chainId))
  
  // Track wallet connection changes
  useEffect(() => {
    if (isConnected && address && !hasLoggedConnection) {
      logger.logWalletConnect();
      setHasLoggedConnection(true);
    } else if (!isConnected && hasLoggedConnection) {
      logger.logWalletDisconnect();
      setHasLoggedConnection(false);
    }
  }, [isConnected, address, hasLoggedConnection, logger])

  const sliceAddress = (addr?: string) => {
    if (!addr || addr.length < 8) return addr || ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (!address) {
    return (
      <button onClick={() => open({ view: 'Connect' })} className={className || 'px-3 py-2 rounded bg-gray-600 text-white'}>
        Authorize & Route
      </button>
    )
  }

  return (
    <button onClick={() => open({ view: 'Account' })} className={className || 'px-3 py-2 rounded bg-gray-600 text-white'}>
      {sliceAddress(address)}
    </button>
  )
}
