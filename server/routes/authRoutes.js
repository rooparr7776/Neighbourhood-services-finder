const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Provider = require('../models/Provider'); // ✅ Add Provider model
const multer = require('multer');
const path = require('path');

// Minimal upload setup (reuses uploads/ like uploadRoutes)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

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

// POST /api/auth/register
router.post('/register', upload.single('photo'), async (req, res) => {
    try {
        const { role } = req.body;

        if (role === 'provider') {
            const { name, email, password, phone, category, lat, lng } = req.body;

            if (!name || !email || !password || !phone || !category || lat === undefined || lng === undefined) {
                return res.status(400).json({ message: 'Missing required provider fields' });
            }

            const existing = await Provider.findOne({ email });
            if (existing) return res.status(400).json({ message: 'Email already registered' });

            const hashed = await bcrypt.hash(password, 10);

            const provider = await Provider.create({
                name,
                email,
                password: hashed,
                phone,
                category,
                location: {
                    type: 'Point',
                    coordinates: [Number(lng), Number(lat)],
                },
                photo: req.file ? req.file.filename : undefined,
                role: 'provider',
            });

            const token = jwt.sign({ userId: provider._id, role: provider.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
            return res.status(201).json({ token, role: provider.role });
        } else {
            const { name, email, password, phone, lat, lng } = req.body;

            if (!name || !email || !password || !phone || lat === undefined || lng === undefined) {
                return res.status(400).json({ message: 'Missing required user fields' });
            }

            const existing = await User.findOne({ email });
            if (existing) return res.status(400).json({ message: 'Email already registered' });

            const hashed = await bcrypt.hash(password, 10);

            const user = await User.create({
                name,
                email,
                password: hashed,
                phone,
                location: {
                    type: 'Point',
                    coordinates: [Number(lng), Number(lat)],
                },
                role: 'user',
            });

            const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
            return res.status(201).json({ token, role: user.role });
        }
    } catch (err) {
        console.error('❌ Register error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

