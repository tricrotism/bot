const fs = require('fs');
const Discord = require('discord.js');
const formats = require('../util/formats')

/*
* Fetches all events and registers them
*/
module.exports = (client) => {
    formats("system", "Loading Events");

    fs.readdirSync('./src/events').forEach(dirs => {
        const events = fs.readdirSync(`./src/events/${dirs}`).filter(files => files.endsWith('.js'));

        console.log("\n" + formats("system", `${events.length} events (${dirs}) loaded`) + "\n");

        for (const file of events) {
            const event = require(`../events/${dirs}/${file}`);
            formats("events", `${file} has loaded`)
            const eventName = file.split(".")[0];
            const eventUpperCase = eventName.charAt(0).toUpperCase() + eventName.slice(1);
            if(Discord.Events[eventUpperCase] === undefined){
                client.on(eventName, event.bind(null, client)).setMaxListeners(0);
            }else {
                client.on(Discord.Events[eventUpperCase], event.bind(null, client)).setMaxListeners(0);
            }
        };
    });
}
