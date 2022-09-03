import { EmbedBuilder } from 'discord.js';

export default class ClientEmbedBuilder extends EmbedBuilder {
    constructor(user, data = {}) {
        super(data);
        this.setFooter({ text: user.tag, iconURL: user.displayAvatarURL() });
        this.setColor('Yellow');
    }
}