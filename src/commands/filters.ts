import { Command } from '../structures/Command.js';
import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
import { getLanguage } from '../utils/language.js';
const FILTERS = [
    'Bassboost',
    'Chorus',
    'Compressor',
    'Dim',
    'Earrape',
    'Expander',
    'Fadein',
    'Flanger',
    'Gate',
    'Haas',
    'Karaoke',
    'Lofi',
    'Mcompand',
    'Mono',
    'Nightcore',
    'Normalizer',
    'Phaser',
    'Pulsator',
    'Reverse',
    'Softlimiter',
    'Subboost',
    'Surrounding',
    'Treble',
    'Vaporwave',
    'Vibrato',
];

export default new Command({
    name: 'filters',
    description: 'Activá o desactivá efectos de audio.',
    async run(Bot, message, args, options = {}) {
        /* @ts-ignore */
        const { isFromButton = false, selectedFilters = [] } = options;

        const queue = useQueue(message.guild);
        const strings = getLanguage(message.guild.id);

        queue.filters.ffmpeg.setFilters(selectedFilters);

        const filters = {
            enabled: queue.filters.ffmpeg.getFiltersEnabled(),
            disabled: queue.filters.ffmpeg.getFiltersDisabled(),
        };

        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('filters')
                .setPlaceholder(strings.placeholders.chooseFilter)
                .setMaxValues(5)
                .addOptions(
                    FILTERS.map((filter) => {
                        const isEnabled = !!filters.enabled.find((item) => item === filter.toLowerCase());
                        return {
                            label: filter,
                            value: filter.toLowerCase(),
                            default: isEnabled,
                        };
                    })
                )
        );

        return (
            !isFromButton &&
            message.reply({
                components: [row],
            })
        );
    },
});
