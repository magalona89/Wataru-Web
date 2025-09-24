const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

exports.meta = {
  name: "flux",
  aliases: [],
  prefix: "both",
  version: "1.0.4",
  author: "Nova",
  description: "Generate an image using Flux AI",
  guide: ["<prompt>"],
  category: "image"
};

exports.onStart = async function({ wataru, msg, chatId, args }) {
  const prompt = args.join(" ").trim();

  if (!prompt) {
    return await wataru.reply("❌ Please provide a prompt.\nExample: flux galaxy butterfly");
  }

  try {
    const time = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `${time}_flux.png`;
    const filePath = path.join(__dirname, 'cache', fileName);

    const loading = await wataru.reply("🔄 Generating image...");

    try {
      const response = await axios.get(`https://daikyu-api.up.railway.app/api/flux-img?prompt=${encodeURIComponent(prompt)}`, {
        responseType: "arraybuffer"
      });

      await fs.ensureDir(path.join(__dirname, 'cache'));
      fs.writeFileSync(filePath, Buffer.from(response.data, 'binary'));

      await wataru.reply({
        attachment: fs.createReadStream(filePath)
      });

      fs.unlinkSync(filePath);
      await wataru.unsend(loading.messageID);

    } catch (error) {
      console.error("Flux API Error:", error);
      await wataru.reply("❌ Failed to generate image. Try again later.");
      await wataru.unsend(loading.messageID);
    }

  } catch (err) {
    console.error("Unexpected error:", err);
    await wataru.reply("❌ Unexpected error occurred.");
  }
};
