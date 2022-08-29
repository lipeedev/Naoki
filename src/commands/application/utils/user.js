import { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { fetch } from 'undici';
import { GatewayIntents } from '../../../client/objects/GatewayIntentsObject.js';
import ApplicationCommand from '../../../structures/ApplicationCommandStructure.js';
import Embed from '../../../client/utils/Embed.js';

export default class UserSubCommands extends ApplicationCommand {
    constructor(client) {
        super(client, {
            name: 'user',
            name_localizations: {
                'pt-BR': 'usuario',
                'en-US': 'user'
            },
            description: 'User commands',
            description_localizations: {
                'pt-BR': 'Veja informações sobre um usuário do Discord',
                'en-US': 'See informations about a user from Discord'
            },
            options: [
                {
                    // @ts-ignore
                    name: 'info',
                    name_localizations: {
                        // @ts-ignore
                        'pt-BR': 'info'
                    },
                    // @ts-ignore
                    description: 'See information about a user',
                    description_localizations: {
                        // @ts-ignore
                        'pt-BR': 'Veja informações sobre um usuário do Discord'
                    },
                    // @ts-ignore
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            // @ts-ignore
                            name: 'user',
                            name_localizations: {
                                // @ts-ignore
                                'pt-BR': 'pessoa'
                            },
                            // @ts-ignore
                            description: 'Select a user to see informations',
                            description_localizations: {
                                // @ts-ignore
                                'pt-BR': 'Selecione uma pessoa para ver as informações'
                            },
                            // @ts-ignore
                            type: ApplicationCommandOptionType.User,
                            // @ts-ignore
                            required: false
                        }
                    ]
                },
                {
                    // @ts-ignore
                    name: 'avatar',
                    name_localizations: {
                        // @ts-ignore
                        'pt-BR': 'foto'
                    },
                    // @ts-ignore
                    description: 'See the avatar of someone',
                    description_localizations: {
                        // @ts-ignore
                        'pt-BR': 'Veja a foto de perfil de alguém'
                    },
                    // @ts-ignore
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            // @ts-ignore
                            name: 'user',
                            name_localizations: {
                                // @ts-ignore
                                'pt-BR': 'pessoa'
                            },
                            // @ts-ignore
                            description: 'Select a user to see avatar',
                            description_localizations: {
                                // @ts-ignore
                                'pt-BR': 'Selecione uma pessoa para ver a foto de perfil'
                            },
                            // @ts-ignore
                            type: ApplicationCommandOptionType.User,
                            // @ts-ignore
                            required: false
                        }
                    ]
                }
            ],
            
            displayInHelp: true,
            guildOnly: true,
            devOnly: false,
        });
    }
    // @ts-ignore
    async runCommand({ interaction }, t) {
        const user = interaction.options.getUser('user') || interaction.user;
        switch (interaction.options.getSubcommand()) {
        case 'info': {
            if (user.bot) {
                const Application = await fetch(`https://discord.com/api/v10/applications/${user.id}/rpc`).then(body => body?.json()).catch(_ => { });

                const TranslatedIntents = {
                    GATEWAY_PRESENCE: t('commands:user:info:bot:intents:gateway_presence'),
                    GATEWAY_GUILD_MEMBERS: t('commands:user:info:bot:intents:gateway_guild_member'),
                    GATEWAY_MESSAGE_CONTENT: t('commands:user:info:bot:intents:gateway_message_content')
                };

                // @ts-ignore
                const ApplicationIntents = Object.entries(GatewayIntents).map(([key, value]) => Application?.flags & value ? `**${TranslatedIntents[key]}**: ${t('undefineds:questions:yes')}` : `**${TranslatedIntents[key]}**: ${t('undefineds:questions:no')}`);
                // @ts-ignore
                Application.bot_public ? ApplicationIntents.push(`**${t('commands:user:info:bot:intents:public')}**: ${t('undefineds:questions:yes')}`) : ApplicationIntents.push(`**${t('commands:user:info:bot:intents:public')}**: ${t('undefineds:questions:no')}`);
                // @ts-ignore
                Application.bot_require_code_grant ? ApplicationIntents.push(`**${t('commands:user:info:bot:intents:code_grant')}**: ${t('undefineds:questions:yes')}`) : ApplicationIntents.push(`**${t('commands:user:info:bot:intents:code_grant')}**: ${t('undefineds:questions:no')}`);
                // @ts-ignore
                const components = [];

                // @ts-ignore
                if (Application.custom_install_url || Application.privacy_policy_url || Application.terms_of_service_url) {
                    components.push(new ActionRowBuilder());
                    // @ts-ignore
                    if (Application.custom_install_url) components[0].addComponents(
                        // @ts-ignore
                        new ButtonBuilder().setStyle(5).setLabel(t('commands:user:info:bot:button:custom_url')).setURL(Application.custom_install_url)
                    );
                    // @ts-ignore
                    if (Application.privacy_policy_url) components[0].addComponents(
                        // @ts-ignore
                        new ButtonBuilder().setStyle(5).setLabel(t('commands:user:info:bot:button:privacy_policy')).setURL(Application.privacy_policy_url)
                    );
                    // @ts-ignore
                    if (Application.terms_of_service_url) components[0].addComponents(
                        // @ts-ignore
                        new ButtonBuilder().setStyle(5).setLabel(t('commands:user:info:bot:button:terms_service')).setURL(Application.terms_of_service_url)
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
                    // @ts-ignore
                    .setDescription(Application.description || t('undefineds:descriptions'))
                    .setFields(
                        // @ts-ignore
                        { name: t('commands:user:info:bot:fields:key'), value: `\`${Application.verify_key || t('undefineds:bot:verify_key')}\`` },
                        { name: t('commands:user:info:bot:fields:intents'), value: ApplicationIntents.join('\n'), inline: true },
                        // @ts-ignore
                        { name: t('commands:user:info:bot:fields:tags'), value: Application?.tags ? Application.tags.join('\n') : t('undefineds:bot:tags'), inline: true }
                    );

                if (interaction.guild.members.cache.has(user.id)) UserApplicationEmbed.addFields(
                    { name: t('commands:user:info:fields:joined'), value: `<t:${~~(interaction.guild.members.cache.get(user.id).joinedTimestamp / 1000)}:f> <t:${~~(interaction.guild.members.cache.get(user.id).joinedTimestamp / 1000)}:R>` }
                );
                // @ts-ignore
                if (Application.icon) ApplicationEmbed.setThumbnail(this.client.rest.cdn.appIcon(user.id, Application.icon, { extension: 'png', size: 256 }));

                const m = await interaction.reply({
                    embeds: [UserApplicationEmbed],
                    components: [
                        new ActionRowBuilder().setComponents(
                            new ButtonBuilder().setCustomId('ver-info-bots').setLabel(t('commands:user:info:bot:button:see')).setStyle(1)
                        )
                    ], fetchReply: true
                });
                const coletor = m.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60_000 * 2 });
                // @ts-ignore
                coletor.on('collect', async collected => {
                    collected.reply({
                        embeds: [ApplicationEmbed],
                        // @ts-ignore
                        components: components,
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

                // @ts-ignore
                const coletor = m.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60_000 * 2, filter: c => c.user.id === interaction.user.id });
                // @ts-ignore
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
                    // @ts-ignore
                    }).then(msg => {
                        msg.createMessageComponentCollector({ componentType: ComponentType.Button })
                            // @ts-ignore
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
            interaction.reply({
                embeds: [
                    new Embed(interaction.user)
                        .setAuthor({ name: t('commands:user:avatar:title', { user: user.username }) })
                        .setImage(user.displayAvatarURL())
                ]
            });
        }
            break;
        }
    }
}