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

module.exports = router;
