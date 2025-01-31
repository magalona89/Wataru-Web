exports.setup = {
    name: "help",
    version: "1.0.0",
    description: "Displays a list of available commands with pagination.",
    category: "general",
    prefix: "both",
    guide: ""
};

const COMMANDS_PER_PAGE = 10; // Number of commands to show per page

exports.onStart = async function ({ message, event, args }) {
    // Retrieve the query for the page number (if any)
    const { prefix } = global.config;
    const page = parseInt(args[0], 10) || 1; // Default to page 1 if no number is provided

    // Retrieve all commands from the global client
    const commandsList = Array.from(global.client.commands.values());

    // Calculate total number of pages
    const totalPages = Math.ceil(commandsList.length / COMMANDS_PER_PAGE);

    // Ensure the page number is valid
    if (page < 1 || page > totalPages) {
        return message.send(`Invalid page number. Please choose a page between 1 and ${totalPages}.`);
    }

    // Calculate the range of commands to display for the current page
    const startIndex = (page - 1) * COMMANDS_PER_PAGE;
    const endIndex = startIndex + COMMANDS_PER_PAGE;
    const commandsToShow = commandsList.slice(startIndex, endIndex);

    // Build the help message for the current page
    let helpMessage = `Here are the available commands (Page ${page}/${totalPages}):\n\n`;

    commandsToShow.forEach(command => {
        const { name, version, description, category, prefix } = command.setup;
        helpMessage += `**${global.config.prefix}${name}** (v${version}) - ${description}\n`;
        helpMessage += `Category: ${category}\n`;
        helpMessage += `Prefix: ${prefix}\n`;
        helpMessage += "-----------------------\n";
    });

    // Include the navigation info for the next and previous pages
    if (page > 1) {
        helpMessage += `\nUse ${prefix}help ${page - 1} to go to the previous page.`;
    }
    if (page < totalPages) {
        helpMessage += `\nUse ${prefix}help ${page + 1} to go to the next page.`;
    }

    // Send the help message
    message.send(helpMessage);
};
