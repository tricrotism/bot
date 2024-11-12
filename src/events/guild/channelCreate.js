const {AuditLogEvent, EmbedBuilder, Colors} = require("discord.js")
const getConfig = require("../../util/getConfig")

module.exports = async (client, channel) => {
    const guild = channel.guild

    const channelLogChannel = guild.channels.cache.get(getConfig(guild.id, "logChannelId"))

    if (!channelLogChannel) {
        console.error(`Channel with ID ${getConfig(guild.id, "logChannelId")} was not found for guild ${guild.id}`)
        return
    }

    const currentTime = Math.floor(Date.now() / 1000)
    const fetchedLogs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.ChannelCreate
    })
    const channelCreateLog = fetchedLogs.entries.first()

    const embed = new EmbedBuilder()
        .setColor(Colors.Green)
        .setTitle("Channel Created")
        .setDescription("A new channel was created.")
        .addFields([
            {
                name: "Channel",
                value: `\`${channel.name}\` (${channel.id})`
            },
            {
                name: "Current Time",
                value: `<t:${currentTime}> (<t:${currentTime}:R>)`
            },
            {
                name: "User Who Created",
                value: `${channelCreateLog.executor}`
            }
        ])

    channelLogChannel.send({embeds: [embed]});
}