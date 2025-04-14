const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    date: String,
    price: {
        type: Number,
        required: true,
    },

    status: { type: String, default: 'pending' }, // pending | completed | cancelled
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
    },
    review: {
        type: String,
        default: '',
    }


});

module.exports = mongoose.model('Booking', bookingSchema);
