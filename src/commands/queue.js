const Command = require('../structures/command.js');
const { colors } = require('../constants');
const { EmbedPages } = require('../lib/components');
const { getTrackTitle } = require('../utils/player');
const { EmbedBuilder } = require('discord.js');

module.exports = new Command({
    name: 'queue',
    description: 'Muestra la queue actual.',
    async run(Bot, message, args, extra = {}) {
        const { isFromButton = false } = extra;
        const queue = Bot.player.nodes.get(message.guild);
        if (!queue || !queue.currentTrack) {
            if (isFromButton) return;
            const embed = new EmbedBuilder();
            embed.setColor(colors['queue']);
            embed.setDescription(`No hay canciones en la queue.`);
            return message.reply({ embeds: [embed] });
        }

        const pages = [];
        let page = 1,
            emptypage = false;
        do {
            const pageStart = 10 * (page - 1);
            const pageEnd = pageStart + 10;
            const tracks = queue.tracks.data.slice(pageStart, pageEnd).map((track, i) => {
                const title = getTrackTitle(track);
                return `**${i + pageStart + 1}**. [${title}](${track.url}) ${track.duration} - ${track.requestedBy.username}#${track.requestedBy.discriminator}`;
            });
            if (tracks.length) {
                const embed = new EmbedBuilder();
                const title = getTrackTitle(queue.currentTrack);
                embed.setAuthor({ name: `Reproduciendo: ${title}`, iconURL: queue.currentTrack.thumbnail ?? null, url: `${queue.currentTrack.url}` });
                embed.setDescription(`${tracks.join('\n')}${queue.tracks.size > pageEnd ? `\n... ${queue.tracks.size - pageEnd} canción(es) mas` : ''}`);
                embed.setColor(colors['queue']);
                pages.push(embed);
                page++;
            } else {
                emptypage = true;
                if (page === 1) {
                    const embed = new EmbedBuilder();
                    const title = getTrackTitle(queue.currentTrack);
                    embed.setAuthor({ name: `Reproduciendo: ${title}`, iconURL: null, url: `${queue.currentTrack.url}` });
                    embed.setColor(colors['queue']);
                    embed.setDescription(`No hay mas canciones en la lista.`);
                    return isFromButton ? message.channel.send({ embeds: [embed] }) : message.reply({ embeds: [embed] });
                }
                if (page === 2) {
                    return isFromButton ? message.channel.send({ embeds: [pages[0]] }) : message.reply({ embeds: [pages[0]] });
                }
            }
        } while (!emptypage);

        EmbedPages(message, pages, { timeout: 40000, fromButton: isFromButton });
    },
});
