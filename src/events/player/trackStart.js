const { colors, components } = require('../../constants');
const { getTrackTitle } = require('../../utils/player');

module.exports = async (player, queue, track) => {
    try {
        if (queue.npmessage && queue.npmessage.editable) {
            queue.npmessage.delete().catch(() => { });
        }
        const row = components.ButtonPlayingBar()
        console.log(`[INFO] ${queue.guild.name} está reproduciendo ${track.title}`)
        const title = getTrackTitle(track);
        queue.metadata.channel.send({
            embeds: [
                {
                    author: {
                        name: `Reproduciendo ahora`
                    },
                    description: `**[${title}](${track.url})**\nPedido por ${track.requestedBy}`,
                    thumbnail: {
                        url: `${track.thumbnail}`
                    },
                    color: colors['now-playing'],
                }
            ],
            components: [row]
        }).then((msg) => {
            queue.npmessage = msg;
        })
    } catch (e) {
        console.log(`(${queue.guild.name}) No tengo permisos para este canal de texto.`);
        return queue.destroy();
    }
};