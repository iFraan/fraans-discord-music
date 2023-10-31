const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getLanguage } = require("../../utils/language");

module.exports = ButtonPlayingBar = ({ isPlaying = true, interaction = {}, queue = {} }) => {
    const strings = getLanguage(queue?.guild?.id ?? '');
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('buttoncontrol_play')
            .setLabel(isPlaying ? `⏵︎ ${strings.actions.pause}` : `⏵︎ ${strings.actions.resume}`)
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId('buttoncontrol_skip').setLabel(`${strings.actions.skip} ⏭`).setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('buttoncontrol_disconnect').setLabel(strings.actions.disconnect).setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId('buttoncontrol_queue').setLabel(`⊙ ${strings.actions.showQueue}`).setStyle(ButtonStyle.Secondary)
    );
};
