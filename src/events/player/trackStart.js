const { EmbedNowPlaying } = require('../../lib/components');

module.exports = async (player, queue, track) => {
    try {
        if (queue.npmessage && queue.npmessage.editable) {
            queue.npmessage.delete().catch(() => { });
        }
        console.log(`[INFO] ${queue.guild.name} está reproduciendo ${track.title}`)
        queue.metadata.channel.send(EmbedNowPlaying({
            track
        })).then((msg) => {
            queue.npmessage = msg;
        })
    } catch (e) {
        console.log(`(${queue.guild.name}) No tengo permisos para este canal de texto.`);
        return queue.delete();
    }
};