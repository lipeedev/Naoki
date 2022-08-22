export default class Command {
    constructor(client, CommandOptions = {
        ownerOnly: false
    }) {
        this.client = client;

        this.name = '';
        this.aliases = [];
        this.description = '';
        this.usage = '';
        this.category = '';

        this.help = {};
        this.opts = CommandOptions;
    }
}