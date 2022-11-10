const { colors, components } = require('../constants');
const {
    EmbedBuilder,
    InteractionType,
    ComponentType
} = require('discord.js');

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
        const queue = Bot.player.getQueue(interaction.guild);
        if (!queue || !queue.playing || !interaction.member.voice.channelId || (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId))
            return;
        const _isPaused = queue.connection.paused;
        const embed = new EmbedBuilder();
        switch (interaction.customId) {
            case "buttoncontrol_play":
                const row = components.ButtonPlayingBar(_isPaused)
                let status;
                if (!_isPaused) {
                    queue.setPaused(true);
                    status = "paused";
                } else {
                    queue.setPaused(false);
                    status = "resumed";
                }
                const title = ['spotify-custom', 'soundcloud-custom'].includes(queue.current.source) ?
                    `${queue.current.author} - ${queue.current.title}` : `${queue.current.title}`;
                queue.npmessage.edit({
                    embeds: [
                        {
                            author: {
                                name: `Reproduciendo ahora`
                            },
                            description: `**[${title}](${queue.current.url})**\nPedido por ${queue.current.requestedBy}\n\n${status == 'paused' ? 'Pausado' : 'Resumido'} por ${interaction.user}`,
                            thumbnail: {
                                url: `${queue.current.thumbnail}`
                            },
                            color: _isPaused ? colors['now-playing'] : colors['paused'],
                        }
                    ],
                    components: [row]
                });
                await interaction.deferUpdate();
                break;
            case "buttoncontrol_disconnect":
                embed.setDescription(`Me desconecté.`);
                embed.setColor(colors['disconnected']);
                embed.setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                interaction.channel.send({ embeds: [embed] });
                await interaction.deferUpdate();
                queue.destroy(true);
                break;
            case "buttoncontrol_skip":
                embed.setDescription(`Salté **[${queue.current.title}](${queue.current.url})**`);
                embed.setColor(colors['skipped']);
                embed.setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
                interaction.channel.send({ embeds: [embed] });
                await interaction.deferUpdate();
                queue.skip();
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
