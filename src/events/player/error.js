/* any error playing something */
module.exports = async (player, queue, error) => {
    console.log(`(${queue.guild.name}) error: ${error.message}`);
};