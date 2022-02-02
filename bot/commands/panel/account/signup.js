const request = require('request');

exports.run = async (client, message, args, guildConf, userConf) => {
    
    let panel = guildConf.panelURL;

    let key = guildConf.panelAPIKey;
    if (!key) return client.sendErrorEmbed(message.channel, "The panel's application api key has not been set!");

    if (userConf.panelData && userConf.panelData.length !== 0) return client.sendErrorEmbed(message.channel, "You already have an account");

    const filter = m => m.author.id === message.author.id;

    let username;
    let email;

    await client.sendEmbed(message.channel, "Check your dms");

    let msg;
    try {
        msg = await client.sendEmbed(message.author, "Account Creation", "Please respond to the questions below in order to create an account.")
    } catch(e) {
        return client.sendErrorEmbed(message.channel, "Please turn your dms on and try again.")
    }

    // Ask for panel username
    await client.sendEmbed(message.author, "1. Username", "What would you like your username to be?");
    msg.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
        .then(collected => {
            let msg = collected.first();
            let content = msg.content;
            if (content.length > 520) return client.sendErrorEmbed(message.author, "Username is over 20 characters");
            username = content;

            // Ask for panel email
            client.sendEmbed(message.author, "2. Email", "What would you like your email to be?");
                msg.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                    .then(collected => {
                        let msg = collected.first();
                        let content = msg.content;
                        email = content;

                        let EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        if (!EMAIL_REGEX.test(email)) return client.sendErrorEmbed(message.author, "Please provide a valid email. Please start over.")

                        let password = client.generatePassword(10);
                        const data = {
                            username: username,
                            email: email,
                            first_name: username,
                            last_name: username,
                            password: password,
                            root_admin: false,
                            language: "en"
                        }

                        request.post(`${panel}/api/application/users`, {
                            auth: {
                                bearer: key
                            },
                            json: data
                        }, async function(err, response, body) {

                            let errors = response.body.errors;
                            if (errors && errors.length > 0) return client.sendErrorEmbed(message.author, errors[0].detail);

                            if (err) return client.sendErrorEmbed(message.author, "An error has occured");
                            if (response.statusCode === 403) return client.sendErrorEmbed(message.author, "Invalid api key!");

                            client.userDB.set(`${message.author.id}-${message.guild.id}.panelData`, response.body.attributes);

                            await client.sendEmbed(message.author, `Account Details`, `**Username**: ${username}\n**Email**: ${email}\n**Password**: ${password}\n\nPanel: [Click-Here](${guildConf.panelURL})`);

                            client.log("PTERODACTYL", `${guildConf.panelURL} -> created user: ${email}`);

                        });

                    }).catch((e) => client.sendErrorEmbed(message.author, "You have not responded in time. Please start over."));

            }).catch((e) => client.sendErrorEmbed(message.author, "You have not responded in time. Please start over."));

}