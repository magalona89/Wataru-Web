exports.meta = {
    name: "help",
    version: "1.0.0",
    description: "Displays a list of available commands with pagination.",
    category: "general",
    prefix: "both",
    guide: ""
};

const COMMANDS_PER_PAGE = 10;

exports.onStart = async function({ wataru, msg, args }) {
    const { prefix: globalPrefix } = global.config;
    const page = parseInt(args[0], 10) || 1;

    const commandsList = Array.from(global.client.commands.values());

    if (commandsList.length === 0) {
        return await wataru.reply("No commands are currently available.");
    }

    const totalPages = Math.ceil(commandsList.length / COMMANDS_PER_PAGE);

    if (page < 1 || page > totalPages) {
        return await wataru.reply(`Invalid page number. Please choose a page between 1 and ${totalPages}.`);
    }

    // Get current date/time in Philippines timezone (UTC+8)
    const now = new Date();
    const options = {
        timeZone: 'Asia/Manila',
        hour12: false,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };
    const formatter = new Intl.DateTimeFormat('en-PH', options);
    const currentTimePH = formatter.format(now);

    const startIndex = (page - 1) * COMMANDS_PER_PAGE;
    const endIndex = startIndex + COMMANDS_PER_PAGE;
    const commandsToShow = commandsList.slice(startIndex, endIndex);

    // Build the help message
    let helpMessage = "";
    helpMessage += "🚀 NOVA AVAILABLE COMMANDS 🚀\n";
    helpMessage += `🕒 Current Time (Philippines): \`${currentTimePH}\`\n`;
    helpMessage += `📄 Showing commands (Page ${page} of ${totalPages})\n`;
    helpMessage += "───────────────────────────────\n\n";

    commandsToShow.forEach(command => {
        const { name, version, description, category, prefix } = command.meta;
        helpMessage += `🔹 Command: ${globalPrefix}${name} (v${version})\n`;
        helpMessage += `   📋 Description: ${description}\n`;
        helpMessage += `   🗂 Category: ${category}\n`;
        helpMessage += `   🔣 Prefix: ${prefix}\n`;
        helpMessage += "\n";
    });

    helpMessage += "───────────────────────────────\n";

    if (page > 1) {
        helpMessage += `⬅️ Use \`${globalPrefix}help ${page - 1}\` for previous page\n`;
    }
    if (page < totalPages) {
        helpMessage += `➡️ Use \`${globalPrefix}help ${page + 1}\` for next page\n`;
    }

    // Styled footer
    helpMessage += "\n🌟──────────────────────────🌟\n";
    helpMessage += "       👨‍💻 DEVELOPED BY MANUELSON 👨‍💻       \n";
    helpMessage += "🌟──────────────────────────🌟";

    await wataru.reply(helpMessage);
};
