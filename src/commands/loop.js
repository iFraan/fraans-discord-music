const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, } = require("discord.js");
const { QueueRepeatMode, useQueue } = require('discord-player');
const Command = require('../structures/command.js');
const GuildDB = require('../db/guilds.js');
const { getLanguage } = require("../utils/language");

const LOOPMODES = [
    { label: 'Repetir una', value: QueueRepeatMode.TRACK },
    { label: 'Repetir playlist', value: QueueRepeatMode.QUEUE },
    { label: 'Autoplay', value: QueueRepeatMode.AUTOPLAY },
    { label: 'Desactivar', value: QueueRepeatMode.OFF },
];

module.exports = new Command({
    name: "loop",
    description: "Cambia el modo de reproducción.",
    async run(Bot, message, args, extra = {}) {

        const { isFromButton = false, selectedRepeatMode } = extra;
        const queue = useQueue(message.guild);
        const strings = getLanguage(message.guild.id);

        const embedReply = (content) => {
            return isFromButton ? message.channel.send(content) : message.reply(content);
        };

        if (!queue || !queue.node.isPlaying()) {
            const embed = new EmbedBuilder().setDescription(strings.notPlaying);
            return embedReply({ embeds: [embed] });
        }

        const [selected] = selectedRepeatMode ?? [QueueRepeatMode.QUEUE];

        if (isFromButton && selected) {
            queue.setRepeatMode(parseInt(selected))
            return GuildDB.set(message.guild.id, { repeatMode: selected.toString() });
        };

        const { repeatMode } = GuildDB.get(message.guild.id);

        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("loop")
                .setPlaceholder(strings.placeholders.repeatMode)
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(LOOPMODES.map((loop) => {
                    return ({
                        label: loop.label,
                        value: loop.value.toString(),
                        default: loop.value.toString() === repeatMode
                    })
                }))
        );

        return !isFromButton && embedReply({
            components: [row]
        })
    },
});