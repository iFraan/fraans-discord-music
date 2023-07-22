require('dotenv').config();

module.exports = {
    TOKEN_DISCORD: process.env.TOKEN_DISCORD ?? '',
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID ?? '',
    DISCORD_DEV_GUILD_ID: process.env.DISCORD_DEV_GUILD_ID ?? '',
    TOKEN_GENIUS: process.env.TOKEN_GENIUS ?? '',
};
