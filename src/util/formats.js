async function systemLog(type, string) {
    const chalk = await import('chalk');
    let prefix = "";
    switch(type) {
        case "system":
            prefix = chalk.default.red("System ");
            break;
        case "error":
            prefix = chalk.default.red("Error ");
            break;
        case "generic":
            prefix = chalk.default.blue("Generic ");
            break;
        case "events":
            prefix = chalk.default.green("Events ");
            break;
        default:
            prefix = "";
    }
    console.log(prefix + chalk.default.blueBright(">> ") + chalk.default.white(string));
}

module.exports = systemLog;
