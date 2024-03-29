const Command = require("../structures/command.js");
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { useQueue } = require('discord-player');
const { lyricsExtractor } = require("@discord-player/extractor");
const lyricsFinder = lyricsExtractor();
const { getLanguage } = require("../utils/language");

module.exports = new Command({
    name: 'lyrics',
    description: 'Trae la letra de una canción, por defecto la que se está reproduciendo.',
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: 'busqueda',
            description: 'La canción a buscar',
            required: false,
        },
    ],
    async run(Bot, message, args, extra = {}) {
        message.deferReply && (await message.deferReply()); // if interaction

        const strings = getLanguage(message.guild.id);

        const reply = (content) => {
            return message.editReply(content);
        };

        const queue = useQueue(message.guild);
        const query = message?.options?.getString('busqueda', false) ?? queue?.currentTrack?.title;

        if (!query) return reply({ embeds: [new EmbedBuilder().setDescription(strings.lyrics.noArgs)] });

        const queryFormated = query
            .toLowerCase()
            .replace(/\(lyrics|lyric|official music video|official video hd|official video|audio|official|clip officiel|clip|extended|hq\)/g, '');

        const result = await lyricsFinder.search(queryFormated).catch(() => null);

        if (!result || !result.lyrics) {
            const embed = new EmbedBuilder().setDescription(strings.lyrics.notFound);
            return reply({ embeds: [embed] });
        }

        const lyrics = result.lyrics.length > 4096 ? `${result.lyrics.slice(0, 4090)}...` : result.lyrics;

        const embed = new EmbedBuilder()
            .setTitle(result.title)
            .setURL(result.url)
            .setThumbnail(result.thumbnail)
            .setAuthor({
                name: result.artist.name,
                iconURL: result.artist.image,
                url: result.artist.url,
            })
            .setDescription(lyrics);

        return reply({ embeds: [embed] });
    },
});