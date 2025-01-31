const axios = require("axios");

exports.setup = {
  name: "waifu",
  version: "1.2.1",
  description: "Sends a random waifu image",
  category: "fun",
  prefix: "both",
  guide: "",
};

exports.onStart = async function ({ message }) {
  try {
    // Fetch waifu image URL
    const response = await axios.get("https://api.waifu.pics/sfw/waifu");
    const imageUrl = response.data.url;

    // Send the image using message.photo()
    message.photo(imageUrl);
  } catch (error) {
    console.error("Error fetching waifu image:", error);
    message.send(
      "Sorry, I couldn't fetch a waifu image at the moment. Please try again later."
    );
  }
};
