import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get credentials from environment variables
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json(
        { error: "Missing Telegram credentials in environment variables" },
        { status: 500 }
      );
    }

    // Send test message to Telegram
    const testMessage = `
🧪 **TEST MESSAGE**
━━━━━━━━━━━━━━━━
This is a test message from your swap application.
If you can see this, the Telegram integration is working correctly!
━━━━━━━━━━━━━━━━
✅ Bot Token: Active
✅ Chat ID: ${chatId}
✅ API Endpoint: Working
━━━━━━━━━━━━━━━━
    `.trim();

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: testMessage,
          parse_mode: "Markdown",
          disable_web_page_preview: false,
        }),
      }
    );

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.json();
      console.error("Telegram API error:", errorData);
      return NextResponse.json(
        { error: "Failed to send message to Telegram", details: errorData },
        { status: 500 }
      );
    }

    const result = await telegramResponse.json();
    return NextResponse.json({ 
      success: true, 
      message: "Test message sent successfully to Telegram group!",
      result 
    });
  } catch (error) {
    console.error("Error sending test message:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}