import { ApplicationCommandType } from 'discord.js';

export default class SlashCommand {
    constructor(client, CommandOptions = {
        guildOnly: true,
        ownerOnly: false
    }) {
        this.client = client;

        this.name = '';
        this.name_localizations = {};
        this.description = '';
        this.description_localizations = {};
        this.type = ApplicationCommandType.ChatInput;
        this.category = '';

        this.options = [];
        this.help = {};
        this.opts = CommandOptions;
    }
}