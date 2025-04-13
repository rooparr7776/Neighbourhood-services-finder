const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    availableDates: [String], // e.g., ["2025-04-13", "2025-04-14"]
    avg_rating: {
        type: Number,
        default: 0,
    },
    role: {
        type: String,
        default: 'provider',
    }
});

module.exports = mongoose.model('Provider', providerSchema);
