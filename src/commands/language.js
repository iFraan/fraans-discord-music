const { ActionRowBuilder, StringSelectMenuBuilder, } = require("discord.js");
const Command = require('../structures/command.js');
const GuildDB = require('../db/guilds.js');
const { getLanguage } = require("../utils/language.js");
const LANGUAGES = [
    { label: 'Español Argentino', value: 'es_ar' },
    { label: 'English', value: 'en' },
];

module.exports = new Command({
    name: "languages",
    description: "Cambiá el lenguaje del bot.",
    async run(Bot, message, args, extra = {}) {

        const { isFromButton = false, selectedLangs } = extra;
        const [selected] = selectedLangs ?? [];

        if (isFromButton && selected) {
            return GuildDB.set(message.guild.id, { language: selected });
        };

        const { language } = GuildDB.get(message.guild.id);
        const strings = getLanguage(message.guild.id)

        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("languages")
                .setPlaceholder(strings.placeholders.chooseLang)
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(LANGUAGES.map((lang) => {
                    return ({
                        label: lang.label,
                        value: lang.value.toLowerCase(),
                        default: lang.value === language
                    })
                }))
        );

        return !isFromButton && message.reply({
            components: [row]
        })
    },
});