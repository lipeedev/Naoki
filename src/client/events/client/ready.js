import Event from '../../../structures/ClientEventStructure.js';
import VoidBots from 'voidbots';

export default class ReadyEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'ready',
            once: true
        });
    }
    async runEvent() {
        await this.client.application.commands.set(this.client.commands.vanilla.filter(cmd => cmd.type == 'application').map(cmd => cmd.options)).then(cmd => this.client.logger('Discord, Application', `Posted ${cmd.size} commands to Discord.`)).catch(e => console.log(e));
        this.client.logger('Discord, Client', 'Connected successfully in ' + this.client.user.tag);
        
        const VoidManager = new VoidBots(process.env.VOID_BOTS_TOKEN, { autoPost: true }, this.client);
        VoidManager.postStats(this.client.guilds.cache.size, this.client.shard.count);

        process.on('unhandledRejection', (err) => console.log(err));
        process.on('uncaughtException', (err) => console.log(err));
    }
}