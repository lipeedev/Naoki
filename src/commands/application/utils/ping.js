import { NaokiClient as Client } from '../../../NaokiClient.js';
import Command from '../../../structures/SlashCommand.js';

export default class NaokiSubCommands extends Command {
    /** @param {Client} client */
    constructor(client) {
        super(client, {
            guildOnly: false,
            ownerOnly: false
        });
        this.client = client;

        this.name = 'ping';
        this.description = 'Ping command';
        this.category = 'utils';
    }
    async runCommand({ interaction }, t) {
        const parada1 = process.hrtime();
        await this.client.database.guilds.findOne({ guildId: interaction.guildId });
        const parada2 = process.hrtime(parada1);

        interaction.reply(t('commands:ping', {
            clientPing: this.client.ws.ping,
            databasePing: Math.round((parada2[0] * 1e9 + parada2[1]) / 1e6),
            uptimeTimestamp: parseInt((Date.now() - this.client.uptime) / 1000)
        }));
    }
}