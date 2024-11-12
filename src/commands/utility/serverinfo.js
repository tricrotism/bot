const {SlashCommandBuilder, EmbedBuilder, Colors} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Replies with server information'),
    async execute(interaction) {
        const guild = interaction.guild;
        const owner = await guild.fetchOwner();
        const channelCountForText = guild.channels.cache.filter(channel => channel.type === 'TEXT').size;
        const channelCountForVoice = guild.channels.cache.filter(channel => channel.type === 'VOICE').size;
        const embed = new EmbedBuilder()
            .setColor(Colors.Aqua)
            .addFields([
                {name: 'Server Name', value: guild.name},
                {name: 'Owner', value: owner.user.tag},
                {name: 'Owner ID', value: owner.id},
                {name: 'User Count', value: String(guild.memberCount)},
                {name: 'Role Count', value: String(guild.roles.cache.size)},
                {name: 'Channel Count', value: String(guild.channels.cache.size)},
                {name: 'Text Channels', value: String(channelCountForText)},
                {name: 'Voice Channels', value: String(channelCountForVoice)},
                {name: 'Booster Count', value: String(guild.premiumSubscriptionCount || '0')},
                {name: 'Created At', value: `${guild.createdAt.toDateString()} (${guild.createdAt.toISOString()})`},
                {name: 'Around Since', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`},
            ]);
        await interaction.reply({embeds: [embed]});
    },
};