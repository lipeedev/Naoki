import { NaokiClient } from '../NaokiClient.js';

const ApplicatonCommandData = {
    name: '',
    name_localizations: {},
    description: '',
    description_localizations: {},
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