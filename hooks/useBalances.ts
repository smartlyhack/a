import { useEffect, useState } from "react";
import { useBalance, useReadContracts } from "wagmi";
import erc20Abi from "@/abi/erc20.json";

export function useBalances(address: `0x${string}`, selectedChainId: number, tokenAddresses: any) {
  const [nativeBalance, setNativeBalance] = useState(null);
  const [tokenBalances, setTokenBalances] = useState({});

  const { data: nativeBalanceData } = useBalance({
    address,
    chainId: selectedChainId,
  });

  const tokenContracts = Object.entries(tokenAddresses).map(([_, addr]) => ({
    address: addr,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address],
  })) as any;

  const { data: tokenBalancesData } = useReadContracts({
    contracts: tokenContracts,
  });

  useEffect(() => {
    if (nativeBalanceData) setNativeBalance(nativeBalanceData as any);
  }, [nativeBalanceData]);

  useEffect(() => {
    if (tokenBalancesData) {
      const balances = {};
      Object.keys(tokenAddresses).forEach((symbol, i) => {
        if (tokenBalancesData[i]?.result) {
          balances[symbol] = tokenBalancesData[i].result;
        }
      });
      setTokenBalances(balances);
    }
  }, [tokenBalancesData, tokenAddresses]);

  return { nativeBalance, tokenBalances };
}
