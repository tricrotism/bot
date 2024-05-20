const { Colors, EmbedBuilder } = require("discord.js");

module.exports = async (client, member) => {

    const channel = member.guild.channels.cache.get("1233284224098766902")

    const currentTime = Math.floor(new Date().getTime() / 1000);

    const embed = new EmbedBuilder()
    .setColor(Colors.Red)
    .setTitle("Member Left")
    .setThumbnail(member.user.avatarURL({size:4096}))
    .setDescription(`**User:** ${member.user} (${member.user.username})
    \n**ID:** ${member.user.id}
    \n**Current Time:** <t:${currentTime}> (<t:${currentTime}:R>)`)

    channel.send({embeds: [embed]});
};