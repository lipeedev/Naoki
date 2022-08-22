import { ApplicationCommandOptionType } from 'discord.js';
import { NaokiClient as Client } from '../../../NaokiClient.js';
import { inspect } from 'util';
import Command from '../../../structures/SlashCommand.js';

export default class EvaluateCommand extends Command {
    /** @param {Client} client */
    constructor(client) {
        super(client, {
            guildOnly: true,
            ownerOnly: true
        });
        this.client = client;

        this.name = 'eval';
        this.description = 'Execute some code';
        this.options = [
            { name: 'code', type: ApplicationCommandOptionType.String, description: 'The code to execute', required: true }
        ];
    }
    async runCommand({ interaction }, t) {
        const code = interaction.options.getString('code');
        if (!code || ['token', 'destroy', 'emit'].includes(code.toLowerCase())) return;

        try {
            let evaluate = await eval(code);
            if (typeof evaluate !== 'string') evaluate = inspect(evaluate, { depth: 0, });
            interaction.reply({ content: `\`\`\`js\n${(await evaluate)}\`\`\``, ephemeral: true });
        } catch (err) { interaction.reply({ content: `\`\`\`js\n${err.stack}\`\`\``, ephemeral: true }); }
    }
}