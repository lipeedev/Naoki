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

        let language = interaction.locale;
        t = await this.client.getTranslate(interaction.locale);
        if (t() == 'null') t = await this.client.getTranslate(interaction.guild.id);

        const command = this.client.commands.vanilla.filter(cmd => cmd.options.cmdType === 'application').get(interaction.commandName);
        if (!command) return;
        
        try {
            command.runCommand({ interaction }, t, language);
        } catch(err) { console.log(err); }
    }
}