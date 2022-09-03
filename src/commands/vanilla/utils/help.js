import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import VanillaCommand from '../../../structures/VanillaCommandStructure.js';
import Embed from '../../../client/utils/Embed.js';

const categories = {
    'pt-BR': {
        'utils': 'Utilidade',
        'administration': 'Administração',
        'economy': 'Economia'
    },
    'en-US': {
        'utils': 'Utility',
        'administration': 'Administration',
        'economy': 'Economy'
    }
};

export default class HelpCommand extends VanillaCommand {
    constructor(client) {
        super(client, {
            name: 'help',
            aliases: ['ajuda', 'commands', 'comandos'],
            name_localizations: {
                'pt-BR': 'ajuda',
                'en-US': 'help'
            },
            description: 'A command to see all my commands.',
            description_localizations: {
                'pt-BR': 'Um comando para ver todos os meus comandos.',
                'en-US': 'A command to see all my commands.'
            },

            devOnly: true,
            guildOnly: false,
            displayInHelp: false,
        });
    }

    async runCommand({ message, args, lang }, t) {
        const commands = [];
        const categorias = this.client.utils.removeDuplicates(this.client.commands.vanilla.filter(c => c.type == 'vanilla' && c.category !== 'developer').map(c => c.category));
        for (const categoria of categorias) {
            commands.push(
                this.client.commands.vanilla
                    .filter(cmd => cmd.type === 'vanilla' && cmd.category === categoria && !!cmd.options.displayInHelp)
                    .map(cmd => `**/${cmd.options?.name_localizations ? cmd.options.name_localizations[lang] : cmd.options.name}${cmd.options.sub_localizations ? ' ' + cmd.options.sub_localizations[lang]?.join(' - ') : ''}**: ${cmd.options.description_localizations ? cmd.options.description_localizations[lang] : cmd.options.description || t('commands:help:no_description')}\n<:seta:1011445794064322621> **${t('commands:help:usage')}:** ${cmd.options.usage_localizations ? cmd.options.usage_localizations[lang] : `/${cmd.options?.name_localizations ? cmd.options.name_localizations[lang] : cmd.options.name}`}`)
            );
        }

        const initialEmbed = new Embed(message.author)
            .setAuthor({ name: t('commands:help:embed:author') })
            .setDescription(t('commands:help:embed:description', {
                categories: categorias.length,
                commands: this.client.commands.vanilla.filter(c => c.type == 'vanilla' && !!c.options.displayInHelp).size,
                user: message.author.tag
            }))
            .setThumbnail(this.client.user.displayAvatarURL({ extension: 'png', size: 512 }))
            .setFooter({ text: t('commands:help:embed:footer') });

        const embeds = [initialEmbed];
        for (let i = 0; i < commands.length; i++) {
            const embed = new Embed(message.author)
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
                    .setStyle(ButtonStyle.Secondary)
            ] : [
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

        const m = await message.reply({ embeds: [initialEmbed], components: [botoes(pagina)] });
        const collector = m.createMessageComponentCollector({
            filter: (int) => {
                if (['voltar', 'avancar', 'ver'].includes(int.customId)) {
                    if (int.user.id !== message.author.id) {
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
    }
}