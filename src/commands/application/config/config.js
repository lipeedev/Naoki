import { ApplicationCommandOptionType } from 'discord.js';
import { NaokiClient as Client } from '../../../NaokiClient.js';
import Command from '../../../structures/SlashCommand.js';

export default class ConfigSubCommands extends Command {
    /** @param {Client} client */
    constructor(client) {
        super(client, {
            guildOnly: true,
            ownerOnly: false
        });
        this.client = client;

        this.name = 'config';
        this.name_localizations = {
            'pt-BR': 'configurar'
        };
        this.description = 'Command to configure other systems';
        this.description_localizations = {
            'pt-BR': 'Comando para configurar outros sistemas do bot'
        };
        this.options = [
            {
                name: 'language',
                name_localizations: {
                    'pt-BR': 'linguagem'
                },
                description: 'Setup the language that i will speak in this guild',
                description_localizations: {
                    'pt-BR': 'Define a linguagem em que falarei dentro do servidor'
                },
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'language',
                        name_localizations: {
                            'pt-BR': 'idioma'
                        },
                        description: 'The language that i will speak',
                        description_localizations: {
                            'pt-BR': 'A linguagem na qual eu irei falar'
                        },
                        type: ApplicationCommandOptionType.String,
                        choices: [ { name: 'Português do Brasil', value: 'pt-BR' }, { name: 'English of United States', value: 'en-US'} ],
                        required: true
                    }
                ]
            }
        ];
    }
    async runCommand({ interaction }, t) {
        switch (interaction.options.getSubcommand()) {
        case 'language': {
            if (!interaction.member.permissions.has('ManageGuild')) return interaction.reply({ content: t('permissions:manageguild'), ephemeral: true });
            const idioma = interaction.options.getString('language');
            const guild = await this.client.database.guilds.findOne({ guildId: interaction.guild.id });

            guild.lang = idioma;
            await guild.save();
            interaction.reply(idioma == 'pt-BR' ? '🌎 **-** Meu idioma nesse servidor foi alterado para **Português do Brasil**.' : '🌎 **-** My language on this guild has been changed to **US English**');
        }
            break;
        }
    }
}