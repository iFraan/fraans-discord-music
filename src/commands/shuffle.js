const Command = require("../structures/command.js");
const { getLanguage } = require("../utils/language");
const { colors } = require('../constants');
const { useQueue } = require("discord-player");
const { EmbedBuilder } = require('discord.js');

module.exports = new Command({
    name: "shuffle",
    aliases: ['sf'],
    description: "Mezcla la queue.",
    async run(Bot, message, args, extra = {}) {
        const strings = getLanguage(message.guild.id);
        const { isFromButton = false } = extra;
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

        queue.tracks.shuffle();

        return reply({
            embeds: [
                {
                    footer: { text: `Shuffle | ${strings.shuffleQueue}.`, iconURL: 'https://cdn-icons-png.flaticon.com/512/183/183625.png' },
                    color: colors['light-blue'],
                },
            ],
        });
    }
});

