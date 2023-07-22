const Command = require("../structures/command.js");
const { colors } = require('../constants');
const { useQueue } = require("discord-player");
const { EmbedBuilder } = require('discord.js');

module.exports = new Command({
    name: "shuffle",
    aliases: ['sf'],
    description: "Mezcla la queue.",
    async run(Bot, message, args, extra = {}) {
        const { isFromButton = false } = extra;
        const reply = (content) => {
            isFromButton ? message.channel.send(content) : message.reply(content);
        };
        const queue = useQueue(message.guild);
        if (!queue || !queue.node.isPlaying()) {
            const embed = new EmbedBuilder().setDescription(`No estoy reproduciendo nada en este server.`);
            return reply({ embeds: [embed] });
        }

        if (queue.tracks.data.length === 0) {
            const embed = new EmbedBuilder().setDescription(`No hay canciones en cola.`);
            return reply({ embeds: [embed] });
        }

        queue.tracks.shuffle();

        return reply({
            embeds: [
                {
                    footer: { text: `Shuffle | Mezclé las canciones de la cola.`, iconURL: 'https://cdn-icons-png.flaticon.com/512/183/183625.png' },
                    color: colors['light-blue'],
                },
            ],
        });
    }
});

