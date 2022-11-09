const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');


module.exports = ButtonPlayingBar = (isPlaying = true) => {
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('buttoncontrol_play')
                .setLabel(isPlaying ? 'Pausar' : 'Resumir')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('buttoncontrol_skip')
                .setLabel('Skip')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('buttoncontrol_disconnect')
                .setLabel('Desconectar')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('buttoncontrol_queue')
                .setLabel('Mostrar queue')
                .setStyle(ButtonStyle.Secondary)
        )
}