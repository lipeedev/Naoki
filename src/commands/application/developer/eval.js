import { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { inspect } from 'util';
import{ApplicationCommand, Embed} from '../../../imports.js';

export default class EvaluateCommand extends ApplicationCommand {
    constructor(client) {
        super(client, {
            name: 'dev',
            name_localizations: {
                'pt-BR': 'desenvolvedor'
            },
            description: 'Commands used only by developers',
            description_localizations: {
                'pt-BR': 'Comandos utilizados somente pelos desenvolvedores'
            },
            options: [
                {
                    name: 'eval',
                    description: 'Command to run some code.',
                    description_localizations: {
                        'pt-BR': 'Comando para executar algum código.'
                    },
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'code',
                            name_localizations: {
                                'pt-BR': 'código'
                            },
                            description: 'The code to run.',
                            description_localizations: {
                                'pt-BR': 'O código para executar.'
                            },
                            type: ApplicationCommandOptionType.String,
                            required: true
                        }
                    ]
                },
                {
                    name: 'maintenance',
                    name_localizations: {
                        'pt-BR': 'manutenção'
                    },
                    description: 'Commands about removing or putting a command into maintenance.',
                    description_localizations: {
                        'pt-BR': 'Comandos sobre remover ou colocar um comando em manutenção.'
                    },
                    type: ApplicationCommandOptionType.SubcommandGroup,
                    options: [
                        {
                            name: 'add',
                            name_localizations: {
                                'pt-BR': 'adicionar'
                            },
                            description: 'Put a command on maintenance',
                            description_localizations: {
                                'pt-BR': 'Coloca um comando em manutenção'
                            },
                            type: ApplicationCommandOptionType.Subcommand,
                            options: [
                                {
                                    name: 'command',
                                    name_localizations: {
                                        'pt-BR': 'comando'
                                    },
                                    description: 'The command to add on maintenance',
                                    description_localizations: {
                                        'pt-BR': 'O comando para adicionar na manutenção'
                                    },
                                    type: ApplicationCommandOptionType.String,
                                    required: true
                                }
                            ]
                        },
                        {
                            name: 'remove',
                            name_localizations: {
                                'pt-BR': 'remover'
                            },
                            description: 'Remove a command from maintenance',
                            description_localizations: {
                                'pt-BR': 'Remove um comando da manutenção'
                            },
                            type: ApplicationCommandOptionType.Subcommand,
                            options: [
                                {
                                    name: 'command',
                                    name_localizations: {
                                        'pt-BR': 'comando'
                                    },
                                    description: 'The command to remove from maintenance',
                                    description_localizations: {
                                        'pt-BR': 'O comando para remover da manutenção'
                                    },
                                    type: ApplicationCommandOptionType.String,
                                    required: true
                                }
                            ]
                        }
                    ]
                }
            ],
            
            displayInHelp: false,
            guildOnly: true,
            devOnly: true
        });
    }
    async runCommand({ interaction }, t) {
        switch (interaction.options.getSubcommand()) {
        case 'eval': {
            const code = interaction.options.getString('code').replaceAll('token', '');

            try {
                let result = await eval(code);
                if (typeof result !== 'string') result = inspect(result, { depth: 0 });
                interaction.reply({
                    content: `\`\`\`js\n${(await result)}\`\`\``,
                    ephemeral: true
                });
            } catch (err) {
                interaction.reply({
                    content: `\`\`\`js\n${err.stack}\`\`\``,
                    ephemeral: true
                });
            }
        }
            break;
        case 'add': {
            interaction.reply({ content: '.', ephemeral: true });
        }
            break;
        case 'remove': {
            interaction.reply({ content: '.', ephemeral: true });
        }
            break;
        }
    }
}
