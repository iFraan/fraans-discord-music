const { AttachmentBuilder } = require('discord.js');
const { musicCard } = require('musicard');
const Command = require('../structures/command.js');
const { getTrackTitle } = require('../utils/player');
const { getLanguage } = require('../utils/language');
const { EmbedBuilder } = require('discord.js');

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

        return message.reply({
            files: [attachment],
        });
    },
});
