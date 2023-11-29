export class Command {
    name: string;
    aliases?: string[];
    description?: string;
    permission?: string;
    options?: any;
    run: any;

    constructor(options: Command) {
        this.name = options.name;
        this.aliases = options.aliases ?? [];
        this.description = options.description;
        this.permission = options.permission ?? 'SendMessages';
        this.options = options.options ?? [];
        this.run = options.run;
    }
}
