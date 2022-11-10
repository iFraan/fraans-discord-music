const Command = require("../structures/command.js");
const { EmbedBuilder } = require('discord.js');

module.exports = new Command({
    name: "ping",
    description: "Muestra el ping del Bot",
    async run(Bot, message, args, extra) {
        const embed = new EmbedBuilder()
            .setDescription(`**${Bot.ws.ping}** ms`)
            .setColor('#38af3f');
        await message.reply({ embeds: [embed] });
    }
});