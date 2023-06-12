const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const Command = require("../structures/command.js");
const { colors } = require('../constants');
const { useQueue } = require("discord-player");
const avlFilters = [
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
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "clear",
            description: "Limpia todos los filtros.",
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "show",
            description: "Muestra todos los filtros.",
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "toggle",
            description: "Activa o desactiva un filtro.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "name",
                    description: "El nombre del filtro.",
                    required: true,
                    choices: avlFilters.map((f) => ({
                        name: `${f}`,
                        value: `${f.toLowerCase()}`,
                    })),
                },
            ],
        },
    ],
    async run(Bot, message, args, extra = {}) {

        const queue = useQueue(message.guild);

        const subCommand = await message.options.getSubcommand(true);
        const filters = queue.filters.ffmpeg.getFiltersEnabled();

        switch (subCommand) {
            case "clear":
                if (!filters.length) {
                    return message.reply({ embeds: [new EmbedBuilder().setDescription(`No hay ningun filtro activado.`)] });
                }

                queue.filters.ffmpeg.setFilters(false);

                return message.reply({ embeds: [new EmbedBuilder().setDescription(`Se desactivaron los filtros activos.`)] });
                break;

            case "toggle":
                const filterName = message.options.getString("name", true);
                queue.filters.ffmpeg.toggle(filterName);

                return message.reply({ embeds: [new EmbedBuilder().setDescription(`Se toggleó el filtro ${filterName}.`)] });
                break;

            default:
                const enabledFilters = queue.filters.ffmpeg.getFiltersEnabled();
                const disabledFilters = queue.filters.ffmpeg.getFiltersDisabled();

                await message.reply({
                    embeds: [{
                        description: [
                            ...enabledFilters.map((f) => `✅ - ${f}`),
                            '',
                            ...disabledFilters.map((f) => `❌ - ${f}`)
                        ].join('\n'),
                        footer: { text: `Filters | Lista de todos los filtros.`, iconURL: 'https://cdn-icons-png.flaticon.com/512/183/183625.png' },
                        color: colors['light-blue']
                    }]
                });
                break;
        }
    },
});