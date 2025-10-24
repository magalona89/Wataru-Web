const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

exports.meta = {
  name: "image",
  aliases: ["editimage", "img", "generateimage"],
  prefix: "both",
  version: "2.0.0",
  author: "Romeo | Modified by BIOSCOPE PRO",
  description: "Generate or edit an image using Gemini-Edit AI.",
  guide: ["<prompt> (reply to image optional)"],
  category: "AI"
};

exports.onStart = async function({ wataru, msg, chatId, args }) {
  const prompt = args.join(" ").trim();
  const apiUrl = "https://gemini-edit-omega.vercel.app/edit";

  if (!prompt) {
    return wataru.reply("❌ Please provide a prompt to generate or edit an image.");
  }

  try {
    if (wataru.sendTyping) wataru.sendTyping(chatId, true);

    const params = { prompt };

    // 🖼️ If the message is replying to an image, add its URL
    if (
      msg.reply_message &&
      Array.isArray(msg.reply_message.attachments) &&
      msg.reply_message.attachments[0]?.type === "photo"
    ) {
      params.imgurl = msg.reply_message.attachments[0].url;
    }

    // 🕐 Simulate slight typing delay
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    await delay(800);

    const { data } = await axios.get(apiUrl, { params });

    if (!data || !data.images || !data.images[0]) {
      return wataru.reply("❌ Failed to generate or edit image. Please try again.");
    }

    const base64Image = data.images[0].replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Image, "base64");

    const cacheDir = path.join(__dirname, "cache");
    fs.ensureDirSync(cacheDir);

    const imagePath = path.join(cacheDir, `${Date.now()}_gemini.png`);
    fs.writeFileSync(imagePath, imageBuffer);

    await wataru.reply({
      attachment: fs.createReadStream(imagePath),
      caption: `✨ Gemini-Edit AI | Prompt: ${prompt}`
    });

    fs.unlinkSync(imagePath);
  } catch (error) {
    console.error("❌ Gemini-Edit Error:", error.response?.data || error.message);
    await wataru.reply("⚠️ Error generating/editing image. Please try again later.");
  }
};
