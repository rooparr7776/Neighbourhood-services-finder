const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');

// GET /api/providers?category=Plumber&date=2025-04-14
router.get('/', async (req, res) => {
    const { category, date } = req.query;

    try {
        // Find providers in category
        const providers = await User.find({ role: 'provider', category });

        // Get IDs of providers booked or unavailable on this date
        const booked = await Booking.find({ date, status: { $ne: 'cancelled' } }).select('provider_id');
        const bookedIds = booked.map(b => b.provider_id.toString());

        const availableProviders = providers.filter(p =>
            !bookedIds.includes(p._id.toString()) &&
            (!p.customUnavailableDates || !p.customUnavailableDates.includes(date))
        );

        res.json(availableProviders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/providers/nearby?lat=...&lng=...&maxDistance=5000
router.get('/nearby', async (req, res) => {
    const { lat, lng, maxDistance = 5000 } = req.query;

    try {
        const providers = await Provider.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)],
                    },
                    $maxDistance: parseInt(maxDistance), // in meters
                },
            },
        });

        res.json(providers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
