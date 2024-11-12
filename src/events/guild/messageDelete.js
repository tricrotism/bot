const {AuditLogEvent, EmbedBuilder, Colors} = require("discord.js")
const getConfig = require("../../util/getConfig")

module.exports = async (client, message) => {
    const guild = message.guild

    const channelLogChannel = guild.channels.cache.get(getConfig(guild.id, "logChannelId"))

    if (!channelLogChannel) {
        console.error(`Channel with ID ${getConfig(guild.id, "logChannelId")} was not found for guild ${guild.id}`)
        return
    }

    const currentTime = Math.floor(Date.now() / 1000)
    const fetchedLogs = await message.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MessageDelete
    })
    const messageDeleteLog = fetchedLogs.entries.first()

    if (message.author.bot) {
        return
    }

    const embed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle("Message Deleted")
        .setDescription("A message was deleted.")
        .setThumbnail(message.author.displayAvatarURL())
        .addFields([
            {
                name: "Channel",
                value: `<#${message.channel.id}>`
            },
            {
                name: "Current Time",
                value: `<t:${currentTime}> (<t:${currentTime}:R>)`
            },
            {
                name: "User Who Sent",
                value: `${message.author}`
            },
            {
                name: "User Who Deleted",
                value: `${messageDeleteLog.executor}`
            }
        ])

    if (message.content) {
        embed.addFields([
            {
                name: "Content",
                value: message.content
            }
        ])
    }

    if (message.content.includes("<:") || message.content.includes("<a:")) {
        const emojis = message.content.match(/<a?:\w+:\d+>/g)
        for (const emoji of emojis) {
            const emojiSplit = emoji.split(":")
            const emojiId = emojiSplit[2].replace(">", "")
            const emojiUrl = `https://cdn.discordapp.com/emojis/${emojiId}.png`
            embed.addFields([
                {
                    name: "Emoji URL",
                    value: emojiUrl,
                    inline: true
                }
            ])
        }
    }

    channelLogChannel.send({embeds: [embed]});
}