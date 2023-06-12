const Command = require("../structures/command.js");
const { colors } = require('../constants');
const { useQueue } = require('discord-player');
const { getTrackTitle } = require('../utils/player');
const { ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = new Command({
    name: "skip",
    aliases: ['skipto'],
    description: "Skippea a una canción que elijas.",
    options: [
        { description: 'Indice de la canción donde skippear.', name: 'indice', required: false, type: 3 }
    ],
    async run(Bot, message, args, extra = {}) {
        const { isFromButton = false, skipTo: _skipTo } = extra;
        const reply = (content) => {
            isFromButton
                ? message.channel.send(content)
                : message.reply(content);
        }
        const queue = useQueue(message.guild);
        if (!queue || !queue.node.isPlaying()) {
            const embed = new EmbedBuilder().setDescription(`No estoy reproduciendo nada en este server.`);
            return reply({ embeds: [embed] });
        }

        if (queue.tracks.data.length === 0) {
            const embed = new EmbedBuilder().setDescription(`No hay canciones en cola.`);
            return reply({ embeds: [embed] });
        }

        const skipTo =
            (queue.tracks.data.length === 1 ? 0 : undefined) // auto skips when only one song is in queue
            ?? _skipTo
            ?? message?.options?._hoistedOptions.find((option) => option.name === 'indice');

        if (typeof skipTo !== 'undefined') {
            const index = skipTo > queue.tracks.data.length ? queue.tracks.data.length : skipTo;
            const track = queue.tracks.data[index];
            const embed = new EmbedBuilder();
            embed.setDescription(`Salté **[${queue.currentTrack.title}](${queue.currentTrack.url})** por **[${track.title}](${track.url})**`);
            embed.setColor(colors['skipped']);
            embed.setFooter({ text: `Skipeada por ${message.user.tag}`, iconURL: message.user.displayAvatarURL() });
            queue.node.jump(track);
            return reply({ embeds: [embed] });
        }

        const tracks = queue.tracks.data.slice(0, 25).map((track, index) => {
            const title = getTrackTitle(track);
            return ({
                label: title,
                value: `${index}`,
                description: track.author,
            })
        })

        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("skip")
                .setPlaceholder(`Mostrando las primeras ${tracks.length} canciones.`)
                .setMaxValues(1)
                .addOptions(tracks)
        );

        return reply({
            components: [row]
        })

    }
});

