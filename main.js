const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// Load config.json
const config = require("./config.json");

global.config = config;
const { name, prefix } = global.config;

global.client = {
commands: new Map(),
events: new Map()
};

const { commands, events } = global.client;

// Middleware to parse JSON
app.use(express.json());

// Serve static files from "public"
app.use(express.static(path.join(__dirname, "public")));

// Load commands from `app/cmd`
fs.readdirSync(path.join(__dirname, "app", "cmd"))
    .filter(file => file.endsWith(".js"))
    .forEach(file => {
        const command = require(path.join(__dirname, "app", "cmd", file));
        if (command.setup?.name) {
            commands.set(command.setup.name, command);
            console.log(`Loaded command: ${command.setup.name} (Prefix: ${command.setup.prefix})`);
        }
    });

// Load events from `app/event`
fs.readdirSync(path.join(__dirname, "app", "event"))
    .filter(file => file.endsWith(".js"))
    .forEach(file => {
        const event = require(path.join(__dirname, "app", "event", file));
        if (event.setup?.name) {
            events.set(event.setup.name, event);
            console.log(`Loaded event: ${event.setup.name}`);
        }
    });

// API route to handle commands
app.get("/api/event", async (req, res) => {
    const { body } = req.query;
    if (!body) return res.json({ fail: true, message: "No command provided." });

    let commandName, args;
    const isPrefixed = body.startsWith(prefix);

    if (isPrefixed) {
        args = body.slice(prefix.length).trim().split(" ");
        commandName = args.shift()?.toLowerCase();
    } else {
        // If the user says "prefix", respond with the bot prefix
        if (body.trim().toLowerCase() === "prefix") {
            return res.json({ fail: false, message: `My prefix is: ${prefix}` });
        }
        return; // Ignore non-command messages (No response)
    }

    const command = commands.get(commandName);
    if (!command) return res.json({ fail: true, message: "Command not found." });

    // Check prefix requirements
    if (command.setup.prefix === true && !isPrefixed) {
        return res.json({ fail: true, message: `Use '${prefix}${commandName}' instead.` });
    }
    if (command.setup.prefix === false && isPrefixed) {
        return res.json({ fail: true, message: `Use '${commandName}' instead of '${prefix}${commandName}'.` });
    }

    try {
        const message = {
            send: (msg) => res.json({ fail: false, message: msg }),
            photo: (url) => res.json({ fail: false, message: url }),
            video: (url) => res.json({ fail: false, message: url }),
            audio: (url) => res.json({ fail: false, message: url })
        };

        // Execute the command
        await command.onStart({ message, event: {}, args });
    } catch (error) {
        console.error(error);
        res.json({ fail: true, message: "An error occurred while executing the command." });
    }
});

// Serve `index.html` for the root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
