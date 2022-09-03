import ApplicationCommand from '../../../structures/ApplicationCommandStructure.js';

export default class DailyCommand extends ApplicationCommand {
    constructor(client) {
        super(client, {
            name: 'atm',
            name_localizations: {
                'pt-BR': 'coins',
                'en-US': 'balance'
            },
            description: 'Collect your daily coin prize.',
            description_localizations: {
                'pt-BR': 'Colete seu prêmio diário de moedas',
                'en-US': 'Collect your daily coin prize'
            },
            options: [],

            displayInHelp: true,
            guildOnly: false,
            devOnly: false,
            usage_localizations: {
                'pt-BR': ['pessoa: [@usuário]'],
                'en-US': ['user: [@user]']
            }
        });
    }
    async runCommand({ interaction }, t) {
        const User = await this.client.getData((interaction.options.getUser('pessoa') || interaction.user).id, 'user');
        
        interaction.reply(t('commands:atm', {
            user: User.tag,
            coins: Number(User.coins).toLocaleString('en-us')
        }));
    }
}
