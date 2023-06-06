const Command = require('../structures/command.js');
const { colors } = require('../constants');
const { getTrackTitle } = require('../utils/player');
const { EmbedBuilder } = require('discord.js');

module.exports = new Command({
    name: 'nowplaying',
    aliases: ['np'],
    description: 'Muestra información de lo que se está reproduciendo en este momento.',
    async run(Bot, message, args, extra = {}) {
        const queue = Bot.player.nodes.get(message.guild);
        if (!queue || !queue.node.isPlaying()) {
            const embed = new EmbedBuilder().setDescription(`No estoy reproduciendo nada en este server.`);
            return message.reply({ embeds: [embed] });
        }
        const progress = queue.node.createProgressBar({ timecodes: true, length: 8 });

        const track = queue.currentTrack;
        const title = getTrackTitle(track);

        return message.reply({
            embeds: [
                {
                    author: {
                        name: title,
                        url: track.url,
                    },
                    // description: `**[${title}](${track.url})**\nPedido por ${track.requestedBy}`,
                    thumbnail: {
                        url: `${track.thumbnail}`,
                    },
                    fields: [
                        {
                            name: `Pedida por:`,
                            value: `${track.requestedBy.username}#${track.requestedBy.discriminator}`,
                            inline: true,
                        },
                        {
                            name: `Views:`,
                            value: `${track.views}`,
                            inline: true,
                        },
                        {
                            name: '\u200b',
                            value: progress.replace(/ 0:00/g, ' ◉ LIVE'),
                        },
                    ],
                    footer: { text: `Fraan's Music | Reproduciendo ahora`, iconURL: 'https://cdn-icons-png.flaticon.com/512/183/183625.png' },
                    color: colors['now-playing'],
                },
            ],
        });
    },
});
