// routes/providerRoutes.js

const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');
const Rejection = require('../models/Rejection');
const jwt = require('jsonwebtoken');

// GET /api/providers/nearby?lat=..&lng=..&maxDistance=5000&category=Plumber
router.get('/nearby', async (req, res) => {
    try {
        const { lat, lng, maxDistance = 5000, category } = req.query;

        if (lat === undefined || lng === undefined) {
            return res.status(400).json({ message: 'lat and lng are required' });
        }

        const query = {
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)],
                    },
                    $maxDistance: parseInt(maxDistance),
                },
            },
        };

        if (category) query.category = category;

        // Exclude providers rejected by this user for this category (if authenticated)
        let userId = null;
        try {
            const authHeader = req.headers.authorization || '';
            const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
            if (token && process.env.JWT_SECRET) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.userId;
            }
        } catch (e) {
            // ignore token errors, treat as unauthenticated
        }

        let excludedProviderIds = [];
        if (userId && category) {
            const rejects = await Rejection.find({ userId, category }).select('providerId');
            excludedProviderIds = rejects.map(r => r.providerId);
            if (excludedProviderIds.length) {
                query._id = { $nin: excludedProviderIds };
            }
        }

        const providers = await Provider.find(query);
        res.json(providers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET top-rated providers per category (no date filter)
router.get('/quick-book/top-providers', async (req, res) => {
    try {
        const categories = await Provider.distinct('category');
        const results = await Promise.all(categories.map(async (cat) => {
            const topProvider = await Provider.findOne({ category: cat }).sort({ avg_rating: -1 });
            return topProvider;
        }));
        const filteredResults = results.filter(Boolean);
        res.json(filteredResults);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching top providers', error: err.message });
    }
});


module.exports = router;

