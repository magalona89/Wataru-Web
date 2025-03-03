const axios = require('axios');

exports.meta = {
  name: "meme",
  aliases: ["memes", "randommeme"],
  prefix: "both",
  version: "1.0.0",
  description: "Sends a random meme.",
  guide: [],
  category: "fun"
};

exports.onStart = async function({ wataru, args }) {
  try {
    // Define the API endpoint to fetch a random meme from r/memes
    const apiUrl = "https://meme-api.com/gimme/memes";

    // Make the GET request to the Meme API
    const response = await axios.get(apiUrl);
    const meme = response.data;

    // Send the meme image to the chat with its title as the caption
    await wataru.photo(meme.url, { caption: meme.title });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching meme:", error);

    // Notify the user if something goes wrong
    await wataru.reply("An error occurred while fetching the meme.");
  }
};