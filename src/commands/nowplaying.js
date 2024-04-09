const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Classic } = require('musicard');
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

        await message.deferReply({ ephemeral: true });

        const track = queue.currentTrack;
        const title = getTrackTitle(track);

        const progress = parseInt((queue.node.estimatedPlaybackTime / queue.node.totalDuration) * 100);

        const card = await Classic({
            thumbnailImage: track.thumbnail,
            backgroundImage: track.thumbnail,
            imageDarkness: 75,
            name: title,
            nameColor: '#FFFFFF',
            author: track.author,
            authorColor: '#afafaf',
            progress: progress,
            progressColor: '#afafaf',
            progressBarColor: '#838383',
            startTime: `${strings.requestedBy} ${track.requestedBy.username}`,
            endTime: track.duration,
            timeColor: '#cfcfcf',
        });

        const attachment = new AttachmentBuilder(card, { name: `card.png` });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('buttoncontrol_lyrics').setLabel(`⏵︎ ${strings.actions.searchLyrics}`).setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('buttoncontrol_skip').setLabel(`${strings.actions.skip} ⏭`).setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('buttoncontrol_queue').setLabel(`⊙ ${strings.actions.showQueue}`).setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setLabel(`URL`).setURL(track.url).setStyle(ButtonStyle.Link)
        );

        return message.editReply({
            components: [row],
            files: [attachment],
        });
    },
});
