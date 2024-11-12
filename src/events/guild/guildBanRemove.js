const {AuditLogEvent, EmbedBuilder, Colors} = require("discord.js")
const getConfig = require("../../util/getConfig");

module.exports = async (client, ban) => {
    const guild = ban.guild

    const channel = guild.channels.cache.get(getConfig(guild.id, "logChannelId"))

    if (!channel) {
        console.error(`Channel with ID ${getConfig(guild.id, "logChannelId")} was not found for guild ${guild.id}`)
        return
    }

    const currentTime = Math.floor(Date.now() / 1000)
    const fetchedLogs = await ban.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberBanRemove
    })
    const banLog = fetchedLogs.entries.first()
    let reason = "No reason provided";

    if (banLog.reason) {
        reason = banLog.reason
    }

    const embed = new EmbedBuilder()
        .setColor(Colors.DarkGreen)
        .setTitle("Member Unbanned")
        .setThumbnail(ban.user.avatarURL({size: 4096}))
        .setDescription("Oh... I guess they're fine now.")
        .addFields([
            {
                name: "User",
                value: `${ban.user} (${ban.user.username})`
            },
            {
                name: "ID",
                value: `${ban.user.id}`
            },
            {
                name: "Reason",
                value: `${(reason || "No reason provided")}`
            },
            {
                name: "Current Time",
                value: `<t:${currentTime}> (<t:${currentTime}:R>)`
            },
            {
                name: "User Who Unbanned",
                value: `${banLog.executor}`
            }
        ])

    channel.send({embeds: [embed]});
}