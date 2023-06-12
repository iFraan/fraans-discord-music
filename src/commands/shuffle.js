const Command = require("../structures/command.js");
const { colors } = require('../constants');
const { getTrackTitle } = require('../utils/player');
const { ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = new Command({
    name: "shuffle",
    aliases: ['sf'],
    description: "Mezcla la queue.",
    async run(Bot, message, args, extra = {}) {
        const queue = Bot.player.nodes.get(message.guild);
        if (!queue || !queue.playing) {
            const embed = new EmbedBuilder()
                .setDescription(`No estoy reproduciendo nada en este server.`);
            return message.reply({ embeds: [embed] });
        }

        const tracks = queue.tracks.slice(0, 10).map(track => {
            const title = getTrackTitle(m);
            return ({
                label: title,
                value: track.url,
                description: track.author,
            })
        })

        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("shuffle_select")
                .setPlaceholder('1')
                .setMaxValues(1)
                .addOptions(tracks)
        );

        return message.reply({
            embeds: [
                {
                    fields: [

                        {
                            name: 'name',
                            value: `value.`
                        },
                    ],
                    footer: { text: `Fraan's Music | Shuffle`, iconURL: 'https://cdn-icons-png.flaticon.com/512/183/183625.png' },
                    color: colors['light-blue']
                }
            ],
            ephemeral: true,
            components: [row]
        });
    }
});

