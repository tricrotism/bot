const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('insertmysql')
        .setDescription('Inserts data into the MySQL database')
        .addStringOption(option => option.setName('data').setDescription('The data to insert').setRequired(true)),
    async execute(interaction) {
        const data = interaction.options.getString('data');
        const db = require('../../util/database');
        db.query(`CREATE TABLE IF NOT EXISTS test (id INT AUTO_INCREMENT PRIMARY KEY, data TEXT)`, (err) => {
            if (err) {
                console.error(err);
                return interaction.reply({content: 'There was an error while creating the table!', ephemeral: true});
            }

            db.query(`INSERT INTO test (data) VALUES ('${data}')`, (err, results) => {
                if (err) {
                    console.error(err);
                    return interaction.reply({content: 'There was an error while inserting data into the database!', ephemeral: true});
                }
                interaction.reply({content: `Successfully inserted data into the database with ID ${results.insertId}`, ephemeral: true});
            });
        });
    },
};
