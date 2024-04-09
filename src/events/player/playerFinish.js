/* Cuando termina la canción borro el mensaje */
module.exports = async (player, queue, track) => {
    if (queue.metadata?.nowPlayingMessage?.editable) {
        queue.metadata.nowPlayingMessage.delete().catch(() => { });
    }
};