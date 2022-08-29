import { EmbedBuilder, EmbedData, User } from 'discord.js';

export default class DefaultEmbed extends EmbedBuilder {
  /**
   * @param {User} user
   * @param {EmbedData} data
   */
  constructor(user, data = {}) {
    super(data);
    this.setFooter({ text: user.tag, iconURL: user.displayAvatarURL() });
    this.setColor('Yellow');
  }
}
  