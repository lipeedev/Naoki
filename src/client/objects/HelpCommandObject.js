const HelpCommandObject = {
    'miscelancea': (client, user, type, language, t) => {
        return {
            embeds: [
                {
                    color: 16705372,
                    author: {
                        name: t('commands:help:embed:author:name', {
                            category: t('commands:help:categories:misc')
                        })
                    },
                    footer: {
                        text: user.tag,
                        iconURL: user.displayAvatarURL({ extension: 'png' })
                    },
                    fields: [
                        {
                            name: t('commands:help:categories:misc'),
                            value: `\`${client.commands[type == 1 ? 'application' : 'vanilla'].filter(cmd => cmd?.category == 'misc').map(cmd => cmd?.name_localizations[language]).join('`, `') || t('commands:help:embed:fields:none_commands')}\``
                        }
                    ],
                    description: t('commands:help:embed:description')
                }
            ]
        };
    },
    'diversão': (client, user, type, language, t) => {
        return {
            embeds: [
                {
                    color: 16705372,
                    author: {
                        name: t('commands:help:embed:author:name', {
                            category: t('commands:help:categories:fun')
                        })
                    },
                    footer: {
                        text: user.tag,
                        iconURL: user.displayAvatarURL({ extension: 'png' })
                    },
                    fields: [
                        {
                            name: t('commands:help:categories:fun'),
                            value: `\`${client.commands[type == 1 ? 'application' : 'vanilla'].filter(cmd => cmd?.category == 'fun').map(cmd => cmd?.name_localizations[language]).join('`, `') || t('commands:help:embed:fields:none_commands')}\``
                        }
                    ],
                    description: t('commands:help:embed:description')
                }
            ]
        };
    },
    'administração': (client, user, type, language, t) => {
        return {
            embeds: [
                {
                    color: 16705372,
                    author: {
                        name: t('commands:help:embed:author:name', {
                            category: t('commands:help:categories:administrator')
                        })
                    },
                    footer: {
                        text: user.tag,
                        iconURL: user.displayAvatarURL({ extension: 'png' })
                    },
                    fields: [
                        {
                            name: t('commands:help:categories:administrator'),
                            value: `\`${client.commands[type == 1 ? 'application' : 'vanilla'].filter(cmd => cmd?.category == 'adm').map(cmd => cmd?.name_localizations[language]).join('`, `') || t('commands:help:embed:fields:none_commands')}\``
                        }
                    ],
                    description: t('commands:help:embed:description')
                }
            ]
        };
    },
    'moderação': (client, user, type, language, t) => {
        return {
            embeds: [
                {
                    color: 16705372,
                    author: {
                        name: t('commands:help:embed:author:name', {
                            category: t('commands:help:categories:moderator')
                        })
                    },
                    footer: {
                        text: user.tag,
                        iconURL: user.displayAvatarURL({ extension: 'png' })
                    },
                    fields: [
                        {
                            name: t('commands:help:categories:moderator'),
                            value: `\`${client.commands[type == 1 ? 'application' : 'vanilla'].filter(cmd => cmd?.category == 'mod').map(cmd => cmd?.name_localizations[language]).join('`, `') || t('commands:help:embed:fields:none_commands')}\``
                        }
                    ],
                    description: t('commands:help:embed:description')
                }
            ]
        };
    },
    'utilidade': (client, user, type, language, t) => {
        return {
            embeds: [
                {
                    color: 16705372,
                    author: {
                        name: t('commands:help:embed:author:name', {
                            category: t('commands:help:categories:utils')
                        })
                    },
                    footer: {
                        text: user.tag,
                        iconURL: user.displayAvatarURL({ extension: 'png' })
                    },
                    fields: [
                        {
                            name: '\u200b',
                            value: `${client.commands[type == 1 ? 'application' : 'vanilla'].map(cmd => `**${cmd?.name_localizations[language]}**: ${cmd?.description_localizations[language]}`).slice(0, 4).join('\n') || t('commands:help:embed:fields:none_commands')}`,
                            inline: true
                        },
                        {
                            name: '\u200b',
                            value: `${client.commands[type == 1 ? 'application' : 'vanilla'].map(cmd => `**${cmd?.name_localizations[language]}**: ${cmd?.description_localizations[language]}`).slice(4, 10).join('\n') || t('commands:help:embed:fields:none_commands')}`,
                            inline: true
                        }
                    ],
                    description: t('commands:help:embed:description')
                }
            ]
        };
    },
    'economia': (client, user, type, language, t) => {
        return {
            embeds: [
                {
                    color: 16705372,
                    author: {
                        name: t('commands:help:embed:author:name', {
                            category: t('commands:help:categories:economy')
                        })
                    },
                    footer: {
                        text: user.tag,
                        iconURL: user.displayAvatarURL({ extension: 'png' })
                    },
                    fields: [
                        {
                            name: t('commands:help:categories:economy'),
                            value: `\`${client.commands[type == 1 ? 'application' : 'vanilla'].filter(cmd => cmd?.category == 'eco').map(cmd => cmd?.name_localizations[language]).join('`, `') || t('commands:help:embed:fields:none_commands')}\``
                        }
                    ],
                    description: t('commands:help:embed:description')
                }
            ]
        };
    }
};

export { HelpCommandObject }; 