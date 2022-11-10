const Command = require("../structures/command.js");
const { colors, components } = require("../constants")
const { getTrackTitle } = require('../utils/player');
const { EmbedBuilder } = require('discord.js');

module.exports = new Command({
    name: "queue",
    description: "Muestra la queue actual.",
    async run(Bot, message, args, extra = {}) {
        const { isFromButton = false } = extra;
        const queue = Bot.player.getQueue(message.guild);
        if (!queue || !queue.current) {
            if (isFromButton) return;
            const embed = new EmbedBuilder();
            embed.setColor(colors['queue']);
            embed.setDescription(`No hay canciones en la queue.`);
            return message.reply({ embeds: [embed] });
        }

        const pages = [];
        let page = 1, emptypage = false, usedby = isFromButton ? `` : ""; // [${message.member}]\n
        do {
            const pageStart = 10 * (page - 1);
            const pageEnd = pageStart + 10;
            const tracks = queue.tracks.slice(pageStart, pageEnd).map((m, i) => {
                const title = getTrackTitle(m);
                return `**${i + pageStart + 1}**. [${title}](${m.url}) ${m.duration} - ${m.requestedBy}`;
            });
            if (tracks.length) {
                const embed = new EmbedBuilder();
                embed.setDescription(`${usedby}${tracks.join('\n')}${queue.tracks.length > pageEnd
                    ? `\n... ${queue.tracks.length - pageEnd} canción(es) mas`
                    : ''
                    }`);
                if (page % 2 === 0) embed.setColor(colors['queue']);
                else embed.setColor(colors['queue']);
                const title = getTrackTitle(queue.current);
                if (page === 1) embed.setAuthor({ name: `Reproduciendo: ${title}`, iconURL: null, url: `${queue.current.url}` });
                pages.push(embed);
                page++;
            }
            else {
                emptypage = true;
                if (page === 1) {
                    const embed = new EmbedBuilder();
                    embed.setColor(colors['queue']);
                    embed.setDescription(`${usedby}No hay mas canciones en la lista.`);
                    const title = getTrackTitle(queue.current);
                    embed.setAuthor({ name: `Reproduciendo: ${title}`, iconURL: null, url: `${queue.current.url}` });
                    return isFromButton ? message.channel.send({ embeds: [embed] }) : message.reply({ embeds: [embed] });
                }
                if (page === 2) {
                    return isFromButton ? message.channel.send({ embeds: [pages[0]] }) : message.reply({ embeds: [pages[0]] });
                }
            }
        } while (!emptypage);

        components.EmbedPages(message, pages, { timeout: 40000, fromButton: isFromButton });
    }
});