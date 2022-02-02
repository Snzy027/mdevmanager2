const request = require('request');

exports.run = (client, message, args, guildConf, userConf) => {

    client.sendEmbed(message.channel, `Pinging...`).then(m => {

        request.get("https://srhpyqt94yxb.statuspage.io/api/v2/status.json", function(err, response, body) {

            body = JSON.parse(body);

            client.editEmbed(m.channel, m.id, "Discord Status", "", [
                {
                    name: "Page",
                    value: `URL: ${body.page.url}`
                },
                {
                    name: `Status`,
                    value: `Indicator: ${body.status.indicator}\nDescription: ${body.status.description}`
                }
            ]);

        });

    });

}

module.exports.help = {
    name: "discordstatus",
    description: "Checks discord's status",
    dm: true,
    cooldown: 15,
    aliases: ["discord"]
}
