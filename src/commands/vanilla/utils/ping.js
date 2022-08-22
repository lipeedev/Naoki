import { NaokiClient as Client } from '../../../NaokiClient.js';
import Command from '../../../structures/Command.js';

export default class PingCommand extends Command {
    /** @param {Client} client */
    constructor(client) {
        super(client, {
            guildOnly: true,
            ownerOnly: false
        });
        this.client = client;

        this.name = 'ping';
        this.aliases = ['pong'];
        this.description = 'Ping command';
    }
    async runCommand({ message, args }, t) {
        const parada1 = process.hrtime();
        await this.client.database.guilds.findOne({ guildId: message.guild.id });
        const parada2 = process.hrtime(parada1);

        message.reply(t('commands:ping', {
            clientPing: this.client.ws.ping,
            databasePing: Math.round((parada2[0] * 1e9 + parada2[1]) / 1e6),
            uptimeTimestamp: parseInt((Date.now() - this.client.uptime) / 1000)
        }));
    }
}