import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle } from 'discord.js';
import ApplicationCommand from '../../../structures/ApplicationCommandStructure.js';
import Embed from '../../../client/utils/Embed.js';

export default class HelpCommand extends ApplicationCommand {
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
            options: [
                {
                    name: 'command',
                    name_localizations: {
                        'pt-BR': 'comando'
                    },
                    description: 'The command to see about',
                    description_localizations: {
                        'pt-BR': 'O comando que deseja ver sobre'
                    },
                    type: ApplicationCommandOptionType.String,
                    required: false
                }
            ],
            
            devOnly: true,
            guildOnly: false,
            displayInHelp: false
        });
    }

    async runCommand({ interaction, lang }, t) {
        interaction.reply('teste');
    }
}