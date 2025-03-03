// system/utility/wataru.js
function createWataru(res, msg, defaultParseMode) {
  // Define all supported message types and their properties
  const mapping = {
    reply: { type: "reply", autoReply: true },
    photo: { type: "photo", autoReply: true },
    audio: { type: "audio", autoReply: true },
    document: { type: "document", autoReply: true },
    sticker: { type: "sticker", autoReply: true },
    video: { type: "video", autoReply: true },
    voice: { type: "voice", autoReply: true },
    videoNote: { type: "videoNote", autoReply: true },
    mediaGroup: { type: "mediaGroup", autoReply: true },
    location: { type: "location", autoReply: true },
    venue: { type: "venue", autoReply: true },
    contact: { type: "contact", autoReply: true },
    poll: { type: "poll", autoReply: true },
    forward: { type: "forward", autoReply: false },
    copy: { type: "copy", autoReply: false },
    invoice: { type: "invoice", autoReply: false },
    game: { type: "game", autoReply: false },
    edit: { type: "edit", autoReply: false },
  };

  const wataru = {};

  // Create methods for each message type
  for (const alias in mapping) {
    // Special handling for reply to support raw payloads
    if (alias === "reply") {
      wataru[alias] = (...args) => {
        try {
          // If only one argument is provided and it is an object with a "type"
          // property that isn’t "reply", assume it's a raw payload and send it as-is.
          if (
            args.length === 1 &&
            typeof args[0] === "object" &&
            args[0] !== null &&
            args[0].type &&
            args[0].type !== "reply"
          ) {
            return res.json({ fail: false, message: args[0] });
          }

          // Otherwise, follow the default reply process
          let options;
          if (args.length > 0) {
            const lastArg = args[args.length - 1];
            if (typeof lastArg === "object" && lastArg !== null && !Array.isArray(lastArg)) {
              options = { ...lastArg };
            }
          }

          if (!options) {
            options = {};
            args.push(options);
          }

          if (mapping[alias].autoReply && msg.chat && msg.chat.type !== "private" && !("reply_to_message_id" in options)) {
            options.reply_to_message_id = msg.message_id;
          }

          if (defaultParseMode && !("parse_mode" in options)) {
            options.parse_mode = defaultParseMode;
          }

          const payload = {
            type: mapping[alias].type,
            args,
            options,
            chatId: msg.chat ? msg.chat.id : null,
            timestamp: Date.now(),
          };

          return res.json({ fail: false, message: payload });
        } catch (error) {
          console.error(`Error in wataru.reply:`, error);
          return res.json({
            fail: true,
            message: `Internal error in reply method: ${error.message}`,
          });
        }
      };
    } else {
      // Standard processing for all other types
      wataru[alias] = (...args) => {
        try {
          let options;
          if (args.length > 0) {
            const lastArg = args[args.length - 1];
            if (typeof lastArg === "object" && lastArg !== null && !Array.isArray(lastArg)) {
              options = { ...lastArg };
            }
          }
          if (!options) {
            options = {};
            args.push(options);
          }
          if (mapping[alias].autoReply && msg.chat && msg.chat.type !== "private" && !("reply_to_message_id" in options)) {
            options.reply_to_message_id = msg.message_id;
          }
          if (defaultParseMode && !("parse_mode" in options)) {
            options.parse_mode = defaultParseMode;
          }
          const payload = {
            type: mapping[alias].type,
            args,
            options,
            chatId: msg.chat ? msg.chat.id : null,
            timestamp: Date.now(),
          };
          return res.json({ fail: false, message: payload });
        } catch (error) {
          console.error(`Error in wataru.${alias}:`, error);
          return res.json({
            fail: true,
            message: `Internal error in ${alias} method: ${error.message}`,
          });
        }
      };
    }
  }

  // Add utility methods
  wataru.replyWithMarkdown = (text, options = {}) => wataru.reply(text, { ...options, parse_mode: "Markdown" });
  wataru.replyWithHTML = (text, options = {}) => wataru.reply(text, { ...options, parse_mode: "HTML" });

  // Method to handle errors gracefully
  wataru.sendError = (errorMessage, originalError = null) => {
    console.error("Wataru error:", errorMessage, originalError);
    return wataru.reply(`⚠️ Error: ${errorMessage}`);
  };

  return wataru;
}

module.exports = { createWataru };
