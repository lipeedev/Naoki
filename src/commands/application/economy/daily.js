import { NaokiClient as Client } from '../../../NaokiClient.js';
import Command from '../../../structures/SlashCommand.js';

export default class DailyCommand extends Command {
    /** @param {Client} client */
    constructor(client) {
        super(client, {
            guildOnly: false,
            ownerOnly: false
        });
        this.client = client;

        this.name = 'daily';
        this.name_localizations = {
            'pt-BR': 'diário'
        };
        this.category = 'economy';
        this.description = 'Collect your daily coin prize.';
        this.description_localizations = {
            'pt-BR': 'Colete seu prêmio diário de moedas'
        };
    }
    async runCommand({ interaction }, t) {
        let userSchema = await this.client.database.users.findOne({ userId: interaction.user.id });
        if (Date.now() < userSchema.cooldowns.daily) return interaction.reply({ content: t('commands:cooldowns:daily', { prefix: '/', timestamp: ~~(userSchema.cooldowns.daily / 1000) }), ephemeral: true });

        const QuantidadeAleatoria = Math.floor(Math.random() * 17000);
        await this.client.database.users.findOneAndUpdate({ userId: interaction.user.id }, {
            $set: {
                'cooldowns.daily': Date.now() + 8.64e+7,
                'coins': Number((userSchema?.coins || 0) + QuantidadeAleatoria)
            }
        });

        interaction.reply(t('commands:daily', {
            actualCoins: Number((userSchema?.coins || 0) + QuantidadeAleatoria).toLocaleString('en-us'),
            rewardCoins: Number(QuantidadeAleatoria).toLocaleString('en-us'),
            cooldownTimestamp: ~~((Date.now() + 8.64e+7) / 1000)
        }));
    }
}