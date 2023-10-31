const { EmbedNowPlaying } = require('../lib/components');
const { colors } = require('../constants');
const { EmbedBuilder, InteractionType, ComponentType } = require('discord.js');
const { getLanguage } = require("../utils/language.js");

// todo: improve/re-factor/re-do handler for interactios

module.exports = async (Bot, interaction) => {
    /* Si no está en la guild (wtf) */
    if (!interaction.inGuild()) return;
    /* Si no tengo permisos para hablar en el canal de texto */
    if (!interaction.guild.members.me.permissionsIn(interaction.channel).has(Bot.requiredTextPermissions)) return;

    const strings = getLanguage(message.guild.id);

    /* ----- Slash commands ----- */
    if (interaction.type === InteractionType.ApplicationCommand && !interaction.user.bot && interaction.guild) {
        const command = Bot.commands.find((cmd) => cmd.name.toLowerCase() == interaction.commandName);
        if (!command) return;
        /* Si el user no tiene permisos para ese comando */
        if (!interaction.member.permissionsIn(interaction.channel).has(command.permission))
            return interaction.reply({
                embeds: [new EmbedBuilder().setDescription(strings.commands.notEnoughPermissions.replace('{PERMISSION}', command.permission))],
            });
        const args = interaction.options._hoistedOptions.map((option) => option.value);
        return command.run(Bot, interaction, args, { slash: true });
    }

    /* ----- Controles ----- */
    if (interaction.componentType === ComponentType.Button && interaction.customId.includes('buttoncontrol')) {
        const queue = Bot.player.nodes.get(interaction.guild);
        if (!queue || !interaction.member.voice.channelId || (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId))
            return;
        const isPlaying = queue.node.isPlaying() ?? false;
        const embed = new EmbedBuilder();
        switch (interaction.customId) {
            case 'buttoncontrol_play':
                isPlaying ? queue.node.pause() : queue.node.resume();
                queue.metadata?.nowPlayingMessage.edit(
                    EmbedNowPlaying({
                        track: queue.currentTrack,
                        isPlaying: !isPlaying,
                        status: isPlaying ? 'paused' : 'resumed',
                        interaction,
                        queue,
                    })
                );
                await interaction.deferUpdate();
                break;
            case 'buttoncontrol_disconnect':
                embed.setDescription(strings.disconnectedFromVc);
                embed.setColor(colors['disconnected']);
                embed.setFooter({ text: strings.disconnectedBy.replace('{USER}', interaction.user.tag), iconURL: interaction.user.displayAvatarURL() });
                interaction.channel.send({ embeds: [embed] });
                await interaction.deferUpdate();
                queue.delete(true);
                break;
            case 'buttoncontrol_next':
                embed.setDescription(
                    strings.skippedFor
                        .replace('{TRACK_TITLE}', queue.currentTrack.title)
                        .replace('{TRACK_URL}', queue.currentTrack.url)
                );
                embed.setColor(colors['skipped']);
                embed.setFooter({ text: `Skipeada por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                interaction.channel.send({ embeds: [embed] });
                await interaction.deferUpdate();
                queue.node.skip();
                break;
            case 'buttoncontrol_skip':
                /* run skip command */
                Bot.commands.find((x) => x.name.toLowerCase() == 'skip')
                    .run(Bot, interaction, ['skip'], { isFromButton: true });
                await interaction.deferUpdate();
                break;
            case 'buttoncontrol_queue':
                /* run queue command */
                Bot.commands.find((x) => x.name.toLowerCase() == 'queue')
                    .run(Bot, interaction, ['queue'], { slash: false, isFromButton: true });
                await interaction.deferUpdate();
                break;
        }
    }
    /* select menu */
    if (interaction.isStringSelectMenu()) {
        switch (interaction.customId) {
            case 'skip':
                /* run skip command */
                Bot.commands.find((x) => x.name.toLowerCase() == 'skip')
                    .run(Bot, interaction, ['skip'], { isFromButton: true, skipTo: interaction.values[0] });
                await interaction.deferUpdate();
                break;
            case 'filters':
                /* run skip command */
                Bot.commands.find((x) => x.name.toLowerCase() == 'filters')
                    .run(Bot, interaction, ['filters'], { isFromButton: true, selectedFilters: interaction.values });
                await interaction.deferUpdate();
                break;
            case 'languages':
                /* run skip command */
                Bot.commands.find((x) => x.name.toLowerCase() == 'languages')
                    .run(Bot, interaction, ['languages'], { isFromButton: true, selectedLang: interaction.values });
                await interaction.deferUpdate();
                break;
        }
    }
};
