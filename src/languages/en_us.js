module.exports = {
    player: {
        notInVc: "You aren't in a VC",
        notSameVc: "We aren't in the same VC",
        notEnoughPermissions: "I do not have enough permissions to join this VC.",
        noTracks: "I didn't find anything. \n Probably this song has age restrictions or is blocked in this country.",
    },
    commands: {
        notEnoughPermissions: "You dont have enough permissions to use this command. (\`{PERMISSION}\`)",
    },
    addedToQueuePlaylist: "I queue'd up **{SONGS_QUANTITY}** songs from [{PLAYLIST_TITLE}]({PLAYLIST_URL}) ({PLAYLIST_SOURCE})",
    addedToQueueSong: "I queue'd up **[{TRACK_TITLE}]({TRACK_URL})** ({TRACK_SOURCE})",
    emptyQueue: 'The queue is empty.',
    shuffleQueue: 'I shuffled the queue.',
    notPlaying: "I'm not playing anything on this server.",
    requestedBy: 'Requested by',
    skipped: 'Skipped **[{TRACK_TITLE}](${TRACK_URL})**',
    skippedFor: 'Skipped **[{CURRENT_TRACK_TITLE}](${CURRENT_TRACK_URL})** for **[{TRACK_TITLE}]({TRACK_URL})**',
    skippedBy: 'Skipped by',
    skipList: 'Showing first {SONGS_QUANTITY} songs only',
    disconnectedFromVc: 'Disconnected from the VC',
    disconnectedBy: 'Was disconnected by {USER}',
    playingNow: 'Playing now',
    lyrics: {
        noArgs: 'You have to specify the song to search for.',
        notFound: "Didn't find anything. Are you sure you're writing it right?"
    },
    placeholders: {
        chooseLang: 'Choose a language.',
        chooseFilter: 'Enable or disable audio filters.'
    },
    actions: {
        pause: 'Pause',
        resume: 'Resume',
        skip: 'Skip',
        disconnect: 'Disconnect',
        showQueue: 'Show Queue',
    },
    generics: {
        playing: 'Playing',
        help: 'Help',
        views: 'Vies',
        page: 'Page',
        now: 'now',
        of: 'of'
    }
}