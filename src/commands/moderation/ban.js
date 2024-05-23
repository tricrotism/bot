const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a user from the server')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('The user to ban')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('reason')
            .setDescription('The reason for banning the user')
            .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        await interaction.deferReply({ephemeral: true});
    
        const targetUser = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!targetUser) {
            return interaction.editReply('Please provide a valid user mention or ID.');
        }

        if (interaction.user.id === targetUser.id) {
            return interaction.editReply('You cannot ban yourself');
        }

        try {
            const guild = interaction.guild
            await guild.bans.create(targetUser.id, { reason });
            interaction.editReply(`User with ID ${targetUser.id} has been banned for: ${reason}`);
        } catch (error) {
            console.error(error);
            interaction.editReply('An error occurred while trying to ban the user.');
        }
    },
};
