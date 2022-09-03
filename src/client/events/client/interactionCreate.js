import { ChatInputCommandInteraction } from 'discord.js';
import Event from '../../../structures/ClientEventStructure.js';
let t;

export default class InteractionCreateEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'interactionCreate',
            once: false
        });
    }
    /** @param {ChatInputCommandInteraction} interaction */
    async runEvent(interaction) {
        if (!interaction.guildId || interaction.type !== 2) return;

        const guild = await this.client.getData(interaction.guild.id, 'guild');
        let lang = interaction.locale;

        t = await this.client.getTranslate(interaction.locale);
        if (t() == 'null') lang = guild.lang;
        if (t() == 'null') t = await this.client.getTranslate(interaction.guild.id);

        const command = this.client.commands.vanilla.filter(cmd => cmd.type === 'application').get(interaction.commandName);
        if (!command) return;
        
        if (command.options.devOnly && !this.client.owners.includes(interaction.user.id)) return interaction.reply({ content: t('client:commands:owneronly'), ephemeral: true });
        try {
            command.runCommand({ interaction, lang }, t);
        } catch(err) { console.log(err); }
    }
}