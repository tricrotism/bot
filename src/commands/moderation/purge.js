const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("purge")
        .setDescription("Purges a specified amount of messages in the channel")
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Select the amount of messages to purge')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    ,
    async execute(interaction) {
        try {
            await interaction.deferReply({ephemeral: true});
            const amount = interaction.options.getInteger('amount');

            if (!amount || amount < 1 || amount > 250) {
                await interaction.editReply('Please provide a valid amount of messages to purge (1-250).');
                return;
            }

            await interaction.editReply(`Purging ${amount} messages...`);
            const messages = await interaction.channel.messages.fetch({limit: amount});
            await interaction.channel.bulkDelete(messages);
        } catch (error) {
            console.error(error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.followUp('An error occurred while trying to purge messages.');
            }
        }
    }
};