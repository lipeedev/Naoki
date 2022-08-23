/* eslint-disable valid-typeof */
import { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { NaokiClient as Client } from '../../../NaokiClient.js';
import Command from '../../../structures/SlashCommand.js';
import Embed from '../../../client/utils/Embed.js';

export default class HelpCommand extends Command {
    /** @param {Client} client */
    constructor(client) {
        super(client, {
            guildOnly: false,
            ownerOnly: true
        });
        this.client = client;

        this.name = 'help';
        this.name_localizations = {
            'pt-BR': 'ajuda'
        };
        this.description = 'Help command';
        this.description_localizations = {
            'pt-BR': 'Comando de ajuda'
        };
        this.category = 'utils';
        this.options = [
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
        ];

        this.help = {
            'pt-BR': [
                { option: 'comando', description: 'O nome, ou sinônimo, do comando no qual deseja ver as informações.', required: 'Opcional' }
            ],
            'en-US': [
                { option: 'command', description: 'The name, or synonym, of the command on which you want to see information', required: 'Optional' }
            ]
        };
    }
    async runCommand({ interaction }, t, language) {
        const commandName = interaction.options.getString('command')?.toLowerCase();
        if (commandName && !this.client.commands.vanilla.some(cmd => cmd.name == commandName || commandName.includes(cmd.aliases)) && this.client.commands.application.get(commandName) && this.client.commands.application.find(cmd => cmd.name_localizations[language == 'pt-BR' ? 'pt-BR' : 'en-US'] == commandName)) return interaction.reply(t('commands:help:nocommand'));

        const comando = this.client.commands.vanilla.get(commandName) || this.client.commands.vanilla.find(cmd => cmd.aliases?.includes(commandName)) || this.client.commands.application.get(commandName) || this.client.commands.application.find(cmd => cmd.name_localizations[language == 'pt-BR' ? 'pt-BR' : 'en-US'] === commandName);
        if (comando && commandName) {
            const dataComando = await this.client.database.commands.findOne({ cmdName: comando.name });

            const commandEmbed = new Embed(interaction.user)
                .setTitle(comando.name ?? 'Nome não encontrado')
                .setDescription(comando.description ?? 'Sem descrição')
                .setFields(
                    {
                        name: 'Usos',
                        value: `${dataComando?.usos || 0} vezes`
                    },
                    {
                        name: 'Manutenção?',
                        value: dataComando?.manutencao ? 'Sim' : 'Não'
                    }
                );
          
            interaction.reply({ embeds: [commandEmbed], components: typeof comando.help[language] === 'undefined' ? [] : [new ActionRowBuilder().setComponents(new ButtonBuilder().setCustomId('ver-opcoes').setLabel('Ver opções do comando').setStyle(ButtonStyle.Secondary))] });

            return;
        }

        interaction.reply(';');
    }
}