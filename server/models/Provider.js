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
    },
    photo: {
        type: String,
        default: '' // will hold the filename or a URL
    },
    // models/Provider.js

    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },


});
providerSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Provider', providerSchema);
