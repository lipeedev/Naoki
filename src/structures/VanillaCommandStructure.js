import { NaokiClient } from '../NaokiClient.js';

const VanillaCommandData = {
    name: '',
    name_localizations: {
        'pt-BR': '',
        'en-US': ''
    },
    description: '',
    description_localizations: {
        'pt-BR': '',
        'en-US': ''
    },
    sub_localizations: {
        'pt-BR': [],
        'en-US': []
    },
    usage_localizations: {
        'pt-BR': '',
        'en-US': ''
    },
    aliases: [],
    displayInHelp: true,
    guildOnly: true,
    devOnly: false
};

export default class VanillaCommand {
    constructor(client = (new NaokiClient()), options = VanillaCommandData) {
        this.client = client;
        this.options = options;
    }
    runCommand() { }
}