const {
    ActionRowBuilder,
    StringSelectMenuBuilder,
} = require("discord.js");
const Command = require("../structures/command.js");
const { useQueue } = require("discord-player");
const FILTERS = [
    "Bassboost",
    "Chorus",
    "Compressor",
    "Dim",
    "Earrape",
    "Expander",
    "Fadein",
    "Flanger",
    "Gate",
    "Haas",
    "Karaoke",
    "Lofi",
    "Mcompand",
    "Mono",
    "Nightcore",
    "Normalizer",
    "Phaser",
    "Pulsator",
    "Reverse",
    "Softlimiter",
    "Subboost",
    "Surrounding",
    "Treble",
    "Vaporwave",
    "Vibrato",
];

module.exports = new Command({
    name: "filters",
    description: "Activá o desactivá efectos de audio.",
    async run(Bot, message, args, extra = {}) {

        const { isFromButton = false, selectedFilters = [] } = extra;

        const queue = useQueue(message.guild);

        queue.filters.ffmpeg.setFilters(selectedFilters)

        const filters = {
            enabled: queue.filters.ffmpeg.getFiltersEnabled(),
            disabled: queue.filters.ffmpeg.getFiltersDisabled(),
        }

        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("filters")
                .setPlaceholder(`Activá o desactivá filtros.`)
                .setMaxValues(5)
                .addOptions(FILTERS.map((filter) => {
                    const isEnabled = !!filters.enabled.find((item) => item === filter.toLowerCase());
                    return ({
                        label: filter,
                        value: filter.toLowerCase(),
                        default: isEnabled
                    })
                }))
        );

        return !isFromButton && message.reply({
            components: [row]
        })
    },
});