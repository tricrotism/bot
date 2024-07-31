const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("slowmode")
        .setDescription("Sets the slowmode of the channel")
        .addIntegerOption(option =>
            option.setName('time')
                .setDescription('Select the time in seconds for the slowmode')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        try {
            await interaction.deferReply({ephemeral: true});
            const time = interaction.options.getInteger('time');

            if (time === 0) {
                await interaction.editReply('Removing slowmode...');
                await interaction.channel.setRateLimitPerUser(0);
                return;
            }

            if (!time || time < 0 || time > 21600) {
                await interaction.editReply('Please provide a valid time for the slowmode (0-21600).');
                return;
            }

            await interaction.editReply(`Setting slowmode to ${time} seconds...`);
            await interaction.channel.setRateLimitPerUser(time);
        } catch (error) {
            console.error(error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.followUp('An error occurred while trying to set the slowmode.');
            }
        }
    }
}