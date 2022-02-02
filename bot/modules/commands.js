const fs = require("fs");

module.exports = (client, guildConf, message) => {

    client.loadCommands = () => {
        try {
            client.modules.forEach(cmd => {
                fs.readdir(`${process.cwd()}/bot/commands/${cmd}/`, (err, files) => {
                    if (err) throw err
                    files.forEach(f => {
                        let commandName = f.split(".")[0];
                        const props = require(`${process.cwd()}/bot/commands/${cmd}/${f}`);
                        props.help.category = cmd;
                        if (!global.config.get("disabledCommands").includes(commandName)) {
                            client.commands.set(commandName, props);
                            props.help.aliases.forEach(a => {
                                client.aliases.set(a, props.help.name)
                            });
                        }
                    });
                });
            });
        } catch(e) {
            return client.error(5, `Could not load commands\n${e}`);
        } finally {
            client.log("BOT", `Loaded commands`);
        }
    }

    client.loadCommand = (command) => {
        command.toLowerCase();
        if (client.commands.get(command)) return false
        try {
            client.modules.forEach(c => {
                fs.readdir(`${process.cwd()}/bot/commands/${c}/`, (err, files) => {
                    if (err) throw err;
                    files.forEach(f => {
                        let commandName = f.split(".")[0];
                        if (commandName === command) {
                            const props = require(`${process.cwd()}/bot/commands/${c}/${commandName}.js`);
                            props.help.category = c;
                            client.commands.set(commandName, props);
                            props.help.aliases.forEach(a => {
                                client.aliases.set(a, props.help.name)
                            });
                        }
                    });
                });
            });
        } catch(e) {
            return false;
        }
        client.log("BOT", `Loaded command: ${command}`);
        client.generateHelp();
        return true;
    }

    client.unloadCommand = (command) => {
        command.toLowerCase();
        if (!client.commands.get(command)) return false
        try {
            client.modules.forEach(c => {
                fs.readdir(`${process.cwd()}/bot/commands/${c}/`, (err, files) => {
                    if (err) throw err;
                    files.forEach(f => {
                        let commandName = f.split(".")[0];
                        if (commandName === command) {
                            delete require.cache[require.resolve(`${process.cwd()}/bot/commands/${c}/${commandName}.js`)];
                            client.commands.delete(commandName);
                        }
                    });
                });
            });
        } catch(e) {
            return false;
        }
        client.log("BOT", `Unloaded command: ${command}`);
        client.generateHelp();
        return true;
    }

    client.reloadCommand = (command) => {
        command.toLowerCase();
        if (!client.commands.get(command) && !client.commands.get(client.aliases.get(command))) return false
        try {
            client.modules.forEach(c => {
                fs.readdir(`${process.cwd()}/bot/commands/${c}/`, (err, files) => {
                    if (err) throw err;
                    files.forEach(f => {
                        let commandName = f.split(".")[0];
                        if (commandName === command) {
                            // delete old
                            delete require.cache[require.resolve(`${process.cwd()}/bot/commands/${c}/${commandName}.js`)];
                            client.commands.delete(commandName);
                            // load new
                            const props = require(`${process.cwd()}/bot/commands/${c}/${commandName}.js`);
                            props.help.category = c;
                            client.commands.set(commandName, props);
                            props.help.aliases.forEach(a => {
                                client.aliases.set(a, props.help.name)
                            });
                        }
                    });
                });
            });
        } catch(e) {
            return false;
        }
        client.log("BOT", `Reloaded command: ${command}`);
        client.generateHelp();
        return true;
    }

}
