import { EmbedBuilder, User } from 'discord.js';

export default class DefaultEmbed extends EmbedBuilder {
    /**@param {User} user*/
    constructor(user, data = {}) {
        super(data);
        this.setFooter({ text: user.tag, iconURL: user.displayAvatarURL() });
        this.setColor('Yellow');
    }
}