const fs = require('fs');
const path = require('path');
const {Collection, Events} = require('discord.js');
const Discord = require('discord.js');
const formats = require('./util/formats')
const database = require('./util/database');
require('dotenv').config();

/**
* Discord bs to get everything working for the bot 
*/
const client = new Discord.Client({
    allowedMentions: {
        parse: [
            'users',
            'roles'
        ],
        repliedUser: true
    },
    autoReconnect: true,
    disabledEvents: [
        "TYPING_START"
    ],
    partials: [
        Discord.Partials.Channel,
        Discord.Partials.GuildMember,
        Discord.Partials.Message,
        Discord.Partials.Reaction,
        Discord.Partials.User,
        Discord.Partials.GuildScheduledEvent
    ],
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildModeration,
        Discord.GatewayIntentBits.GuildEmojisAndStickers,
        Discord.GatewayIntentBits.GuildIntegrations,
        Discord.GatewayIntentBits.GuildWebhooks,
        Discord.GatewayIntentBits.GuildInvites,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildPresences,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildMessageTyping,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.DirectMessageReactions,
        Discord.GatewayIntentBits.DirectMessageTyping,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildScheduledEvents,
        Discord.GatewayIntentBits.AutoModerationConfiguration,
        Discord.GatewayIntentBits.AutoModerationExecution,
        Discord.GatewayIntentBits.GuildMessagePolls,
        Discord.GatewayIntentBits.DirectMessagePolls,
    ],
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

const db = require('./util/database');
const connectWithRetry = (retries = 5, delay = 5000) => {
    db.connect((err, connection) => {
        if (err) {
            formats("error", `Error connecting to database: ${err}`);
            if (retries > 0) {
                formats("system", `Retrying to connect in ${delay / 1000} seconds... (${retries} retries left)`);
                setTimeout(() => connectWithRetry(retries - 1, delay), delay);
            }
            return;
        }
        formats("system", `Connected to MySQL database as id ${connection.threadId}`);
    });
};

connectWithRetry();

/**
* Handles checking the command directory(ies)
*/
for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            formats("commands", `${file} has loaded`)
        } else {
            formats("system", `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

/**
* Gets the handlers
*/
fs.readdirSync('./src/handlers').forEach((handler) => {
    require(`./handlers/${handler}`)(client);
});

/**
* Ready Event
*/
client.on(Events.ClientReady, async(readyClient) => {
    formats("system", `Logged in as ${readyClient.user.tag}`);

    // const shardCounts = await client.shard.fetchClientValues('guilds.cache.size');
    // const totalGuilds = await shardCounts.reduce((acc, guildCount) => acc + guildCount, 0);
    //
    // console.log(`Total shards: ${client.shard.count}`);
    // console.log(`Total guilds: ${totalGuilds}`);
});

/**
* Command Interaction Event
*/
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        await formats("error", `No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({content: 'There was an error while executing this command!', ephemeral: true});
        } else {
            await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
        }
    }
});

/**
* Login via .env
*/
client.login(process.env.TOKEN);