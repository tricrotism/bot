const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unbans a user from the server')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('The user to unban')
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

        const guild = interaction.guild;

        try {
            await guild.bans.fetch(targetUser.id);

            await guild.bans.remove(targetUser.id, { reason });
            interaction.editReply(`User with ID ${targetUser.id} has been unbanned for: ${reason}`);
        } catch (error) {
            if (error.message === 'Unknown Ban') {
                interaction.editReply('This user is not banned.');
            } else {
                console.error(error);
                interaction.editReply('An error occurred while trying to unban the user.');
            }
        }
    },
};
