//read from a json file which is the config for the guild

const fs = require("fs")

module.exports = (guildId, key) => {
    const path = `./configs/guilds/${guildId}.json`

    if (!fs.existsSync(path)) {
        return null
    }

    const config = JSON.parse(fs.readFileSync(path, 'utf8'))

    return config[key]
}