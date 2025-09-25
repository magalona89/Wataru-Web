exports.meta = {
  name: "terms",
  version: "1.0.2",
  description: "View the Terms of Service for NOVA LLAMA ASSISTANT",
  category: "info",
  prefix: "both",
  guide: "Use !terms or /terms to view the bot's terms."
};

exports.onStart = async function ({ wataru, msg }) {
  const now = new Date();
  const formattedTime = now.toLocaleString("en-PH", { timeZone: "Asia/Manila" });

  const tos = `
📜 *NOVA LLAMA ASSISTANT — Terms of Service*

🕒 Current Time (Manila): ${formattedTime}

Last Updated: September 25, 2025

1️⃣ *Acceptance of Terms*
By using NOVA LLAMA ASSISTANT, you agree to these terms.

2️⃣ *Features*
This bot provides tools, automation, and assistant features. Usage is intended for informational and productivity purposes.

3️⃣ *User Responsibilities*
- Do not spam or abuse the bot.
- Do not attempt to exploit or damage any part of the service.
- Follow the rules of the platform or group where the bot is used.

4️⃣ *Privacy*
- We store only minimal user data (e.g., ID, basic usage info).
- We do not collect personal or sensitive information.
- Your data is only used for the bot's core functions.

5️⃣ *Availability*
- The bot is provided “as is” and may be updated or taken offline at any time.
- We do not guarantee 100% uptime or stability.

6️⃣ *Prohibited Use*
- You may not use the bot for illegal, abusive, or malicious purposes.
- Automated abuse, reverse engineering, or manipulation is not allowed.

7️⃣ *Changes*
These terms may be updated anytime without prior notice.

📩 For support or questions, contact the bot administrator.

---

💡 *How to use NOVA LLAMA ASSISTANT:*

Just type your question or command prefixed with *nova*.

Example:

\`nova what is technology\`

Thank you for using NOVA LLAMA ASSISTANT. 🦙
`;

  await wataru.reply(tos.trim());
};
