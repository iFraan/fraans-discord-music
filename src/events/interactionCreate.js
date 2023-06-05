const { EmbedNowPlaying } = require('../lib/components');
const { colors } = require('../constants');
const { EmbedBuilder, InteractionType, ComponentType } = require('discord.js');

module.exports = async (Bot, interaction) => {

    /* Si no está en la guild (wtf) */
    if (!interaction.inGuild()) return;
    /* Si no tengo permisos para hablar en el canal de texto */
    if (!interaction.guild.members.me.permissionsIn(interaction.channel).has(Bot.requiredTextPermissions)) return;

    /* ----- Slash commands ----- */
    if (interaction.type === InteractionType.ApplicationCommand && !interaction.user.bot && interaction.guild) {
        const command = Bot.commands.find(cmd => cmd.name.toLowerCase() == interaction.commandName);
        if (!command) return;
        /* Si el user no tiene permisos para ese comando */
        if (!interaction.member.permissionsIn(interaction.channel).has(command.permission))
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`No tenés permisos suficientes para ejecutar este comando.(\`${command.permission}\`)`)
                ]
            });
        const args = interaction.options._hoistedOptions.map(option => option.value);
        return command.run(Bot, interaction, args, { slash: true });
    }

    /* ----- Controles ----- */
    if (interaction.componentType === ComponentType.Button && interaction.customId.includes("buttoncontrol")) {
        const queue = Bot.player.nodes.get(interaction.guild);
        if (!queue || !queue.playing || !interaction.member.voice.channelId || (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId))
            return;
        const _isPaused = queue.connection.paused;
        const embed = new EmbedBuilder();
        switch (interaction.customId) {
            case "buttoncontrol_play":
                let status;
                if (!_isPaused) {
                    queue.node.pause();
                    status = "paused";
                } else {
                    queue.node.resume();;
                    status = "resumed";
                }
                queue.npmessage.edit(EmbedNowPlaying({
                    track: queue.currentTrack,
                    isPlaying: _isPaused,
                    status,
                    interaction
                }));
                await interaction.deferUpdate();
                break;
            case "buttoncontrol_disconnect":
                embed.setDescription(`Me salí del canal de voz.`);
                embed.setColor(colors['disconnected']);
                embed.setFooter({ text: `Me desconectó ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                interaction.channel.send({ embeds: [embed] });
                await interaction.deferUpdate();
                queue.delete(true);
                break;
            case "buttoncontrol_skip":
                embed.setDescription(`Salté **[${queue.currentTrack.title}](${queue.currentTrack.url})**`);
                embed.setColor(colors['skipped']);
                embed.setFooter({ text: `Skipeada por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                interaction.channel.send({ embeds: [embed] });
                await interaction.deferUpdate();
                queue.node.skip();
                break;
            case "buttoncontrol_queue":
                /* run queue command */
                const cmd = Bot.commands.find(x => x.name.toLowerCase() == 'queue');
                cmd.run(Bot, interaction, ["queue"], { slash: false, isFromButton: true });
                await interaction.deferUpdate();
                break;
        }
    }
};
