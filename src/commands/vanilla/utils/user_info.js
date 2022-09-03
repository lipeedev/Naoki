import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType
} from 'discord.js';
import VanillaCommand from '../../../structures/VanillaCommandStructure.js';
import Embed from '../../../client/utils/Embed.js';
import { GatewayIntents } from '../../../client/objects/GatewayIntentsObject.js';
import { fetch } from 'undici';

export default class UserInfoCommand extends VanillaCommand {
    constructor(client) {
        super(client, {
            name: 'userinfo',
            aliases: ['usuarioinfo', 'user-info', 'memberinfo', 'usuario-info', 'member-info'],
            name_localizations: {
                'pt-BR': 'usuarioinfo',
                'en-US': 'userinfo'
            },
            description: 'See informations about a user from Discord',
            description_localizations: {
                'pt-BR': 'Veja informações sobre um usuário do Discord',
                'en-US': 'See informations about a user from Discord'
            },

            displayInHelp: true,
            guildOnly: true,
            devOnly: false,
            usage_localizations: {
                'pt-BR': 'pessoa: [@usuário]',
                'en-US': 'user: [@user]'
            }
        });
    }

    async runCommand({ message, args, lang }, t) {
        const user = message.mentions.users?.last() || await this.client.users.fetch(args[0], { force: true }).catch(e => null) || message.author;
        
        if (user.bot) {
            const Application = await fetch(`https://discord.com/api/v10/applications/${user.id}/rpc`).then(body => body?.json()).catch(_ => { });

            const TranslatedIntents = {
                GATEWAY_PRESENCE: t('commands:user:info:bot:intents:gateway_presence'),
                GATEWAY_GUILD_MEMBERS: t('commands:user:info:bot:intents:gateway_guild_member'),
                GATEWAY_MESSAGE_CONTENT: t('commands:user:info:bot:intents:gateway_message_content')
            };

            const ApplicationIntents = Object.entries(GatewayIntents).map(([key, value]) => Application?.flags & value ? `**${TranslatedIntents[key]}**: ${t('undefineds:questions:yes')}` : `**${TranslatedIntents[key]}**: ${t('undefineds:questions:no')}`);
            Application.bot_public ? ApplicationIntents.push(`**${t('commands:user:info:bot:intents:public')}**: ${t('undefineds:questions:yes')}`) : ApplicationIntents.push(`**${t('commands:user:info:bot:intents:public')}**: ${t('undefineds:questions:no')}`);
            Application.bot_require_code_grant ? ApplicationIntents.push(`**${t('commands:user:info:bot:intents:code_grant')}**: ${t('undefineds:questions:yes')}`) : ApplicationIntents.push(`**${t('commands:user:info:bot:intents:code_grant')}**: ${t('undefineds:questions:no')}`);

            const components = [];
            if (Application.custom_install_url || Application.privacy_policy_url || Application.terms_of_service_url) {
                components.push(new ActionRowBuilder());

                if (Application.custom_install_url) components[0].addComponents(
                    new ButtonBuilder().setStyle(5).setLabel(t('commands:user:info:bot:button:custom_url')).setURL(Application.custom_install_url)
                );

                if (Application.privacy_policy_url) components[0].addComponents(
                    new ButtonBuilder().setStyle(5).setLabel(t('commands:user:info:bot:button:privacy_policy')).setURL(Application.privacy_policy_url)
                );

                if (Application.terms_of_service_url) components[0].addComponents(
                    new ButtonBuilder().setStyle(5).setLabel(t('commands:user:info:bot:button:terms_service')).setURL(Application.terms_of_service_url)
                );
            }

            const UserApplicationEmbed = new Embed(message.author)
                .setAuthor({ name: t('commands:user:info:title') })
                .setThumbnail(user.displayAvatarURL({ extension: 'png', size: 256 }))
                .setFields(
                    { name: t('commands:user:info:fields:tag'), value: user.tag, inline: true },
                    { name: t('commands:user:info:fields:id'), value: user.id, inline: true },
                    { name: t('commands:user:info:fields:created'), value: `<t:${~~(user.createdTimestamp / 1000)}:f> <t:${~~(user.createdTimestamp / 1000)}:R>` }
                );

            const ApplicationEmbed = new Embed(user)
                .setAuthor({ name: t('commands:user:info:bot:title') })
                .setDescription(Application.description || t('undefineds:descriptions'))
                .setFields(
                    { name: t('commands:user:info:bot:fields:key'), value: `\`${Application.verify_key || t('undefineds:bot:verify_key')}\`` },
                    { name: t('commands:user:info:bot:fields:intents'), value: ApplicationIntents.join('\n'), inline: true },
                    { name: t('commands:user:info:bot:fields:tags'), value: Application?.tags ? Application.tags.join('\n') : t('undefineds:bot:tags'), inline: true }
                );

            if (message.guild.members.cache.has(user.id)) UserApplicationEmbed.addFields(
                { name: t('commands:user:info:fields:joined'), value: `<t:${~~(message.guild.members.cache.get(user.id).joinedTimestamp / 1000)}:f> <t:${~~(message.guild.members.cache.get(user.id).joinedTimestamp / 1000)}:R>` }
            );
            if (Application.icon) ApplicationEmbed.setThumbnail(this.client.rest.cdn.appIcon(user.id, Application.icon, { extension: 'png', size: 256 }));

            const m = await message.reply({
                embeds: [UserApplicationEmbed],
                components: [
                    new ActionRowBuilder().setComponents(
                        new ButtonBuilder().setCustomId('ver-info-bots').setLabel(t('commands:user:info:bot:button:see')).setStyle(1)
                    )
                ]
            });
            const coletor = m.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60_000 * 2 });

