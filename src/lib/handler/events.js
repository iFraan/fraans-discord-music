const fs = require('fs');

module.exports = async (Bot) => {

    Bot.removeAllListeners();
    /* Discord Events */
    try {
        const files = fs.readdirSync('./src/events/')
            .filter(file => file.endsWith('.js'));
        for (const file of files) {
            const event = require(`../../events/${file}`);
            const eventName = file.split('.')[0];
            Bot.on(eventName, event.bind(null, Bot));
        }
        console.log(`[INFO] ${files.length} eventos del cliente cargados.`)

    } catch (e) {
        console.error(e)
    }

    /* Player Events */
    try {
        const files = fs.readdirSync('./src/events/player')
            .filter(file => file.endsWith('.js'));
        for (const file of files) {
            const event = require(`../../events/player/${file}`);
            const eventName = file.split('.')[0];
            Bot.player.on(eventName, event.bind(null, Bot));
        }
        console.log(`[INFO] ${files.length} eventos del player cargados.`)

    } catch (e) {
        console.error(e)
    }

};
