const {
    EmbedBuilder,
    InteractionType,
} = require('discord.js');

module.exports = async (Bot, interaction) => {

    /* Si no está en la guild (wtf) */
    if (!interaction.inGuild()) return;
    /* Si no tengo permisos para hablar en el canal de texto */
    if (!interaction.guild.members.me.permissionsIn(interaction.channel).has(Bot.requiredTextPermissions)) return;

    /* Slash commands */
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
        return command.run(Bot, interaction, args, true);
    }
};
