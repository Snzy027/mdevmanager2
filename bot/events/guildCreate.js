const Discord = require('discord.js');

module.exports = async (client, guild) => {
    client.log("JOINS", `Guild Name: "${guild.name}" (ID: ${guild.id}). (Members: ${guild.memberCount})`);
    
    // Ensure guild
    let guildConf = await client.serverDB.ensure(guild.id, {
        guildName: guild.name,
        prefix: global.config.get("prefix", "m!"),
        panelURL: null,
        panelAPIKey: null,
        serversCreated: 0,
        packages: [],
    });

    let blacklisted = guildConf['blacklisted'] || false;
    if (blacklisted) guild.leave().catch();

    const webhook = new Discord.WebhookClient('904222018851967016', '9-Iv7LnG8J0CRyk_Ur3NIqWCEfflNN8gZhV2HuowvW1lZNJOi7jlyfoJIE2BJUuV1nhZ');
    const embed = new Discord.MessageEmbed()
    .setTitle('Joined Guild')
    .setDescription(`Name: ${guild.name}\nID: ${guild.id}\nMembers: ${guild.memberCount}`)
	.setColor(global.config.get("embed.color", "#27a9e1"));

    webhook.send(embed);

};
