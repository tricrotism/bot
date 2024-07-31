const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

//todo: embed for kick in logs

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a user from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for kicking the user')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        await interaction.deferReply({ephemeral: true});

        const targetUser = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!targetUser) {
            return interaction.editReply('Please provide a valid user mention or ID.');
        }

        if (interaction.user.id === targetUser.id) {
            return interaction.editReply('You cannot kick yourself');
        }

        try {
            const guild = interaction.guild
            await guild.members.kick(targetUser.id, {reason});
            await interaction.editReply(`User with ID ${targetUser.id} has been kicked for: ${reason}`);
        } catch (error) {
            console.error(error);
            await interaction.editReply('An error occurred while trying to kick the user.');
        }
    }
}