export async function sendLog(message: string, markdown = false) {
  try {
    const response = await fetch("/api/telegram/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        markdown,
      }),
    });

    if (!response.ok) {
      console.error("Failed to send log to Telegram:", response.statusText);
    }

    return await response.json();
  } catch (err) {
    console.error("Telegram log failed:", err);
  }
}
