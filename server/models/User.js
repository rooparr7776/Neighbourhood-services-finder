const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    photo: {
        type: String,
        default: '' // will hold the filename or a URL
    },
    badge: {
        type: String,
        enum: ['none', 'silver', 'gold'],
        default: 'none'
    },
    servicesUsed: {
        type: Number,
        default: 0
    },
    location: {
        type: { type: String, enum: ['Point'], required: true }, // GeoJSON type
        coordinates: {
            type: [Number], // Array of [longitude, latitude]
            required: true
        }
    },

    role: { type: String, enum: ['user', 'provider'], required: true }
});

module.exports = mongoose.model('User', userSchema);
