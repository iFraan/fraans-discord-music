const { colors, components } = require('../../constants');

module.exports = async (player, queue, track) => {
    try {
        if (queue.npmessage && queue.npmessage.editable) {
            queue.npmessage.delete().catch(error => { });
        }
        const row = components.ButtonPlayingBar()
        console.log(`[INFO] ${queue.guild.name} está reproduciendo ${track.title}`)
        const title = ['spotify-custom', 'soundcloud-custom'].includes(track.source)
            ? `${track.author} - ${track.title}`
            : `${track.title}`;
        queue.metadata.channel.send({
            embeds: [
                {
                    title: `Reproduciendo ahora`,
                    description: `**[${title}](${track.url})** - ${track.requestedBy}`,
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