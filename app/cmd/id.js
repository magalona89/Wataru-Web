exports.meta = {
  name: "id",
  version: "0.0.1",
  description: "Test command that returns the current chat ID",
  category: "test",
  prefix: "both",
  guide: ""
};

exports.onStart = async function ({ wataru, msg, chatId }) {
  // Extract the chatId using msg.chat.id
  await wataru.reply(`Current Chat ID:\n\n${chatId}`);
};
