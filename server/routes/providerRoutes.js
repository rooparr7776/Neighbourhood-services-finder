// routes/providerRoutes.js

const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');

// GET /api/providers/search?category=Plumber&date=2025-04-14
router.get('/search', async (req, res) => {
    const { category, date } = req.query;
    try {
        const providers = await Provider.find({
            category,
            availableDates: date,
        });
        res.json(providers);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET top-rated available providers per category
router.get('/quick-book/top-providers', async (req, res) => {
    try {
        const categories = await Provider.distinct('category');
        const today = new Date().toISOString().split('T')[0];

        const results = await Promise.all(categories.map(async (cat) => {
            const topProvider = await Provider.findOne({
                category: cat,
                availableDates: today,
            }).sort({ avg_rating: -1 });

            return topProvider;
        }));

        const filteredResults = results.filter(Boolean);
        res.json(filteredResults);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching top providers', error: err.message });
    }
});

// GET top-rated available provider from each category for today
router.get('/quick-book/top-providers', async (req, res) => {
    const today = new Date().toISOString().slice(0, 10);

    const categories = await Provider.distinct('category');

    const topProviders = await Promise.all(categories.map(async (category) => {
        const providers = await Provider.find({
            category,
            availableDates: today
        }).sort({ avg_rating: -1 });

        if (providers.length > 0) {
            return providers[0]; // top-rated one
        }
        return null;
    }));

    const filtered = topProviders.filter(Boolean);
    res.json(filtered);
});


module.exports = router;
