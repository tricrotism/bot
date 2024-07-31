const fs = require('fs');
const formats = require('../util/formats');
const guildsPath = './configs/guilds/';

module.exports = (client) => {
    client.once('ready', () => {
        const guilds = client.guilds.cache.map(guild => guild.id);
        formats("system", "Loading Guild Configs");
        const defaultConfig = {
            "modRoleId": "000000000000000000",
            "adminRoleId": "000000000000000000",
            "muteRoleId": "000000000000000000",
            "welcomeChannelId": "000000000000000000",
            "logChannelId": "000000000000000000",
            "welcomeMessage": "Welcome to the server, {user}!",
            "leaveMessage": "Goodbye, {user}!",
            "welcomeEnabled": false,
            "leaveEnabled": false,
            "logEnabled": false,
            "modLogEnabled": false,
            "modLogChannelId": "000000000000000000",
            "modLogMessage": "{user} has been {action} by {mod} for {reason}",
            "modLogReason": "No reason provided",
            "modLogActions": {
                "ban": "banned",
                "kick": "kicked",
                "warn": "warned",
                "mute": "muted"
            }
        };

        guilds.forEach(guild => {
            const guildConfigPath = `${guildsPath}${guild}.json`;
            let guildConfig = {};

            if (!fs.existsSync(guildConfigPath)) {
                fs.writeFileSync(guildConfigPath, JSON.stringify(defaultConfig, null, 2));
                formats("system", `Created config for guild ${guild}`);
            } else {
                guildConfig = JSON.parse(fs.readFileSync(guildConfigPath, 'utf8'));
                let updated = false;

                //a map of keys that need to be added to the config
                let keysNeedingToBeAdded = [];

                for (const [key, value] of Object.entries(defaultConfig)) {
                    if (!guildConfig.hasOwnProperty(key)) {
                        guildConfig[key] = value;
                        formats("system", `Added missing key ${key} to guild ${guild}`);
                        updated = true;
                        keysNeedingToBeAdded.push(key, value);
                    }
                }

                if (updated) {
                    fs.writeFileSync(guildConfigPath, JSON.stringify(guildConfig, null, 2));
                }
            }

            formats("system", `Loaded config for guild ${guild}`);
        });
    });
};