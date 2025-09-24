const axios = require('axios');

exports.meta = {
  name: "nova",
  aliases: ["chatgpt", "openai"],
  prefix: "both",
  version: "1.0.0",
  author: "POWERED BY LLAMA 70B",
  description: "Ask Nova Llama70b AI",
  guide: ["<query>"],
  category: "nova"
};

exports.onStart = async function({ wataru, msg, chatId, args }) {
  try {
    const question = args.join(" ").trim();
    if (!question) {
      return await wataru.reply('❓ Enter a prompt to ask Nova AI..');
    }

    // Build the new API URL with the user's question
    const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/Llama70b?ask=${encodeURIComponent(question)}`;

    const response = await axios.get(apiUrl, { timeout: 15000 });

    // Assuming the response contains the answer directly in response.data
    // Adjust if the API response structure differs
    const aiResponse = response.data?.response || response.data || "No response was returned from the API.";

    await wataru.reply(aiResponse);
  } catch (error) {
    console.error("Error fetching AI response:", error.response ? error.response.data : error.message || error);
    await wataru.reply("An error occurred while fetching the AI response.");
  }
};
