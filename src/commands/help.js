const { colors } = require("../constants");
const { EmbedPages } = require('../lib/components');
const Command = require("../structures/command.js");
const { EmbedBuilder } = require('discord.js');
const { getLanguage } = require("../utils/language");

module.exports = new Command({
    name: "help",
    description: "Muestra todos los comandos",
    async run(Bot, message, args, extra = {}) {
        const strings = getLanguage(message.guild.id)
        const { slash } = extra;
        const pages = [];
        let page = 1, emptypage = false;
        do {
            const pageStart = 6 * (page - 1);
            const pageEnd = pageStart + 6;
            const commands = Bot.commands.slice(pageStart, pageEnd).map(cmd => (
                `**/${cmd.name} **`
                + (cmd.options.length
                    ? cmd.options.map(option => `<${option.name}>`).join(' ')
                    : '')
                + `\n${cmd.description}\n`));
            if (commands.length) {
                const embed = new EmbedBuilder();
                embed.setFooter({ text: `Fraan's Music | ${strings.generics.help}`, iconURL: 'https://cdn-icons-png.flaticon.com/512/183/183625.png' });
                embed.setDescription(`${commands.join('\n')}`);
                embed.setColor(colors['light-blue']);
                pages.push(embed);
                page++;
            }
            else {
                emptypage = true;
                if (page === 2) {
                    return message.reply({ embeds: [pages[0]] });
                }
            }
        } while (!emptypage);

        EmbedPages(message, pages, { timeout: 40000 });
    }
});
