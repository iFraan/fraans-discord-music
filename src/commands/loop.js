const { ActionRowBuilder, StringSelectMenuBuilder, } = require("discord.js");
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
        const [selected] = selectedRepeatMode ?? [QueueRepeatMode.QUEUE];
        const queue = useQueue(message.guild);

        if (isFromButton && selected) {
            queue.setRepeatMode(parseInt(selected))
            return GuildDB.set(message.guild.id, { repeatMode: selected.toString() });
        };

        const strings = getLanguage(message.guild.id);
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

        return !isFromButton && message.reply({
            components: [row]
        })
    },
});