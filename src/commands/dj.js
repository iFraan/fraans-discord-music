const { RoleSelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const Command = require('../structures/command.js');
const GuildDB = require('../db/guilds.js');
const { getLanguage } = require("../utils/language");

module.exports = new Command({
    name: "dj",
    description: "Establece el rol de DJ.",
    async run(Bot, message, args, extra = {}) {

        const { isFromButton = false, options } = extra;
        const strings = getLanguage(message.guild.id);

        const embedReply = (content) => {
            return isFromButton ? message.channel.send(content) : message.reply(content);
        };

        const [selected] = options ?? [];

        if (isFromButton && selected) {
            return GuildDB.set(message.guild.id, { djRole: selected.toString() });
        };

        const { djRole } = GuildDB.get(message.guild.id);

        const row = new ActionRowBuilder().addComponents(
            new RoleSelectMenuBuilder({
                default_values: djRole ? [{ id: djRole, type: 'role' }] : [],
            })
                .setMinValues(0)
                .setMaxValues(1)
                .setCustomId('dj')
                .setPlaceholder(strings.placeholders.roleSelect ?? '')
        )

        return !isFromButton && embedReply({
            components: [row]
        })
    },
});