// system/handle/event.js
exports.event = async function({ req, wataru, msg, data }) {

  const chatId = msg.chat.id;
  
  const { eventName } = req.query;
  if (!eventName) return wataru.reply("No event specified.");

  const eventHandler = global.client.events.get(eventName);
  if (!eventHandler) return wataru.reply("Event not found.");

  try {
    await eventHandler.onStart({ wataru, msg, args: [], data, chatId });
  } catch (error) {
    console.error(error);
    wataru.reply("An error occurred while processing the event.");
  }
};
