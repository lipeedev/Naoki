export default class Event {
    constructor(client, EventOptions = {
        once: false,
    }) {
        this.name = '';
        this.options = EventOptions;

        this.client = client;
    }
}