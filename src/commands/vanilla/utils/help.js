import VanillaCommand from '../../../structures/VanillaCommandStructure.js';
import { NaokiClient as Client } from '../../../NaokiClient.js';

export default class HelpCommand extends VanillaCommand {
    /**
     * @param {Client} client
     */
    constructor(client) {
        super(client, {
            name: 'help',
            name_localizations: {
                'pt-BR': 'ajuda'
            },
            description: 'A command to see all my commands and how it works.',
            description_localizations: {
                'pt-BR': 'Um comando para ver todos os meus comandos e como funciona.'
            },
            category: 'util',
            devOnly: true,
            guildOnly: false,
            displayInHelp: false
        });
    }

    async runCommand({ message, args }, t) {
        await message.reply('teste');
    }
}
