const { DISCORD_CLIENT_ID, DISCORD_DEV_GUILD_ID, TOKEN_DISCORD } = require('../keys');
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
        if (DISCORD_DEV_GUILD_ID !== '') {
            await rest.put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_DEV_GUILD_ID), { body: slashCommands });
            console.log(`[INFO] Comandos publicados en discord/dev.`)
        }
    } catch (e) {
        console.error(e)
    }
};

const avatarUrlFrom = ({ id, avatar }) => {
    return `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp`
}

module.exports = {
    publishSlashCommands,
    avatarUrlFrom,
}