const ButtonPlayingBar = require('./ButtonPlayingBar');
const { getTrackTitle } = require('../../utils/player');
const { avatarUrlFrom } = require('../../utils/discordapi');
const { colors } = require('../../constants');

module.exports = EmbedNowPlaying = ({ track, isPlaying = true, status, interaction = {} }) => {
    const row = ButtonPlayingBar(isPlaying);
    const title = getTrackTitle(track);
    const description = [
        `**[${title}](${track.url})** (${track.duration})`
    ];
    status && description.push(`${status == 'paused' ? 'Pausado' : 'Resumido'} por ${interaction?.user}`);
    return ({
        embeds: [
            {
                author: {
                    name: `Reproduciendo ahora`,
                    iconUrl: 'https://cdn-icons-png.flaticon.com/512/183/183625.png'

                },
                description: description.join('\n'),
                footer: {
                    text: `Pedido por ${track.requestedBy.username}#${track.requestedBy.discriminator}`,
                    iconURL: avatarUrlFrom({
                        id: track.requestedBy.id,
                        avatar: track.requestedBy.avatar,
                    })
                },
                thumbnail: {
                    url: `${track.thumbnail}`
                },
                color: isPlaying ? colors['now-playing'] : colors['paused'],
            }
        ],
        components: [row]
    })
}