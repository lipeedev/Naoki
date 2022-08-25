import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ChannelType, version as DjsVersion, GatewayVersion } from 'discord.js';
import { NaokiClient as Client } from '../../../NaokiClient.js';
import pkg from '../../../../package.json' assert { type: 'json' };
import { fetch } from 'undici';
import { formatBytes } from '../../../functions/formatBytes.js';
import { formatArray } from '../../../functions/formatArray.js';
import os from 'node:os';
import prettyMs from 'pretty-ms';
import SlashCommand from '../../../structures/SlashCommand.js';
import Embed from '../../../client/utils/Embed.js';

export default class NaokiSubCommands extends SlashCommand {
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
                description: 'Provides information about Naoki',
                description_localizations: {
                    'pt-BR': 'Disponibiliza informações o Naoki'
                },
                type: ApplicationCommandOptionType.Subcommand,
            },
            {
                name: 'ping',
                name_localizations: {
                    'pt-BR': 'ping'
                },
                description: 'Command to see Naoki\'s latency.',
                description_localizations: {
                    'pt-BR': 'Comando para ver a latência do Naoki.'
                },
                type: ApplicationCommandOptionType.Subcommand,
            }
        ];
        this.help = {
            'pt-BR': [],
            'en-US': []
        };
    }
    async runCommand({ interaction }, t, language) {
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
                        .setDescription(t('commands:bot:info:description'))
                        .setFields(
                            {
                                name: t('commands:bot:info:fields:first:name'),
                                value: t('commands:bot:info:fields:first:value', {
                                    guild_count: Number(this.client.guilds.cache.size).toLocaleString('en-us'),
                                    user_count: Number(this.client.guilds.cache.map(gld => gld.memberCount).reduce((a, b) => a + b)).toLocaleString('en-us'),
                                    channel_count: Number(this.client.channels.cache.filter(chn => chn.type !== ChannelType.DM).size).toLocaleString('en-us'),
                                    command_count: Number(this.client.commands.application.size).toLocaleString('en-us')
                                }),
                                inline: true
                            },
                            {
                                name: t('commands:bot:info:fields:second:name'),
                                value: t('commands:bot:info:fields:second:value', {
                                    api_ping: Number(this.client.ws.ping).toLocaleString('en-us'),
                                    database_ping: Number(~~((parada2[0] * 1e9 + parada2[1]) / 1e6)).toLocaleString('en-us'),
                                    uptime: prettyMs(this.client.uptime),
                                    created_date: ~~(this.client.user.createdTimestamp / 1000)
                                }),
                                inline: true
                            }
                        )
                        .setFooter({ text: t('commands:bot:info:footer', {
                            creators_tag: formatArray(language, this.client.owners.map(id => this.client.users.cache.get(id).tag))
                        })
                    })
                ],
                components: [
                    new ActionRowBuilder().setComponents(
                        new ButtonBuilder()
                            .setLabel(t('commands:bot:info:button:label'))
                            .setCustomId('ficha-tecnica')
                            .setStyle(2)
                    )
                ], fetchReply: true
            });
            infoMessage.createMessageComponentCollector({ filter: btn => btn.user.id === interaction.user.id }).on('collect', async interact => {
                interact.reply({
                    content: t('commands:bot:info:button:reply', {
                        git_commit_sha: git[0].sha,
                        git_commit_html_url: git[0].html_url,
                        discordjs_version: DjsVersion,
                        nodejs_version: process.version,
                        gateway_version: GatewayVersion,
                        client_version: pkg.version,
                        total_ram: formatBytes(os.totalmem()),
                        available_ram: formatBytes(os.freemem()),
                        cpu_model: os.cpus()[0].model
                    }),
                    ephemeral: true
                });
            });
        }
            break;
        case 'ping': {
            const parada1 = process.hrtime();
            await this.client.database.guilds.findOne({ guildId: interaction.guildId });
            const parada2 = process.hrtime(parada1);

            interaction.reply(t('commands:ping', {
                clientPing: this.client.ws.ping,
                databasePing: Math.round((parada2[0] * 1e9 + parada2[1]) / 1e6),
                uptimeTimestamp: parseInt((Date.now() - this.client.uptime) / 1000)
            }));
        }
            break;
        }
    }
}