import pkg from 'mongoose';
const { Schema, model } = pkg;

export default model('comandos', new Schema({
    cmdName: { type: String, required: true },
    usos: { type: Number, default: 1 },
    manutencao: { type: Boolean, default: false }
}));