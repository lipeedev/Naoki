import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle } from 'discord.js';
import { ApplicationCommand, Embed } from '../../../imports.js';

const categories = {
    'pt-BR': {
        'utils': 'Utilidade',
        'administration': 'Administração',
        'economy': 'Economia'
    },
    'en-US': {
        'utils': 'Utility',
        'administration': 'Administration',
        'economy': 'Economia'
    }
};

export default class HelpCommand extends ApplicationCommand {
    constructor(client) {
        super(client, {
            name: 'help',
            name_localizations: {
                'pt-BR': 'ajuda'
            },
            description: 'A command to see all my commands.',
            description_localizations: {
                'pt-BR': 'Um comando para ver todos os meus comandos.'
            },

            devOnly: true,
            guildOnly: false,
            displayInHelp: false,
            sub_localizations: {
                'pt-BR': ['comando'],
                'en-US': ['command']
            }
        });
    }

    async runCommand({ interaction, lang }, t) {
        const commands = [];
        const categorias = [...new Set(this.client.commands.vanilla.filter(c => c.type == 'application' && c.category !== 'developer').map(c => c.category))];
        for (const categoria of categorias) {
            commands.push(
                this.client.commands.vanilla
                    .filter(cmd => cmd.category === categoria && !!cmd.options.displayInHelp)
                    .map(cmd => `**/${cmd.options?.name_localizations ? cmd.options.name_localizations[lang] : cmd.options.cls}${cmd.options.sub_localizations ? ' ' + cmd.options.sub_localizations[lang].join(' - ') : ''}**: ${cmd.options.description_localizations ? cmd.options.description_localizations[lang] : cmd.options.description || t('commands:help:no_description')}\n<:seta:1011445794064322621> **${t('commands:help:usage')}:** ${cmd.options.usage_localizations ? cmd.options.usage_localizations[lang] : `/${cmd.options?.name_localizations ? cmd.options.name_localizations[lang] : cmd.options.name}`}`)
            );
        }

        const initialEmbed = new Embed(interaction.user)
            .setAuthor({ name: t('commands:help:embed:author') })
            .setDescription(t('commands:help:embed:description', {
                categories: categorias.length,
                commands: this.client.commands.vanilla.filter(c => c.type == 'application' && !!c.options.displayInHelp).size,
                user: interaction.user.tag
            }))
            .setThumbnail(this.client.user.displayAvatarURL({ extension: 'png', size: 512 }))
            .setFooter({ text: t('commands:help:embed:footer') });

        const embeds = [initialEmbed];
        for (let i = 0; i < commands.length; i++) {
            const embed = new Embed(interaction.user)
                .setAuthor({ name: t('commands:help:embed:pages:author', { category: categories[lang][categorias[i]], length: commands[i].length }) })
                .setDescription(commands[i].join('\n'))
                .setFooter({ text: t('commands:help:embed:pages:footer') });

            embeds.push(embed.data);
        }

        let pagina = 0;
        const botoes = (pagina) => new ActionRowBuilder().setComponents(
            pagina == 0 ? [
                new ButtonBuilder()
                    .setCustomId('ver')
                    .setLabel(t('commands:help:embed:pages:button:view'))
                    .setStyle(ButtonStyle.Secondary)] : [
                new ButtonBuilder()
                    .setCustomId('voltar')
                    .setLabel(t('commands:help:embed:pages:button:prev'))
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(pagina == 0),
                new ButtonBuilder()
                    .setCustomId('pagina')
                    .setLabel(`${pagina}/${embeds.length - 1}`)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('avancar')
                    .setLabel(t('commands:help:embed:pages:button:next'))
                    .setDisabled(pagina >= (embeds.length - 1))
                    .setStyle(ButtonStyle.Secondary)]
        );

        const m = await interaction.reply({ fetchReply: true, embeds: [initialEmbed], components: [botoes(pagina)] });
        const collector = m.createMessageComponentCollector({
            filter: (int) => {
                if (['voltar', 'avancar', 'ver'].includes(int.customId)) {
                    if (int.user.id !== interaction.user.id) {
                        int.reply({ ephemeral: true, content: t('commands:help:embed:pages:button:only_author') });
                        return false;
                    }
                    return true;
                }
                return false;
            }
        });

        collector.on('collect', async (int) => {
            if (['avancar', 'ver'].includes(int.customId)) pagina++;
            else pagina--;

            return int.update({ embeds: [embeds[pagina]], components: [botoes(pagina)] });
        });
        return;
    }
}