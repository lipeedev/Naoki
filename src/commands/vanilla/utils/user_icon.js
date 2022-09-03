import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder
} from 'discord.js';
import { GatewayIntents } from '../../../client/objects/GatewayIntentsObject.js';
import VanillaCommand from '../../../structures/VanillaCommandStructure.js';
import { fetch } from 'undici';
import Embed from '../../../client/utils/Embed.js';

export default class UserInfoCommand extends VanillaCommand {
    constructor(client) {
        super(client, {
            name: 'usericon',
            aliases: ['usuarioicon', 'user-icon', 'membericon', 'usuario-icon', 'member-icon', 'avatar', 'foto', 'picture'],
            name_localizations: {
                'pt-BR': 'avatar',
                'en-US': 'usericon'
            },
            description: 'View a Discord user\'s profile picture.',
            description_localizations: {
                'pt-BR': 'Veja a foto de perfil de algum usuário do Discord.',
                'en-US': 'View a Discord user\'s profile picture.'
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

        (await message.reply({
            embeds: [
                new Embed(message.author)
                    .setAuthor({ name: t('commands:user:avatar:embed:author', { user: user.tag }) })
                    .setImage(user.displayAvatarURL({ extension: 'png', size: 1024 }))
            ],
            components: [
                new ActionRowBuilder().setComponents(
                    (message.guild.members
                        .cache.has(user.id) && message.guild.members
                        .cache.get(user.id).avatarURL()) ? [
                            new ButtonBuilder().setCustomId('ver-avatar-servidor')
                                .setStyle(ButtonStyle.Primary).setLabel(t('commands:user:avatar:button:guild')),
                            new ButtonBuilder().setStyle(ButtonStyle.Link)
                                .setURL(user.displayAvatarURL({ extension: 'png' })).
                                setLabel(t('commands:user:avatar:button:label'))
                        ] : [
                            new ButtonBuilder().setStyle(ButtonStyle.Link)
                                .setURL(user.displayAvatarURL({ extension: 'png' }))
                                .setLabel(t('commands:user:avatar:button:label'))
                        ]
                )
            ]
        })).createMessageComponentCollector({
            filter: (int) => {
                if (['ver-avatar-global', 'ver-avatar-servidor'].includes(int.customId)) {
                    if (int.user.id !== message.author.id) {
                        int.reply({ content: t('interactions:buttons:only_author'), ephemeral: true });
                        return false;
                    }
                    return true;
                }
                return false;
            },
            time: 120_000
        }).on('collect', async (int) => {
            if (int.customId === 'ver-avatar-global') {
                return int.update({
                    embeds: [
                        new Embed(message.author)
                            .setAuthor({ name: t('commands:user:avatar:embed:author', { user: user.tag }) })
                            .setImage(user.displayAvatarURL({ extension: 'png', size: 1024 }))
                    ],
                    components: [
                        new ActionRowBuilder().setComponents(
                            (message.guild.members
                                .cache.has(user.id) && message.guild.members
                                .cache.get(user.id).avatarURL()) ? [
                                    new ButtonBuilder().setCustomId('ver-avatar-servidor')
                                        .setStyle(ButtonStyle.Primary)
                                        .setLabel(t('commands:user:avatar:button:guild')),
                                    new ButtonBuilder().setURL(user.displayAvatarURL({ extension: 'png' }))
                                        .setStyle(ButtonStyle.Link)
                                        .setLabel(t('commands:user:avatar:button:label'))
                                ] : [
                                    new ButtonBuilder().setURL(user.displayAvatarURL({ extension: 'png' }))
                                        .setStyle(ButtonStyle.Link)
                                        .setLabel(t('commands:user:avatar:button:label'))
                                ]
                        )
                    ]
                });
            }
            if (!message.guild.members.cache.has(user.id) || !message.guild.members.cache.get(user.id).avatarURL())
                return int.reply({ content: t('commands:user:avatar:button:no_guild_avatar'), ephemeral: true });

            return int.update({
                embeds: [
                    new Embed(message.author)
                        .setAuthor({ name: t('commands:user:avatar:embed:guild', { user: (message.guild.members.cache.get(user.id)?.nickname || user.tag) }) })
                        .setImage(message.guild.members.cache.get(user.id)?.avatarURL({ extension: 'png', size: 1024 }))
                ],
                components: [
                    new ActionRowBuilder().setComponents(
                        (message.guild.members
                            .cache.has(user.id) && message.guild.members
                            .cache.get(user.id).avatarURL()) ? [
                                new ButtonBuilder().setCustomId('ver-avatar-global')
                                    .setStyle(ButtonStyle.Primary)
                                    .setLabel(t('commands:user:avatar:button:global')),
                                new ButtonBuilder().setURL(message.guild.members.cache.get(user.id)?.avatarURL({ extension: 'png', size: 1024 }))
                                    .setStyle(ButtonStyle.Link)
                                    .setLabel(t('commands:user:avatar:button:label'))
                            ] : [
                                new ButtonBuilder().setURL(user.displayAvatarURL({ extension: 'png' }))
                                    .setStyle(ButtonStyle.Link)
                                    .setLabel(t('commands:user:avatar:button:label'))
                            ]
                    )
                ]
            });
        });
    }
}