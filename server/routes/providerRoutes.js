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

module.exports = router;
