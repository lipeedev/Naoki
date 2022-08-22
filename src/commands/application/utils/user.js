import { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { NaokiClient as Client } from '../../../NaokiClient.js';
import { fetch } from 'undici';
import Command from '../../../structures/SlashCommand.js';
import Embed from '../../../client/utils/Embed.js';

export default class UserSubCommands extends Command {
    /** @param {Client} client */
    constructor(client) {
        super(client, {
            guildOnly: false,
            ownerOnly: false
        });
        this.client = client;

        this.name = 'user';
        this.name_localizations = {
            'pt-BR': 'usuario'
        };
        this.description = 'User commands';
        this.description_localizations = {
            'pt-BR': 'Veja informações sobre um usuário do Discord'
        };
        this.category = 'utils';
        this.options = [
            {
                name: 'info',
                name_localizations: {
                    'pt-BR': 'info'
                },
                description: 'See information about a user',
                description_localizations: {
                    'pt-BR': 'Veja informações sobre um usuário do Discord'
                },
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'user',
                        name_localizations: {
                            'pt-BR': 'pessoa'
                        },
                        description: 'Select a user to see informations',
                        description_localizations: {
                            'pt-BR': 'Selecione uma pessoa para ver as informações'
                        },
                        type: ApplicationCommandOptionType.User,
                        required: false
                    }
                ]
            },
            {
                name: 'avatar',
                name_localizations: {
                    'pt-BR': 'foto'
                },
                description: 'See the avatar of someone',
                description_localizations: {
                    'pt-BR': 'Veja a foto de perfil de alguém'
                },
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'user',
                        name_localizations: {
                            'pt-BR': 'pessoa'
                        },
                        description: 'Select a user to see avatar',
                        description_localizations: {
                            'pt-BR': 'Selecione uma pessoa para ver a foto de perfil'
                        },
                        type: ApplicationCommandOptionType.User,
                        required: false
                    }
                ]
            }
        ];
    }
    async runCommand({ interaction }, t) {
        const user = interaction.options.getUser('user') || interaction.user;
        switch (interaction.options.getSubcommand()) {
        case 'info': {
            if (user.bot) {
                const applicationData = fetch(`https://discord.com/api/v10/applications/${user.id}/rpc`).then(body => body?.json()).catch(_ => { });
                const GatewayIntents = {
                    GATEWAY_PRESENCE: 1 << 12,
                    GATEWAY_PRESENCE: 1 << 13,
                    GATEWAY_GUILD_MEMBERS: 1 << 14,
                    GATEWAY_GUILD_MEMBERS: 1 << 15,
                    GATEWAY_MESSAGE_CONTENT: 1 << 18,
                    GATEWAY_MESSAGE_CONTENT: 1 << 19
                };
                const TranslateIntents = {
                    GATEWAY_PRESENCE: t('commands:user:info:bot:intents:gateway_presence'),
                    GATEWAY_GUILD_MEMBERS: t('commands:user:info:bot:intents:gateway_guild_member'),
                    GATEWAY_MESSAGE_CONTENT: t('commands:user:info:bot:intents:gateway_message_content')
                };

                const IntentsArray = Object.entries(GatewayIntents).map(([key, value]) => applicationData?.flags & value ? `**${TranslateIntents[key]}**: ${t('undefineds:questions:yes')}` : `**${TranslateIntents[key]}**: ${t('undefineds:questions:no')}`);
                applicationData.bot_public ? IntentsArray.push(`**${t('commands:user:info:bot:intents:public')}**: ${t('undefineds:questions:yes')}`) : IntentsArray.push(`**${t('commands:user:info:bot:intents:public')}**: ${t('undefineds:questions:no')}`);
                applicationData.bot_require_code_grant ? IntentsArray.push(`**${t('commands:user:info:bot:intents:code_grant')}**: ${t('undefineds:questions:yes')}`) : IntentsArray.push(`**${t('commands:user:info:bot:intents:code_grant')}**: ${t('undefineds:questions:no')}`);

                let component = [];

                if (applicationData.custom_install_url || applicationData.privacy_policy_url || applicationData.terms_of_service_url) {
                    component = [new ActionRowBuilder()];
                    if (applicationData.custom_install_url) component[0].addComponents(
                        new ButtonBuilder().setStyle(5).setLabel(t('commands:user:info:bot:button:custom_url')).setURL(applicationData.custom_install_url)
                    );
                    if (applicationData.privacy_policy_url) component[0].addComponents(
                        new ButtonBuilder().setStyle(5).setLabel(t('commands:user:info:bot:button:privacy_policy')).setURL(applicationData.privacy_policy_url)
                    );
                    if (applicationData.terms_of_service_url) component[0].addComponents(
                        new ButtonBuilder().setStyle(5).setLabel(t('commands:user:info:bot:button:terms_service')).setURL(applicationData.terms_of_service_url)
                    );
                }

                const UserApplicationEmbed = new Embed(interaction.user)
                    .setAuthor({ name: t('commands:user:info:title') })
                    .setThumbnail(user.displayAvatarURL({ extension: 'png', size: 256 }))
                    .setFields(
                        { name: t('commands:user:info:fields:tag'), value: user.tag, inline: true },
                        { name: t('commands:user:info:fields:id'), value: user.id, inline: true },
                        { name: t('commands:user:info:fields:created'), value: `<t:${~~(user.createdTimestamp / 1000)}:f> <t:${~~(user.createdTimestamp / 1000)}:R>` }
                    );

                const ApplicationEmbed = new Embed(user)
                    .setAuthor({ name: t('commands:user:info:bot:title') })
                    .setDescription(applicationData.description || t('undefineds:descriptions'))
                    .setFields(
                        { name: t('commands:user:info:bot:fields:key'), value: `\`${applicationData.verify_key}\`` },
                        { name: t('commands:user:info:bot:fields:intents'), value: IntentsArray.join('\n'), inline: true },
                        { name: t('commands:user:info:bot:fields:tags'), value: applicationData?.tags ? applicationData.tags.join('\n') : t('undefineds:bot:tags'), inline: true }
                    );

                if (interaction.guild.members.cache.has(user.id)) UserApplicationEmbed.addFields(
                    { name: t('commands:user:info:fields:joined'), value: `<t:${~~(interaction.guild.members.cache.get(user.id).joinedTimestamp / 1000)}:f> <t:${~~(interaction.guild.members.cache.get(user.id).joinedTimestamp / 1000)}:R>` }
                );
                if (applicationData.icon) ApplicationEmbed.setThumbnail(this.client.rest.cdn.appIcon(user.id, applicationData.icon, { extension: 'png', size: 256 }));

                const m = await interaction.reply({
                    embeds: [UserApplicationEmbed],
                    components: [
                        new ActionRowBuilder().setComponents(
                            new ButtonBuilder().setCustomId('ver-info-bots').setLabel(t('commands:user:info:bot:button:see')).setStyle(1)
                        )
                    ], fetchReply: true
                });
                const coletor = m.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60_000 * 2 });
                coletor.on('collect', async collected => {
                    collected.reply({
                        embeds: [ApplicationEmbed],
                        components: component,
                        ephemeral: true
                    });
                });
            } else {
                const m = await interaction.reply({
                    embeds: !interaction.guild.members.cache.has(user.id) ? [
                        new Embed(interaction.user)
                            .setAuthor({ name: t('commands:user:info:title') })
                            .setThumbnail(user.displayAvatarURL({ extension: 'png', size: 256 }))
                            .setFields(
                                { name: t('commands:user:info:fields:tag'), value: user.tag, inline: true },
                                { name: t('commands:user:info:fields:id'), value: user.id, inline: true },
                                { name: t('commands:user:info:fields:created'), value: `<t:${~~(user.createdTimestamp / 1000)}:f> (<t:${~~(user.createdTimestamp / 1000)}:R>)` }
                            )
                    ] : [
                        new Embed(user)
                            .setAuthor({ name: t('commands:user:info:title') })
                            .setThumbnail(user.displayAvatarURL({ extension: 'png' }))
                            .setFields(
                                { name: t('commands:user:info:fields:tag'), value: user.tag, inline: true },
                                { name: t('commands:user:info:fields:id'), value: user.id, inline: true },
                                { name: t('commands:user:info:fields:created'), value: `<t:${~~(user.createdTimestamp / 1000)}:f> <t:${~~(user.createdTimestamp / 1000)}:R>` },
                                { name: t('commands:user:info:fields:joined'), value: `<t:${~~(interaction.guild.members.cache.get(user.id).joinedTimestamp / 1000)}:f> <t:${~~(interaction.guild.members.cache.get(user.id).joinedTimestamp / 1000)}:R>` }
                            )
                    ],
                    components: (interaction.guild.members.cache.has(user.id) && interaction.guild.members.cache.get(user.id).avatarURL()) ? [
                        new ActionRowBuilder().setComponents(
                            new ButtonBuilder().setCustomId('ver-avatar').setLabel(t('commands:user:info:button:avatar:see')).setStyle(ButtonStyle.Primary)
                        )
                    ] : [
                        new ActionRowBuilder().setComponents(
                            new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(t('commands:user:info:button:avatar:browser')).setURL(user.displayAvatarURL({ extension: 'png', size: 256 }))
                        )
                    ], fetchReply: true
                });

                const coletor = m.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60_000 * 2, filter: c => c.user.id === interaction.user.id });
                coletor.on('collect', async collected => {
                    collected.reply({
                        ephemeral: true,
                        embeds: [
                            new Embed(user).setTitle(t('commands:user:info:button:avatar:title:global', { user: user.tag }))
                                .setImage(user.displayAvatarURL({ extension: 'png', size: 256 }))
                        ],
                        components: interaction.guild.members.cache.get(user.id).avatarURL() ? [
                            new ActionRowBuilder().setComponents(
                                new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(t('commands:user:info:button:avatar:browser')).setURL(user.displayAvatarURL({ extension: 'png', size: 256 })),
                                new ButtonBuilder().setCustomId('ver-avatar-servidor').setStyle(ButtonStyle.Primary).setLabel(t('commands:user:info:button:avatar:local'))
                            )
                        ] : [
                            new ActionRowBuilder().setComponents(
                                new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(t('commands:user:info:button:avatar:browser')).setURL(user.displayAvatarURL({ extension: 'png', size: 256 }))
                            )
                        ], fetchReply: true
                    }).then(msg => {
                        msg.createMessageComponentCollector({ componentType: ComponentType.Button })
                            .on('collect', async collected => {
                                if (collected.customId === 'ver-avatar-servidor') {
                                    if (!interaction.guild.members.cache.get(user.id).avatarURL()) return collected.reply({ content: t('commands:user:info:button:avatar:noAvatar'), ephemeral: true });

                                    collected.update({
                                        embeds: [
                                            new Embed(user).setTitle(t('commands:user:info:button:avatar:title:local', { user: user.tag }))
                                                .setImage(interaction.guild.members.cache.get(user.id).avatarURL({ extension: 'png', size: 256 }))
                                        ],
                                        components: [
                                            new ActionRowBuilder().setComponents(
                                                new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(t('commands:user:info:button:avatar:browser')).setURL(interaction.guild.members.cache.get(user.id).avatarURL({ extension: 'png', size: 256 })),
                                                new ButtonBuilder().setCustomId('ver-avatar-global').setStyle(ButtonStyle.Primary).setLabel(t('commands:user:info:button:avatar:global'))
                                            )
                                        ]
                                    });
                                } else {
                                    collected.update({
                                        embeds: [
                                            new Embed(user).setTitle(t('commands:user:info:button:avatar:title:global', { user: user.tag }))
                                                .setImage(user.displayAvatarURL({ extension: 'png', size: 256 }))
                                        ],
                                        components: [
                                            new ActionRowBuilder().setComponents(
                                                new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(t('commands:user:info:button:avatar:browser')).setURL(user.displayAvatarURL({ extension: 'png', size: 256 })),
                                                new ButtonBuilder().setCustomId('ver-avatar-servidor').setStyle(ButtonStyle.Primary).setLabel(t('commands:user:info:button:avatar:local'))
                                            )
                                        ]
                                    });
                                }
                            });
                    });
                });
            }
        }
            break;
        case 'avatar': {
            interaction.reply(user.displayAvatarURL());
        }
            break;
        }
    }
}