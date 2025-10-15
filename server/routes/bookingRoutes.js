const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const User = require('../models/User');
const Rejection = require('../models/Rejection');
const authMiddleware = require('../middleware/auth');

// 🔍 (Deprecated) Search endpoint no longer filters by date – kept for backward compatibility
router.post('/search', authMiddleware, async (req, res) => {
    const { category } = req.body;
    const providers = await Provider.find({ category });
    res.json(providers);
});

// 📅 Create new booking
router.post('/', authMiddleware, async (req, res) => {
    const { providerId, note = '', title = '' } = req.body;

    const provider = await Provider.findById(providerId);
    if (!provider) return res.status(404).json({ message: 'Provider not found' });

    // Disallow duplicate requests to same provider while previous is pending/accepted
    const existing = await Booking.findOne({
        userId: req.user.userId,
        providerId,
        status: { $in: ['pending', 'accepted'] },
    });
    if (existing) return res.status(400).json({ message: 'Request already sent to this provider' });

    // Build default title
    const user = await User.findById(req.user.userId).select('name');
    const finalTitle = title && title.trim() ? title.trim() : `Booking from ${user?.name || 'User'}`;

    const booking = new Booking({
        userId: req.user.userId,
        providerId,
        date: '',
        status: 'pending',
        title: finalTitle,
        note: note.trim(),
    });

    await booking.save();

    res.json(booking);
});

// 📥 Upcoming bookings for user
router.get('/upcoming', authMiddleware, async (req, res) => {
    const bookings = await Booking.find({
        userId: req.user.userId,
        status: 'pending',
    }).populate('providerId');

    res.json(bookings.map(b => ({
        ...b._doc,
        provider: b.providerId,
    })));
});

// 📜 Booking history for user
router.get('/history', authMiddleware, async (req, res) => {
    const bookings = await Booking.find({
        userId: req.user.userId,
        status: { $ne: 'pending' },
    }).populate('providerId');

    res.json(bookings.map(b => ({
        ...b._doc,
        provider: b.providerId,
        rated: !!b.rating,
    })));
});

// ✅ Mark booking as completed (Provider only)
router.post('/:id/complete', authMiddleware, async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.providerId.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    if (booking.status !== 'accepted') {
        return res.status(400).json({ message: 'Booking must be accepted before completing' });
    }

    booking.status = 'completed';
    await booking.save();

    res.json({ message: 'Booking marked as completed' });
});

// ✅ Accept booking (Provider only)
router.post('/:id/accept', authMiddleware, async (req, res) => {
    const booking = await Booking.findById(req.params.id).populate('providerId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (req.user.role !== 'provider' || booking.providerId._id.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    booking.status = 'accepted';
    await booking.save();
    res.json({ message: 'Booking accepted', booking });
});

// ❌ Reject booking (Provider only) and exclude provider for this user+category
router.post('/:id/reject', authMiddleware, async (req, res) => {
    const booking = await Booking.findById(req.params.id).populate('providerId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (req.user.role !== 'provider' || booking.providerId._id.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    booking.status = 'rejected';
    await booking.save();

    // Record rejection so this provider is not shown again to this user for this category
    try {
        await Rejection.updateOne(
            { userId: booking.userId, providerId: booking.providerId, category: booking.providerId.category },
            { $setOnInsert: { userId: booking.userId, providerId: booking.providerId, category: booking.providerId.category } },
            { upsert: true }
        );
    } catch (e) {
        // ignore duplicate errors
    }

    res.json({ message: 'Booking rejected' });
});

// ❌ Cancel booking
router.post('/:id/cancel', authMiddleware, async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const isUser = booking.userId.toString() === req.user.userId;
    const isProvider = booking.providerId.toString() === req.user.userId;
    if (!isUser && !isProvider) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    await Booking.findByIdAndUpdate(booking._id, { status: 'cancelled' });
    res.json({ message: 'Booking cancelled' });
});

// 🌟 Submit rating
router.post('/:id/rate', authMiddleware, async (req, res) => {
    const { rating, review } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking || booking.userId.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    booking.rating = rating;
    booking.review = review;
    await booking.save();

    const ratedBookings = await Booking.find({
        providerId: booking.providerId,
        rating: { $exists: true },
    });

    const avg = ratedBookings.reduce((acc, b) => acc + b.rating, 0) / ratedBookings.length;
    await Provider.findByIdAndUpdate(booking.providerId, { avg_rating: avg });

    res.json({ message: 'Rating submitted' });
});

// 📋 Bookings for provider
router.get('/provider', authMiddleware, async (req, res) => {
    if (req.user.role !== 'provider') {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const bookings = await Booking.find({ providerId: req.user.userId })
        .populate('userId');

    res.json(bookings.map(b => ({
        ...b._doc,
        user: b.userId,
    })));
});

// 🧾 General booking list with optional filter
router.get('/', authMiddleware, async (req, res) => {
    const filter = req.query.filter;
    let query = { userId: req.user.userId };

    if (filter === 'pending') query.status = 'pending';
    else if (filter === 'completed') query.status = 'completed';
    else if (filter === 'cancelled') query.status = 'cancelled';

    const bookings = await Booking.find(query).populate({
        path: 'providerId',
        select: 'name',
    });

    res.json(bookings.map(b => ({
        ...b._doc,
        provider: b.providerId,
    })));
});

module.exports = router;
