import { NaokiClient } from '../NaokiClient.js';

const ApplicatonCommandData = {
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
    type: 1,
    options: [],
    displayInHelp: true,
    guildOnly: true,
    devOnly: false
};

export default class ApplicationCommand {
    constructor(client = (new NaokiClient), options = ApplicatonCommandData) {
        this.client = client;
        this.options = options;
    }
    runCommand() { }
}