const Command = require("../structures/command.js");

module.exports = new Command({
    name: "play",
    description: "Reproduce la canción o playlist especificada.",
    options: [
        { description: 'nombre de la canción/URL', name: 'busqueda', required: true, type: 3 }
    ],
    async run(Bot, message, args, extra = {}) {

        const { slash } = extra;
        const embedReply = (description) => {
            const embed = { embeds: [{ description }], ephemeral: true, failIfNotExists: false }
            return slash ? message.editReply(embed) : message.reply(embed);
        }

        if (slash) await message.deferReply();
        if (!message.member.voice.channelId)
            return embedReply('No estás en un VC.');
        if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId)
            return embedReply('No estás en el mismo VC que yo.');

        if (!args[0]) return;

        /* Si el bot no tiene permisos para entrar al vc */
        if (!message.guild.members.me.permissionsIn(message.member.voice.channel).has(Bot.requiredVoicePermissions))
            return embedReply('El bot no tiene permisos para entrar al canal de voz.');

        let query = args.join(" ");
        const searchResult = await Bot.player.search(query, { requestedBy: slash ? message.user : message.author, searchEngine: "custom" });
        if (!searchResult || !searchResult.tracks.length)
            return embedReply('No encontré nada. \nProbablemente tenga restricciones de edad o esté bloqueado en este pais.');

        const queue = await Bot.player.createQueue(message.guild, {
            metadata: { channel: message.channel },
            bufferingTimeout: 1000,
            disableVolume: false, // disabling volume controls can improve performance
            leaveOnEnd: true,
            leaveOnStop: true,
            spotifyBridge: false
        });
        let justConnected;
        try {
            if (!queue.connection) {
                justConnected = true;
                await queue.connect(message.member.voice.channel);
            }
        } catch {
            Bot.player.deleteQueue(message.guild);
            return embedReply('No pude joinear tu canal de voz.');
        }

        searchResult.playlist
            ? queue.addTracks(searchResult.tracks)
            : queue.addTrack(searchResult.tracks[0]);

        searchResult.playlist
            ? embedReply(`Puse en cola **${searchResult.tracks.length}** canciones de [${searchResult.tracks[0].playlist.title}](${searchResult.tracks[0].playlist.url})`)
            : embedReply(`Puse en cola **[${searchResult.tracks[0].title}](${searchResult.tracks[0].url})**`);

        justConnected && queue.play();
    }
});
