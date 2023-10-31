const GuildDB = require('../db/guilds');
const DEFAULT_LANG = 'es_ar';

/**
 * Set properties in a guild
 * @param {String} guildid GuildID
 * @returns {Object} Language
*/
const getLanguage = (guildid) => {
    if (!guildid) throw new Error('you must pass a guild id')
    const { language } = GuildDB.get(guildid);
    const strings = require(`../languages/${language ?? DEFAULT_LANG}.js`);

    return strings;
}

module.exports = {
    getLanguage,
}