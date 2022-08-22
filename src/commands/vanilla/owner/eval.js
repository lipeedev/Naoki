import { NaokiClient as Client } from '../../../NaokiClient.js';
import Command from '../../../structures/Command.js';

export default class EvaluateCommand extends Command {
    /** @param {Client} client */
    constructor(client) {
        super(client, {
            guildOnly: true,
            ownerOnly: true
        });
        this.client = client;

        this.name = 'eval';
        this.aliases = ['ev'];
        this.description = 'Eval command';
        this.usage = '!eval <code>';
    }
    async runCommand({ message, args }, t) {
        const code = args.join(' ');
        if (!code || ['token', 'destroy', 'exit', 'initialize', 'messageCreate', 'this.client.on('].includes(code.toLowerCase())) return;

        try {
            let evaluate = await eval(code);
            if (typeof evaluate !== 'string') evaluate = require('util').inspect(evaluate, { depth: 0, });
            const m = await message.channel.send(`\`\`\`js\n${(await evaluate)}\`\`\``);
            setTimeout(() => m.delete().catch(_ => { }), 20_000);
        }
        catch (err) {
            const m = await message.channel.send(`\`\`\`js\n${err.stack}\`\`\``);
            setTimeout(() => m.delete().catch(_ => { }), 20_000);
        }
    }
}