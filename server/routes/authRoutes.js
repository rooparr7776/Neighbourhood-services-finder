const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Provider = require('../models/Provider'); // ✅ Add Provider model

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Debug log: request body
        console.log('➡️ Login attempt:', { email, password, role });

        let user;

        // ✅ Choose the right collection based on role
        if (role === 'provider') {
            user = await Provider.findOne({ email });
        } else {
            user = await User.findOne({ email });
        }

        // Debug log: user from DB
        console.log('📦 Found user:', user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Debug log: password check
        console.log('🔍 Comparing:', password, 'with', user.password);

        const isMatch = await bcrypt.compare(password, user.password);

        console.log('🔐 Password match:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        console.log('✅ Login successful, sending token...');
        res.json({ token, role: user.role });
    } catch (err) {
        console.error('❌ Server error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
