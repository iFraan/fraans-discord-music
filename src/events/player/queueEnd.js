/* Cuando termina la queue borro el mensaje */
module.exports = async (player, queue, track) => {
    if (queue.npmessage && queue.npmessage.editable) {
        queue.npmessage.delete().catch(() => { });
    }
};