const Discord = require('discord.js');

module.exports = (client, guild) => {
    client.log("LEAVES", `Guild Name: "${guild.name}" (ID: ${guild.id}). (Members: ${guild.memberCount})`);

    // Logging
    
    const webhook = new Discord.WebhookClient('904222018851967016', '9-Iv7LnG8J0CRyk_Ur3NIqWCEfflNN8gZhV2HuowvW1lZNJOi7jlyfoJIE2BJUuV1nhZ');
    const embed = new Discord.MessageEmbed()
        .setTitle('Left Guild')
        .setDescription(`Name: ${guild.name}\nID: ${guild.id}\nMembers: ${guild.memberCount}`)
        .setColor(global.config.get("embed.color", "#27a9e1"));

    webhook.send(embed);
};