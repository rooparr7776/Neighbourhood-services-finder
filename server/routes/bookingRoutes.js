const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Search available providers
router.post('/search', authMiddleware, async (req, res) => {
    let { category, date } = req.body;
    // Normalize date to YYYY-MM-DD
    const normalizedDate = new Date(date).toISOString().slice(0, 10);

    const providers = await Provider.find({
        category,
        availableDates: normalizedDate
    });

    console.log("🔍 Searching for providers on:", normalizedDate);
    res.json(providers);
});


// Create new booking
// Create new booking
router.post('/', authMiddleware, async (req, res) => {
    const { providerId, date } = req.body;

    const provider = await Provider.findById(providerId);
    if (!provider) return res.status(404).json({ message: 'Provider not found' });

    const booking = new Booking({
        userId: req.user.userId,
        providerId,
        date,
        price: provider.price, // 💸 store it here
        status: 'pending',
    });

    await booking.save();

    // Remove booked date from availability
    await Provider.findByIdAndUpdate(providerId, {
        $pull: { availableDates: date }
    });

    res.json(booking);
});


// Upcoming bookings for user
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

// Booking history for user
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

// Mark booking as completed (provider only)
router.post('/:id/complete', authMiddleware, async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
    }

    // Only provider who owns this booking can complete it
    if (booking.providerId.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    booking.status = 'completed';
    await booking.save();

    res.json({ message: 'Booking marked as completed' });
});


// Cancel booking
// Cancel booking
router.post('/:id/cancel', authMiddleware, async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.userId.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    // ✅ Update without validation errors
    await Booking.findByIdAndUpdate(booking._id, { status: 'cancelled' });

    const normalizedDate = new Date(booking.date).toISOString().slice(0, 10);

    await Provider.findByIdAndUpdate(
        booking.providerId,
        { $addToSet: { availableDates: normalizedDate } }
    );

    console.log(`✅ Restored ${normalizedDate} to provider ${booking.providerId}`);

    res.json({ message: 'Booking cancelled and provider availability restored' });
});




// Submit rating
router.post('/:id/rate', authMiddleware, async (req, res) => {
    const { rating, review } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking || booking.userId.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    booking.rating = rating;
    booking.review = review;
    await booking.save();

    // Recalculate average rating for provider
    const ratedBookings = await Booking.find({
        providerId: booking.providerId,
        rating: { $exists: true },
    });

    const avg = ratedBookings.reduce((acc, b) => acc + b.rating, 0) / ratedBookings.length;
    await Provider.findByIdAndUpdate(booking.providerId, { avg_rating: avg });

    res.json({ message: 'Rating submitted' });
});

// Bookings for provider
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

module.exports = router;

//history of booking
// General booking list with optional filter
router.get('/', authMiddleware, async (req, res) => {
    const filter = req.query.filter;
    let query = { userId: req.user.userId };

    if (filter === 'pending') query.status = 'pending';
    else if (filter === 'completed') query.status = 'completed';
    else if (filter === 'cancelled') query.status = 'cancelled';

    const bookings = await Booking.find(query).populate({
        path: 'providerId',
        select: 'name price', // Only pull name and price
    });

    res.json(bookings.map(b => ({
        ...b._doc,
        provider: b.providerId,
    })));
});

