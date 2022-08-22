import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ChannelType } from 'discord.js';
import { NaokiClient as Client } from '../../../NaokiClient.js';
import prettyMs from 'pretty-ms';
import { fetch } from 'undici';
import SlashCommand from '../../../structures/SlashCommand.js';
import Embed from '../../../client/utils/Embed.js';

export default class ACommand extends SlashCommand {
    /** @param {Client} client */
    constructor(client) {
        super(client, {
            guildOnly: false,
            ownerOnly: false
        });
        this.client = client;

        this.name = 'naoki';
        this.name_localizations = {
            'pt-BR': 'naoki'
        };
        this.description = 'A list of naoki-related commands';
        this.description_localizations = {
            'pt-BR': 'Uma lista de comandos relacionados ao naoki'
        };
        this.category = 'utils';
        this.options = [
            {
                name: 'info',
                name_localizations: {
                    'pt-BR': 'info'
                },
                description: 'Provides information about me',
                description_localizations: {
                    'pt-BR': 'Disponibiliza informações sobre mim'
                },
                type: ApplicationCommandOptionType.Subcommand,
            }
        ];
        this.help = {
            'pt-BR': [],
            'en-US': []
        };
    }
    async runCommand({ interaction }, t) {
        const parada1 = process.hrtime();
        await this.client.database.guilds.findOne({ guildId: interaction.guild.id });
        const parada2 = process.hrtime(parada1);

        switch (interaction.options.getSubcommand()) {
        case 'info': {
            const git = await fetch('https://api.github.com/repos/NaokiBot/Naoki/commits').then(body => body?.json());

            const infoMessage = await interaction.reply({ 
                embeds: [
                    new Embed(interaction.user)
                        .setAuthor({ name: this.client.user.tag, iconURL: this.client.user.displayAvatarURL(), url: 'https://dsc.gg/naokibot' })
                        .setThumbnail(this.client.user.displayAvatarURL({ extension: 'png', size: 1024 }))
                        .setDescription('Olá, me chamo **Naoki**, sou um robô do Discord feito para facilitar a moderação de seu servidor, deixar ele mais divertido e ativo.')
                        .setFields(
                            {
                                name: 'Informações básicas',
                                value: `> **Servidores**: ${this.client.guilds.cache.size.toLocaleString('en-us')}\n> **Usuários**: ${this.client.guilds.cache.map(gld => gld.memberCount).reduce((a, b) => a + b).toLocaleString('en-us')}\n> **Canais**: ${this.client.channels.cache.filter(chn => chn.type !== ChannelType.DM).size.toLocaleString('en-us')}\n> **Comandos**: ${this.client.commands.application.size}`,
                                inline: true
                            },
                            {
                                name: 'Informações legais',
                                value: `> **Ping da API**: ${this.client.ws.ping} ms\n> **Ping do Banco de Dados**: ${Math.round((parada2[0] * 1e9 + parada2[1]) / 1e6)} ms\n> **Tempo acordado**: ${prettyMs(this.client.uptime)}`,
                                inline: true
                            }
                        )
                ],
                components: [
                    new ActionRowBuilder().setComponents(
                        new ButtonBuilder()
                            .setLabel('Ficha técnica')
                            .setCustomId('ficha-tecnica')
                            .setStyle(2)
                    )
                ], fetchReply: true
            });
            infoMessage.createMessageComponentCollector({ filter: btn => btn.user.id === interaction.user.id, max: 1 }).on('collect', async interact => {
                interact.reply({
                    content: `:label: **-** Último commit: [${git[0].sha}](<${git[0].html_url}>)`,
                    ephemeral: true
                });
            });
        }
            break;
        }
    }
}