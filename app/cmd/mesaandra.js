const axios = require('axios');

function convertToBold(text) {
  const boldMap = {
    'a': '𝗮','b': '𝗯','c': '𝗰','d': '𝗱','e': '𝗲','f': '𝗳','g': '𝗴','h': '𝗵','i': '𝗶','j': '𝗷',
    'k': '𝗸','l': '𝗹','m': '𝗺','n': '𝗻','o': '𝗼','p': '𝗽','q': '𝗾','r': '𝗿','s': '𝘀','t': '𝘁',
    'u': '𝘂','v': '𝘃','w': '𝘄','x': '𝘅','y': '𝘆','z': '𝘇',
    'A': '𝗔','B': '𝗕','C': '𝗖','D': '𝗗','E': '𝗘','F': '𝗙','G': '𝗚','H': '𝗛','I': '𝗜','J': '𝗝',
    'K': '𝗞','L': '𝗟','M': '𝗠','N': '𝗡','O': '𝗢','P': '𝗣','Q': '𝗤','R': '𝗥','S': '𝗦','T': '𝗧',
    'U': '𝗨','V': '𝗩','W': '𝗪','X': '𝗫','Y': '𝗬','Z': '𝗭',
  };
  return text.split('').map(char => boldMap[char] || char).join('');
}

const responseOpeners = [
  "🤖 𝙂𝙋𝙏 𝘼𝙎𝙎𝙄𝙎𝙏𝘼𝙉𝙏"
];

exports.meta = {
  name: 'messandra',
  aliases: ['lorex'],
  prefix: "both",
  version: '1.2.1',
  author: 'NovaAi',
  description: "An AI command powered by GPT-5 + Gemini Vision",
  guide: ["<prompt>", "[image reply + prompt]"],
  category: "ai"
};

exports.onStart = async function({ wataru, msg, chatId, args }) {
  const input = args.join(" ").trim();
  const isPhotoReply = msg?.type === "message_reply"
    && Array.isArray(msg.messageReply?.attachments)
    && msg.messageReply.attachments.some(att => att.type === "photo");

  // === IMAGE HANDLING ===
  if (isPhotoReply) {
    const photoUrl = msg.messageReply.attachments?.[0]?.url;

    if (!photoUrl) {
      return await wataru.reply("❌ Could not get image URL.");
    }

    if (!input) {
      return await wataru.reply("📸 Please provide a prompt along with the image.");
    }

    const loading = await wataru.reply("🔍 Analyzing image...");

    try {
      const { data } = await axios.get('https://arychauhann.onrender.com/api/gemini-proxy', {
        params: {
          prompt: input,
          imgUrl: photoUrl
        }
      });

      const result = data?.result?.trim();

      if (!result) {
        return await wataru.edit("⚠️ Unexpected response from Gemini Vision API.", loading.messageID);
      }

      const opener = responseOpeners[Math.floor(Math.random() * responseOpeners.length)];
      await wataru.edit(`${opener}\n\n${result}`, loading.messageID);

    } catch (err) {
      console.error(err);
      await wataru.edit("❌ Error analyzing image.", loading.messageID);
    }

    return;
  }

  // === TEXT HANDLING (GPT-5) ===
  if (!input) {
    return await wataru.reply("❌ Paki‑type ang prompt mo.\n\nExample: messandra what is love?");
  }

  const loading = await wataru.reply("⏳ GPT-5 GENERATING...");

  try {
    const { data } = await axios.get('https://daikyu-api.up.railway.app/api/gpt-5', {
      params: {
        ask: input,
        uid: chatId
      }
    });

    if (!data?.response) {
      return await wataru.edit("❌ No response received. Try again.", loading.messageID);
    }

    const formatted = data.response
      .replace(/\*\*(.*?)\*\*/g, (_, t) => convertToBold(t))
      .replace(/##(.*?)##/g, (_, t) => convertToBold(t))
      .replace(/###\s*/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    const opener = responseOpeners[Math.floor(Math.random() * responseOpeners.length)];
    await wataru.edit(`${opener}\n\n${formatted}`, loading.messageID);

  } catch (err) {
    console.error(err);
    await wataru.edit("⚠️ Something went wrong. Try again later.", loading.messageID);
  }
};
