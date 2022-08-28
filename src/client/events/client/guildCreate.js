import Event from '../../../structures/ClientEventStructure.js';

export default class ReadyEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'guildCreate',
            once: true
        });
    }
    async runEvent(guild) {
        await this.client.channels.cache.get('1012377361305567322').send(`+ ${guild.name}`);
    }
}