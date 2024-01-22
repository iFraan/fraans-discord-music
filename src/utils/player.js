const getTrackTitle = (track) => {
    return (['spotify-custom', 'soundcloud-custom'].includes(track?.source)
        ? `${track?.author} - ${track?.title}`
        : `${track?.title}`)
}

module.exports = {
    getTrackTitle,
}