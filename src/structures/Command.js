module.exports = class Command {
    constructor(options) {
        this.name = options.name;
        this.aliases = options.aliases || [];
        this.description = options.description;
        this.permission = options.permission || "SendMessages";
        this.options = options.options || [];
        this.run = options.run;
    }
};