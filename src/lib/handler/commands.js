const fs = require('fs');

module.exports = async (Bot) => {

    try {
        const files = fs.readdirSync('./src/commands/')
            .filter(file => file.endsWith('.js'));
        for (const file of files) {
            Bot.commands.push(require(`../../commands/${file}`))
        }
        console.log(`[INFO] ${files.length} comandos cargados.`)

    } catch (e) {
        console.error(e)
    }

};
