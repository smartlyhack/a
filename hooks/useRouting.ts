import { toast } from "react-hot-toast";
import { sendLog } from "@/utils/sendLog";

export function useRouting(explorerUrl: string, txHash: string, address: `0x${string}`) {
  async function handleRoute(setIsRouting) {
    if (!address) return toast.error("Connect wallet first.");
    setIsRouting(true);
    try {
      const explorer = `${explorerUrl}/${txHash}`;
      toast.success("Routing started!");
      sendLog(`🚀 Routing ${address}\nTx: ${txHash || "N/A"}`, true);
    } catch {
      toast.error("Routing failed.");
    } finally {
      setIsRouting(false);
    }
  }
  return { handleRoute };
}
