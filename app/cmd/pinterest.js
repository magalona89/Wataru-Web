const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

exports.meta = {
  name: "pinterest",
  aliases: ["pin", "pins"],
  prefix: "both",
  version: "1.0.0",
  author: "Nova",
  description: "Search and send Pinterest images",
  guide: ["<keyword>"],
  category: "image"
};

exports.onStart = async function({ wataru, msg, chatId, args }) {
  const query = args.join(" ").trim();

  if (!query) {
    return await wataru.reply("❌ Please provide a search keyword.");
  }

  try {
    const loading = await wataru.reply("🔎 Searching Pinterest...");

    const res = await axios.get(`https://daikyu-api.up.railway.app/api/pinterest-img?search=${encodeURIComponent(query)}`);
    const results = res.data.results;

    if (!Array.isArray(results) || results.length === 0) {
      await wataru.unsend(loading.messageID);
      return await wataru.reply("❌ No images found.");
    }

    const cacheDir = path.join(__dirname, 'cache');
    await fs.ensureDir(cacheDir);

    const attachments = [];

    for (let i = 0; i < results.length; i++) {
      const url = results[i];
      const filename = `pin_${Date.now()}_${i}.jpg`;
      const filepath = path.join(cacheDir, filename);

      const imgRes = await axios.get(url, { responseType: 'arraybuffer' });
      fs.writeFileSync(filepath, Buffer.from(imgRes.data, 'binary'));
      attachments.push(fs.createReadStream(filepath));
    }

    await wataru.reply({ attachment: attachments });
    await wataru.unsend(loading.messageID);

    // Clean up files
    for (const file of attachments) {
      fs.unlinkSync(file.path);
    }

  } catch (err) {
    console.error("Pinterest error:", err);
    await wataru.reply("❌ Error fetching Pinterest images.");
  }
};
