const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("purgeuser")
        .setDescription("Purges a specified amount of messages from a user")
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Select the user to purge messages from')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Select the amount of messages to purge')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    ,
    async execute(interaction) {
        try {
            await interaction.deferReply({ephemeral: true});
            const user = interaction.options.getUser('user');
            const amount = interaction.options.getInteger('amount');

            if (!user) {
                await interaction.editReply('Please provide a valid user mention or ID.');
                return;
            }

            if (!amount || amount < 1 || amount > 250) {
                await interaction.editReply('Please provide a valid amount of messages to purge (1-250).');
                return;
            }

            await interaction.editReply(`Purging ${amount} messages from user ${user}...`);
            const messages = await interaction.channel.messages.fetch({limit: amount});
            const messagesToDelete = messages.filter(msg => msg.author.id === user.id);
            await interaction.channel.bulkDelete(messagesToDelete);
        } catch (error) {
            console.error(error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.followUp('An error occurred while trying to purge messages from the user.');
            }
        }
    }
};