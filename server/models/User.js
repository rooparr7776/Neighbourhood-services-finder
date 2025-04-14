const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photo: {
        type: String,
        default: '' // will hold the filename or a URL
    },

    role: { type: String, enum: ['user', 'provider'], required: true }
});

module.exports = mongoose.model('User', userSchema);
