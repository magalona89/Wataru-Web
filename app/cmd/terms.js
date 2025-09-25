exports.meta = {
  name: "terms",
  version: "1.0.0",
  description: "View the Terms of Service for NOVA LLAMA ASSISTANT",
  category: "info",
  prefix: "both",
  guide: "Use !terms or /terms to view the bot's rules and policies."
};

exports.onStart = async function ({ wataru, msg }) {
  const tos = `
📜 *NOVA LLAMA ASSISTANT — Terms of Service*

Last Updated: September 25, 2025

1️⃣ *Acceptance of Terms*
By using NOVA LLAMA ASSISTANT, you agree to these terms.

2️⃣ *Features*
This bot provides economy, games, AI tools, and other utilities.

3️⃣ *User Rules*
- No spam or abuse
- No multiple accounts to farm rewards
- Respect the bot and other users

4️⃣ *Economy System*
- All coins are virtual and have no real value
- Abuse may result in balance reset or ban

5️⃣ *Privacy*
- We only store basic user info (ID, balance, etc.)
- Data is used for bot features only

6️⃣ *Liability*
We are not responsible for data loss, downtime, or user actions.

7️⃣ *Changes*
We may update these terms anytime without notice.

📩 For questions or issues, contact the bot admin.

Thank you for using NOVA LLAMA ASSISTANT! 🦙
`;

  await wataru.reply(tos.trim());
};
