const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nukechannel")
        .setDescription("Nukes the current channel")
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Select the channel to be nuked!')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        try {
            const channel = interaction.options.getChannel('channel') || interaction.channel;

            if (!channel) {
                await interaction.editReply('Please provide a valid channel mention or ID.');
                return;
            }

            await interaction.user.send(`Nuking channel ${channel.name} in guild ${interaction.guild.name}...`);
            const position = channel.rawPosition;
            const newChannel = await channel.clone();
            await channel.delete();
            await newChannel.setPosition(position);
        } catch (error) {
            console.error(error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.followUp('An error occurred while trying to nuke the channel.');
            }
        }
    }
};