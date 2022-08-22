import { NaokiClient as Client } from '../../../NaokiClient.js';
import Command from '../../../structures/Command.js';

export default class ChooseCommand extends Command {
    /** @param {Client} client */
    constructor(client) {
        super(client, {
            guildOnly: false,
            ownerOnly: false
        });
        this.client = client;

        this.name = 'choose';
        this.aliases = ['escolher', 'sortear'];
        this.description = 'choose command';
        this.usage = '!choose <word>, <word2>...';
    }
    async runCommand({ message, args }, t) {
        if (!args[0]) return;

        const palavras = args.join(' ').split(',');
        const palavraEscolhida = palavras[Math.floor(Math.random() * palavras.length)];

        message.reply(`Eu escolho: \`${palavraEscolhida.startsWith(' ') ? palavraEscolhida.slice(1) : palavraEscolhida}\`.`);
    }
}