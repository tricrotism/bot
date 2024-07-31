const {ShardingManager} = require('discord.js');
require('dotenv').config();
const formats = require('./util/formats');

const shard = new ShardingManager("./src/bot.js", {
    totalShards: "auto",
    token: process.env.TOKEN,
    timeout: -1,
    respawn: true
})

shard.on('shardCreate', shard => {
    formats("system", `Created shard: ${shard.id}`);
})

shard.spawn({ amount: 'auto', delay: 5500, timeout: 30000 }).catch(e => console.log(e))