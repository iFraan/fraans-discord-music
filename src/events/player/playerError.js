const { EmbedBuilder } = require('discord.js');

module.exports = async (player, queue, error) => {
    console.log(error)
    await queue.metadata.channel.send({
        embeds: [new EmbedBuilder().setDescription('Hubo un error: ' + error.message.split('\n')[0])]
    });
};