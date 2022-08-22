import pkg from 'mongoose';
const { Schema, model } = pkg;

export default model('usuarios', new Schema({
    userId: { type: String },
    coins: { type: Number, default: 0 },
    cooldowns: {
        daily: { type: Number }
    }
}));