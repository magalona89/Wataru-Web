exports.meta = {
  name: "clear",
  version: "0.0.1",
  description: "Clears the chat history",
  category: "utility",
  prefix: "both",
  guide: "Usage: /clear"
};

exports.onStart = async function({ wataru }) {
  // Send a special reply payload instructing the client to clear the chat.
  wataru.reply({
    type: "clear",
    message: "Chat history cleared. Start a new conversation."
  });
};
