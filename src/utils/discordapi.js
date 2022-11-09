const { DISCORD_CLIENT_ID, TOKEN_DISCORD } = require('../keys');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

const publishSlashCommands = async (commands) => {
    const slashCommands = commands.map(cmd => ({
        name: cmd.name,
        description: cmd.description,
        options: cmd.options,
        defaultPermission: true
    }));
    const rest = new REST({ version: '10' }).setToken(TOKEN_DISCORD);
    try {
        await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), { body: slashCommands });
        console.log(`[INFO] Comandos publicados en discord.`)
    } catch (e) {
        console.error(e)
    }
}

module.exports = {
    publishSlashCommands,
}