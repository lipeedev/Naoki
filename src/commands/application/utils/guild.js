import { ApplicationCommandOptionType } from 'discord.js';
import { Features } from '../../../client/objects/GuildFeaturesObject.js';
import ApplicationCommand from '../../../structures/ApplicationCommandStructure.js';
import Embed from '../../../client/utils/Embed.js';

export default class GuildSubCommands extends ApplicationCommand {
    constructor(client) {
        super(client, {
            name: 'guild',
            name_localizations: {
                'pt-BR': 'servidor'
            },
            description: 'Guild commands',
            description_localizations: {
                'pt-BR': 'Comandos relacionados ao servidor'
            },
            category: 'util',
            options: [
                {
                    name: 'info',
                    name_localizations: {
                        'pt-BR': 'informacao'
                    },
                    description: 'See information about the guild',
                    description_localizations: {
                        'pt-BR': 'Veja informações sobre o servidor'
                    },
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'guild',
                            name_localizations: {
                                'pt-BR': 'servidor'
                            },
                            description: 'The ID of the Guild',
                            description_localizations: {
                                'pt-BR': 'O ID do Servidor'
                            },
                            type: ApplicationCommandOptionType.String,
                            required: false
                        }
                    ]
                }
            ],

            displayInHelp: true
        });
    }
    async runCommand({ interaction }, t) {
        const guildId = interaction.options.getString('guild') || interaction.guildId;

        switch (interaction.options.getSubcommand()) {
        case 'info': {

            let guild = this.client.guilds.cache.get(guildId);
            const guildPreview = await this.client.fetchGuildPreview(guildId);
            if (!guild && guildPreview) guild = guildPreview;
            if (!guild && !guildPreview) return interaction.reply({ content: 'Não consegui encontrar um servidor relacionado com esse ID...', ephemeral: true });

            if (!this.client.guilds.cache.has(guild?.id)) {

                const outGuildEmbed = new Embed(interaction.user)
                    .setAuthor({ name: 'Informações do Servidor' })
                    .setTitle(guild.name)
                    .setThumbnail(guild.iconURL({ extension: 'png', size: 512 }))
                    .setDescription(guild.description ?? 'Esse servidor não tem uma descrição... :confused:');

                interaction.reply({
                    embeds: [outGuildEmbed]
                });

                return;
            }

            const inGuildEmbed = new Embed(interaction.user)
                .setAuthor({ name: 'Informações do Servidor' })
                .setTitle(guild.name)
                .setThumbnail(guild.iconURL({ extension: 'png', size: 512 }))
                .setDescription(guild.description ?? 'Esse servidor não tem uma descrição... :confused:');

            interaction.reply({
                embeds: [inGuildEmbed]
            });
        }
            break;
        }
    }
}