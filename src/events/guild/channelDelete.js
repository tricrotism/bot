const {AuditLogEvent, EmbedBuilder, Colors} = require("discord.js")
const getConfig = require("../../util/getConfig")

module.exports = async (client, channel) => {
    const guild = channel.guild

    const channelLogChannel = guild.channels.cache.get(getConfig(guild.id, "logChannelId"))

    if (!channelLogChannel) {
        console.error(`Channel with ID ${channel.id} was not found.`)
        return
    }

    const currentTime = Math.floor(Date.now() / 1000)
    const fetchedLogs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.ChannelDelete
    })
    const channelCreateLog = fetchedLogs.entries.first()

    const embed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle("Channel Deleted")
        .setDescription("A channel was deleted.")
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
                name: "User Who Deleted",
                value: `${channelCreateLog.executor}`
            }
        ])

    channelLogChannel.send({embeds: [embed]});
}