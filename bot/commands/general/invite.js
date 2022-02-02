exports.run = async (client, message, args, guildConf, userConf) => {

    await client.sendEmbed(message.channel,
        `Invite me!`,
        `[Click-Here](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=${global.config.get("permissions")}&scope=bot)`
    );
    return;

}

module.exports.help = {
    name: "invite",
    description: "Shows the bot invite link",
    dm: true,
    cooldown: 5,
    aliases: ["inv"]
}
