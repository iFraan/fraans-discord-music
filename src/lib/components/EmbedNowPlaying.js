const { musicCard } = require('musicard');
const { AttachmentBuilder } = require('discord.js');
const ButtonPlayingBar = require('./ButtonPlayingBar');
const { getTrackTitle } = require('../../utils/player');
const { getLanguage } = require('../../utils/language');

module.exports = EmbedNowPlaying = async ({ track, isPlaying = true, status, interaction = {}, queue }) => {
    const strings = getLanguage(queue?.guild?.id ?? '');
    const row = ButtonPlayingBar({ isPlaying, interaction, queue });
    const title = getTrackTitle(track);

    const card = new musicCard()
        .setName(title)
        .setAuthor(track.author)
        .setColor('auto')
        .setTheme('classic')
        .setBrightness(80)
        .setThumbnail(track.thumbnail)
        .setProgress(10)
        .setStartTime(`${strings.requestedBy} ${track.requestedBy.username}`)
        .setEndTime(track.duration);

    const buffer = await card.build();
    const attachment = new AttachmentBuilder(buffer, { name: `card.png` });

    return {
        components: [row],
        files: [attachment],
    };
};
