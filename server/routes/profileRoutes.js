const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Provider = require('../models/Provider');
const authMiddleware = require('../middleware/auth');

// GET /api/profile
router.get('/', authMiddleware, async (req, res) => {
    const { userId, role } = req.user;

    try {
        const model = role === 'provider' ? Provider : User;
        const profile = await model.findById(userId).select('-password'); // exclude password

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get one top-rated available provider per category
router.get('/top-rated-available', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const pipeline = [
            { $match: { availableDates: today } },
            { $sort: { avg_rating: -1 } },
            {
                $group: {
                    _id: '$category',
                    topProvider: { $first: '$$ROOT' },
                },
            },
            {
                $replaceWith: '$topProvider',
            },
        ];

        const topProviders = await Provider.aggregate(pipeline);
        res.json(topProviders);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch top providers' });
    }
});


// PATCH /api/profile/photo - set profile photo filename (after uploading via /api/upload)
router.patch('/photo', authMiddleware, async (req, res) => {
    try {
        const { filename } = req.body;
        if (!filename) return res.status(400).json({ message: 'filename is required' });

        const { userId, role } = req.user;
        const Model = role === 'provider' ? Provider : User;
        const doc = await Model.findByIdAndUpdate(
            userId,
            { photo: filename },
            { new: true, select: '-password' }
        );
        if (!doc) return res.status(404).json({ message: 'Profile not found' });
        res.json(doc);
    } catch (err) {
        console.error('Update photo error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
