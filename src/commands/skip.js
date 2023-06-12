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
        const queue = useQueue(message.guild);
        if (!queue || !queue.node.isPlaying()) {
            const embed = new EmbedBuilder().setDescription(`No estoy reproduciendo nada en este server.`);
            return message.reply({ embeds: [embed] });
        }

        const { isFromButton = false } = extra;
        const skipTo = message?.options?._hoistedOptions.find((option) => option.name === 'indice');

        if (skipTo) {
            const index = skipTo > queue.tracks.data.length ? queue.tracks.data.length : skipTo;
            const track = queue.tracks.data[index];
            const embed = new EmbedBuilder();
            embed.setDescription(`Salté **[${queue.currentTrack.title}](${queue.currentTrack.url})** por **[${track.title}](${track.url})**`);
            embed.setColor(colors['skipped']);
            embed.setFooter({ text: `Skipeada por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
            queue.node.jump(track);
            return isFromButton ? message.channel.send({ embeds: [embed] }) : message.reply({ embeds: [embed] });
        }

        const tracks = queue.tracks.data.slice(0, 24).map((track, index) => {
            const title = getTrackTitle(track);
            return ({
                label: title,
                value: `${index}`,
                description: track.author,
            })
        })


        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("skipto_select")
                .setPlaceholder('Seleccioná una canción a la que skippear.')
                .setMaxValues(1)
                .addOptions(tracks)
        );

        const content = {
            embeds: [
                {
                    footer: { text: `Skip | Mostrando las primeras ${tracks.length} canciones.`, iconURL: 'https://cdn-icons-png.flaticon.com/512/183/183625.png' },
                    color: colors['light-blue']
                }
            ],
            components: [row]
        }
        isFromButton
            ? message.channel.send(content)
            : message.reply(content);
    }
});

