const axios = require('axios');

exports.meta = {
  name: "ai",
  aliases: ["chatgpt", "openai"],
  prefix: "both",
  version: "1.0.0",
  author: "Kaiz API",
  description: "Ask chatGPT-4", // fixed typo from "4o" to "4"
  guide: ["<query>"],
  category: "ai"
};

exports.onStart = async function({ wataru, msg, chatId, args }) {
  try {
    const question = args.join(" ");
    if (!question) {
      return await wataru.reply('Please provide a question.');
    }

    // Build the API URL with the user's question.
    const apiUrl = `${global.api.kaiz}/api/gpt-4o?ask=${encodeURIComponent(question)}&uid=${chatId}&webSearch=off`;
    const response = await axios.get(apiUrl);

    // Use optional chaining to safely access the API response.
    const aiResponse = response.data?.response || "No response was returned from the API.";

    await wataru.reply(aiResponse);
  } catch (error) {
    console.error("Error fetching AI response:", error.response ? error.response.data : error);
    await wataru.reply("An error occurred while fetching the AI response.");
  }
};
