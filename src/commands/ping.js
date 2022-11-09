const Command = require("../structures/command.js");
const { EmbedBuilder } = require('discord.js');

module.exports = new Command({
    name: "ping",
    description: "Muestra el ping del Bot",
    async run(Bot, message, args) {
        const embed = new EmbedBuilder()
            .setDescription(` :green_circle: API: **${Bot.ws.ping} ms**`)
            .setColor('#a83f3f');
        await message.reply({ embeds: [embed] });
    }
});