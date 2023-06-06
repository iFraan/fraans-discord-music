const { ActivityType } = require('discord.js');
// Este evento se dispara cuando el bot está listo
module.exports = async (Bot) => {
    console.log('[INFO] Estoy listo pa. Traeme todo.');
    Bot.user.setActivity(`a tu mamá`, { type: ActivityType.Listening });
};
