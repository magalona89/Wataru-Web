const axios = require("axios");

exports.meta = {
  name: "waifu",
  version: "1.2.1",
  description: "Sends a random anime character image",
  category: "fun",
  prefix: "both",
  guide: "Type /waifu to get a random anime character image",
};

exports.onStart = async ({ wataru }) => {
  try {

    // Fetch a random waifu image URL with error handling and timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await axios.get("https://api.waifu.pics/sfw/waifu", {
      signal: controller.signal,
      timeout: 10000,
    });

    clearTimeout(timeoutId);
    const imageUrl = response.data.url;

    if (!imageUrl) {
      throw new Error("No image URL received from API");
    }

    // Send the image using wataru; note we call photo so the payload type will be "photo"
    wataru.photo(imageUrl, {
      caption: "Here's your anime character! 🌸",
      parse_mode: "HTML",
    });
  } catch (error) {
    console.error("Error fetching waifu image:", error);

    if (error.code === "ECONNABORTED" || error.name === "AbortError") {
      wataru.reply("Sorry, the request timed out. The waifu server might be busy. Please try again later.");
    } else if (error.response) {
      wataru.reply(`Sorry, the waifu server returned an error: ${error.response.status}. Please try again later.`);
    } else if (error.request) {
      wataru.reply("Sorry, I couldn't reach the waifu server. Please check your internet connection and try again.");
    } else {
      wataru.reply("Sorry, I couldn't fetch a waifu image at the moment. Please try again later.");
    }
  }
};
