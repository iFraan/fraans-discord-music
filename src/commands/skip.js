const { ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, ApplicationCommandOptionType } = require('discord.js');
const Command = require("../structures/command.js");
const { colors } = require('../constants');
const { useQueue } = require('discord-player');
const { getTrackTitle } = require('../utils/player');
const { getLanguage } = require("../utils/language");

module.exports = new Command({
    name: "skip",
    aliases: ['skipto'],
    description: "Skippea a una canción que elijas.",
    options: [
        {
            description: 'Indice de la canción donde skippear.',
            name: 'indice',
            required: false,
            type: ApplicationCommandOptionType.Integer
        }
    ],
    async run(Bot, message, args, extra = {}) {
        const strings = getLanguage(message.guild.id);
        const { isFromButton = false, options } = extra;
        const [selected] = options ?? [];
        const optionsIndex = message?.options?.getInteger('indice')
            ? message.options.getInteger('indice') - 1
            : undefined;

        const reply = (content) => {
            isFromButton ? message.channel.send(content) : message.reply(content);
        };
        const queue = useQueue(message.guild);
        if (!queue || !queue.node.isPlaying()) {
            const embed = new EmbedBuilder().setDescription(strings.notPlaying);
            return reply({ embeds: [embed] });
        }

        if (queue.tracks.data.length === 0) {
            const embed = new EmbedBuilder().setDescription(strings.emptyQueue);
            return reply({ embeds: [embed] });
        }

        const skipTo =
            (queue.tracks.data.length === 1 ? 0 : undefined) ?? // auto skips when only one song is in queue
            selected ??
            optionsIndex;

        /* typeof so we can pass '0' as the condition */
        if (typeof skipTo !== 'undefined' && skipTo >= 0) {
            const index = skipTo > queue.tracks.data.length ? queue.tracks.data.length - 1 : skipTo;
            const track = queue.tracks.data[index];
            const embed = new EmbedBuilder();
            embed.setDescription(
                strings.skippedFor
                    .replace('{CURRENT_TRACK_TITLE}', queue.currentTrack.title)
                    .replace('{CURRENT_TRACK_URL}', queue.currentTrack.url)
                    .replace('{TRACK_TITLE}', track.title)
                    .replace('{TRACK_URL}', track.url)
            );
            embed.setColor(colors['skipped']);
            embed.setFooter({ text: `${strings.skippedBy} ${message.user.tag}`, iconURL: message.user.displayAvatarURL() });
            queue.node.jump(track);
            return reply({ embeds: [embed] });
        }

        /* 25 is the max number of options in discord selects */
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
                .setPlaceholder(
                    strings.skipList
                        .replace('{SONGS_QUANTITY}', tracks.length)
                )
                .setMaxValues(1)
                .addOptions(tracks)
        );

        return reply({
            components: [row]
        })

    }
});

