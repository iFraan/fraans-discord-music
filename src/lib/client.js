const { TOKEN_DISCORD } = require('../keys');
const { Client, GatewayIntentBits } = require("discord.js");
const { Player } = require("discord-player");
const Constants = require("../constants");
const extractor = require("../utils/extractor.js");
const { DiscordAPI } = require("../utils");

class Bot extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.MessageContent
            ]
        });

        this.commands = [];
        this.config = {};
        this.player = new Player(this);
        this.requiredVoicePermissions = [
            "ViewChannel",
            "Connect",
            "Speak"
        ];
        this.requiredTextPermissions = [
            "ViewChannel",
            "SendMessages",
            "ReadMessageHistory",
            "AddReactions",
            "EmbedLinks"
        ];
        this.prefix = Constants.prefix;
    }

    async init() {
        /* load extractors */
        await this.player.extractors.loadDefault();
        /* load commands */
        await require('./handler/commands')(this);
        /* load events */
        await require('./handler/events')(this);
        /* publish commands to discord */
        await DiscordAPI.publishSlashCommands(this.commands)
        /* finally, login into discord */
        this.login(TOKEN_DISCORD);
    }
}

module.exports = Bot;
