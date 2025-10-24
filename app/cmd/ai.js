const axios = require("axios");

exports.meta = {
  name: "ai",
  aliases: ["ai", "bscope", "ai"],
  prefix: "both",
  version: "2.0.0",
  author: "BIOSCOPE PRO | Created Manuelson",
  description: "Talk with BIOSCOPE PRO — your advanced GPT-5 AI assistant",
  guide: ["<question>"],
  category: "AI"
};

exports.onStart = async function({ wataru, msg, chatId, args }) {
  const question = args.join(" ").trim();

  if (!question) {
    return wataru.reply("Please enter a prompt to ask BIOSCOPE PRO (GPT-5).");
  }

  try {
    const uid = "61580959514473"; // your UID
    const apiUrl = `https://daikyu-apizer-108.up.railway.app/api/gpt-5?ask=${encodeURIComponent(question)}&uid=${uid}`;

    // 🕒 Show typing indicator
    if (wataru.sendTyping) wataru.sendTyping(chatId, true);

    // Small delay to simulate human typing before response (optional)
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(800);

    const { data } = await axios.get(apiUrl, { timeout: 20000 });
    const answer = data?.response || data?.result || data?.answer || "No response from BIOSCOPE PRO.";

    // 🧠 Stylish formatted output
    const reply = [
      `BIOSCOPE PRO | Powered by GPT-5`,
      `━━━━━━━━━━━━━━━━━━━`,
      `${answer}`,
      `━━━━━━━━━━━━━━━━━━━`,
      `Response Time: ${new Date().toLocaleTimeString()}`
    ].join("\n");

    await wataru.reply(reply);
  } catch (error) {
    console.error("BIOSCOPE PRO Error:", error.response?.data || error.message);
    await wataru.reply("⚠️ BIOSCOPE PRO encountered an error. Please try again later.");
  }
};