            coletor.on('collect', async collected => {
                collected.reply({
                    embeds: [ApplicationEmbed],
                    components: components,
                    ephemeral: true
                });
            });
        } else {
            const m = await message.reply({
                embeds: !message.guild.members.cache.has(user.id) ? [
                    new Embed(message.author)
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
                            { name: t('commands:user:info:fields:joined'), value: `<t:${~~(message.guild.members.cache.get(user.id).joinedTimestamp / 1000)}:f> <t:${~~(message.guild.members.cache.get(user.id).joinedTimestamp / 1000)}:R>` }
                        )
                ],
                components: (message.guild.members.cache.has(user.id) && message.guild.members.cache.get(user.id).avatarURL()) ? [
                    new ActionRowBuilder().setComponents(
                        new ButtonBuilder().setCustomId('ver-avatar').setLabel(t('commands:user:info:button:avatar:see')).setStyle(ButtonStyle.Primary)
                    )
                ] : [
                    new ActionRowBuilder().setComponents(
                        new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(t('commands:user:info:button:avatar:browser')).setURL(user.displayAvatarURL({ extension: 'png', size: 256 }))
                    )
                ], fetchReply: true
            });

            const coletor = m.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60_000 * 2, filter: c => c.user.id === message.author.id });

            coletor.on('collect', async collected => {
                collected.reply({
                    ephemeral: true,
                    embeds: [
                        new Embed(user).setTitle(t('commands:user:info:button:avatar:title:global', { user: user.tag }))
                            .setImage(user.displayAvatarURL({ extension: 'png', size: 256 }))
                    ],
                    components: message.guild.members.cache.get(user.id).avatarURL() ? [
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
                                if (!message.guild.members.cache.get(user.id).avatarURL()) return collected.reply({ content: t('commands:user:info:button:avatar:noAvatar'), ephemeral: true });

                                collected.update({
                                    embeds: [
                                        new Embed(user).setTitle(t('commands:user:info:button:avatar:title:local', { user: user.tag }))
                                            .setImage(message.guild.members.cache.get(user.id).avatarURL({ extension: 'png', size: 256 }))
                                    ],
                                    components: [
                                        new ActionRowBuilder().setComponents(
                                            new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(t('commands:user:info:button:avatar:browser')).setURL(message.guild.members.cache.get(user.id).avatarURL({ extension: 'png', size: 256 })),
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
}