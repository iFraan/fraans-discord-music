const { EmbedNowPlaying } = require('../../lib/components');

module.exports = async (player, queue, track) => {
    try {
        if (queue.metadata?.nowPlayingMessage?.editable) {
            queue.metadata.nowPlayingMessage.delete().catch(() => { });
        }
        console.log(`[INFO] ${queue.guild.name} está reproduciendo ${track.title}`)
        const message = await queue.metadata.channel.send(EmbedNowPlaying({
            track,
            queue
        }));
        queue.setMetadata({
            ...queue.metadata,
            nowPlayingMessage: message
        })
    } catch (e) {
        queue.metadata.channel.send('Something went wrong while joining!', e.message);
        console.log(`(${queue.guild.name}) No tengo permisos para este canal de texto.`);
        return queue.delete();
    }
};