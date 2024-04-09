const { Classic } = require('musicard');
const { AttachmentBuilder } = require('discord.js');
const ButtonPlayingBar = require('./ButtonPlayingBar');
const { getTrackTitle } = require('../../utils/player');
const { getLanguage } = require('../../utils/language');

module.exports = EmbedNowPlaying = async ({ track, isPlaying = true, status, interaction = {}, queue }) => {
    const strings = getLanguage(queue?.guild?.id ?? '');
    const row = ButtonPlayingBar({ isPlaying, interaction, queue });
    const title = getTrackTitle(track);

    const card = await Classic({
        thumbnailImage: track.thumbnail,
        backgroundImage: track.thumbnail,
        imageDarkness: 75,
        name: title,
        nameColor: '#FFFFFF',
        author: track.author,
        authorColor: '#afafaf',
        progress: 10,
        progressColor: '#afafaf',
        progressBarColor: '#838383',
        startTime: `${strings.requestedBy} ${track.requestedBy.username}`,
        endTime: track.duration,
        timeColor: '#cfcfcf',
    });

    const attachment = new AttachmentBuilder(card, { name: `card.png` });

    return {
        components: [row],
        files: [attachment],
    };
};
