const Command = require("../structures/command.js");
const { useMasterPlayer } = require('discord-player');

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

        const query = args.join(" ");
        const channel = message.message.member.voice.channel;
        const player = useMasterPlayer();

        const searchResult = await player.search(query, { requestedBy: slash ? message.user : message.author });

        if (!searchResult.hasTracks()) {
            return embedReply('No encontré nada. \nProbablemente tenga restricciones de edad o esté bloqueado en este pais.');
        }

        console.log(searchResult)

        try {
            const { track } = await player.play(channel, searchResult, {
                nodeOptions: {
                    // nodeOptions are the options for guild node (aka your queue in simple word)
                    metadata: {
                        message,
                        requestedBy: slash ? message.user : message.author,
                        channel: message.channel
                    }, // we can access this metadata object using queue.metadata later on,
                    selfDeaf: true,
                    volume: 80,
                    leaveOnEmpty: true,
                    leaveOnEmptyCooldown: 300000,
                    leaveOnEnd: true,
                    leaveOnEndCooldown: 300000,
                }
            })

            return message.followUp(`**${track.title}** enqueued!`);
        } catch (e) {
            // let's return error if something failed
            console.log(e)
            return message.followUp(`Something went wrong: ${e}`);
        }

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
