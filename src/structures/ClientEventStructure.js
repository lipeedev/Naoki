import { NaokiClient } from '../NaokiClient.js';

const ClientEventData = { name: '', once: false };

export default class ClientEvent {
    constructor(client = (new NaokiClient), options = ClientEventData) {
        this.client = client;
        this.options = options;
    }
    runEvent() { }
}