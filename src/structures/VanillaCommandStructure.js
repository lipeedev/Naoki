import { NaokiClient } from '../NaokiClient.js';

const VanillaCommandData = {
    name: '',
    name_localizations: {},
    description: '',
    description_localizations: {},
    displayInHelp: true,
    guildOnly: true,
    devOnly: false
};

export default class VanillaCommand {
    constructor(client = (new NaokiClient), options = VanillaCommandData) {
        this.client = client;
        this.options = options;
    }
    runCommand() { }
}