const {
    TOKEN_DISCORD,
    TOKEN_GENIUS,
    DISCORD_CLIENT_ID,
} = require('./keys.json');

module.exports = {
    TOKEN_DISCORD: TOKEN_DISCORD || '',
    DISCORD_CLIENT_ID: DISCORD_CLIENT_ID || '',
    TOKEN_GENIUS: TOKEN_GENIUS || '',
};
