import Event from '../../../structures/ClientEventStructure.js';

export default class ReadyEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'ready',
            once: true
        });
    }
    async runEvent() {
        await this.client.application.commands.set(this.client.commands.vanilla.filter(cmd => cmd.options.cmdType == 'application').map(cmd => cmd.options)).then(cmd => this.client.logger('Discord, Application', `Posted ${cmd.size} commands to Discord.`)).catch(e => console.log(e));
        this.client.logger('Discord, Client', 'Connected successfully in ' + this.client.user.tag);
    }
}