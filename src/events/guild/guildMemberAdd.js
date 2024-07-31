const {Colors, EmbedBuilder} = require("discord.js");
const getConfig = require("../../util/getConfig");

module.exports = async (client, member) => {

    client.invites = {}

    const channel = member.guild.channels.cache.get(getConfig(member.guild.id, "logChannelId"))

    member.guild.invites.fetch().then(guildInvites => {
        guildInvites.some(invite => {
            if (invite.uses !== client.invites[invite.code]) {
                const creationDate = member.user.createdAt.getTime()
                const playerAccountCreationDate = Math.floor(creationDate / 1000)
                const currentTime = Math.floor(Date.now() / 1000)
                const inviter = client.users.cache.get(invite.inviter.id)
                const embed = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setTitle("Member Joined")
                    .setThumbnail(member.user.avatarURL({size: 4096}))
                if (inviter) {
                    embed.addFields([
                        {
                            name: "User",
                            value: `${member.user} (${member.user.username})`
                        }, {
                            name: "ID",
                            value: `${member.user.id}`
                        }, {
                            name: "Invited By",
                            value: `${inviter} (Code: ${invite.code} | Inviter Username: ${inviter.username})`
                        }, {
                            name: "Join Time",
                            value: `<t:${currentTime}> (<t:${currentTime}:R>)`
                        }, {
                            name: "Age",
                            value: `<t:${playerAccountCreationDate}>`
                        },
                    ])
                } else {
                    embed.addFields([
                        {
                            name: "User",
                            value: `${member.user} (${member.user.username})`
                        }, {
                            name: "ID",
                            value: `${member.user.id}`
                        }, {
                            name: "Invited By",
                            value: `N/a`
                        }, {
                            name: "Join Time",
                            value: `<t:${currentTime}> (<t:${currentTime}:R>)`
                        }, {
                            name: "Age",
                            value: `<t:${playerAccountCreationDate}>`
                        },
                    ])
                }

                channel.send({embeds: [embed]});

                return true
            }
            return false
        })
    })

};