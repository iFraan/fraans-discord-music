const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { musicCard } = require('musicard');
const Command = require('../structures/command.js');
const { getTrackTitle } = require('../utils/player');
const { getLanguage } = require('../utils/language');

module.exports = new Command({
    name: 'nowplaying',
    aliases: ['np'],
    description: 'Muestra información de lo que se está reproduciendo en este momento.',
    async run(Bot, message, args, extra = {}) {
        const strings = getLanguage(message.guild.id);
        const queue = Bot.player.nodes.get(message.guild);
        if (!queue || !queue.node.isPlaying()) {
            const embed = new EmbedBuilder().setDescription(strings.notPlaying);
            return message.reply({ embeds: [embed] });
        }

        const track = queue.currentTrack;
        const title = getTrackTitle(track);

        const progress = parseInt((queue.node.estimatedPlaybackTime / queue.node.totalDuration) * 100);

        const card = new musicCard()
            .setName(title)
            .setAuthor(track.author)
            .setColor('auto')
            .setTheme('classic')
            .setBrightness(80)
            .setThumbnail(track.thumbnail)
            .setProgress(progress)
            .setStartTime(`${strings.requestedBy} ${track.requestedBy.username}`)
            .setEndTime(track.duration);

        const buffer = await card.build();
        const attachment = new AttachmentBuilder(buffer, { name: `card.png` });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('buttoncontrol_lyrics').setLabel(`⏵︎ ${strings.actions.searchLyrics}`).setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('buttoncontrol_skip').setLabel(`${strings.actions.skip} ⏭`).setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('buttoncontrol_queue').setLabel(`⊙ ${strings.actions.showQueue}`).setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setLabel(`URL`).setURL(track.url).setStyle(ButtonStyle.Link),
        );

        return message.reply({
            components: [row],
            files: [attachment],
        });
    },
});
