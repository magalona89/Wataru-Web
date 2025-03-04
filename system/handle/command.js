// system/handle/command.js
const { prefix } = global.config;

exports.command = async function({ req, wataru, msg }) {
  
  const chatId = msg.chat.id;
  
  const { body } = req.query;
  if (!body) {
    return; // Ignore empty messages
  }

  const trimmedBody = body.trim().toLowerCase();

  if (trimmedBody.startsWith(prefix)) {
    const commandPart = body.slice(prefix.length).trim();
    const args = commandPart.split(" ");
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) {
      return wataru.reply("No command provided.");
    }
    const command = global.client.commands.get(commandName);
    if (!command) {
      return wataru.reply("Command not found.");
    }
    if (command.meta.prefix === false) {
      return wataru.reply(`Use '${commandName}' instead of '${prefix}${commandName}'.`);
    }
    // Execute if meta.prefix is true or "both"
    try {
      await command.onStart({ wataru, msg, chatId, args });
    } catch (error) {
      console.error(error);
      wataru.reply("An error occurred while executing the command.");
    }
  } else {
    if (trimmedBody === "prefix") {
      return wataru.reply(`My prefix is: ${prefix}`);
    }
    // Check for potential commands without prefix
    const args = body.trim().split(" ");
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) {
      return; // Ignore if no command name
    }
    const command = global.client.commands.get(commandName);
    if (command && (command.meta.prefix === false || command.meta.prefix === "both")) {
      try {
        await command.onStart({ wataru, msg, args, chatId });
      } catch (error) {
        console.error(error);
        wataru.reply("An error occurred while executing the command.");
      }
    }
    // Otherwise, do nothing for normal messages
  }
};