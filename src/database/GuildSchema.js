import pkg from 'mongoose';
const { Schema, model } = pkg;

export default model('servidores', new Schema({
    guildId: { type: String },
    prefix: { type: String, default: 'n.' },
    lang: { type: String, default: 'pt-BR' },
    warns: { type: Array, default: [] }
}));