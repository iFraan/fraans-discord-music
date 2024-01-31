const { QueueRepeatMode } = require('discord-player');
const db = require('../db');

/**
 * A database guild object
 * @typedef {Object} Guild
 * @property {string} created_at - A date string, indicating when was created.
 * @property {string} updated_at - A date string, indicating when was updated.
 * @property {string?} language - The language selected, in ISO format (en-us).
 * @property {string?} djRole - The DJ Role defined.
 * @property {QueueRepeatMode?} repeatMode - The repeat mode selected.
 */

const ensure = (guild) => db.guilds.ensure(guild, { created_at: new Date().toString() });

/**
 * Set properties in a guild
 * @param {String} guild GuildID
 * @param {Object} parameters Parameters to save
 * @returns {Guild} Guild
*/
const set = (guild, parameters = {}) => {
    if (!guild) throw new Error('guild cant be null')

    const current = ensure(guild)
    const Payload = {
        ...current,
        ...parameters,
        updated_at: new Date().toString()
    }
    const data = db.guilds.set(guild, Payload)
    return data;
}

/**
 * Get properties in a guild
 * @param {String} guild GuildID
 * @returns {Guild} Guild
*/
const get = (guild) => {
    const data = ensure(guild, {})
    return data;
}

module.exports = {
    get,
    set,
}