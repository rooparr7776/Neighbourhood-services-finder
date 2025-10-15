const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const Message = require('../models/Message');
const multer = require('multer');

// Reuse local uploads folder for chat images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Access guard: only user or provider in the booking, and only while pending
async function canChat(req, bookingId) {
  const booking = await Booking.findById(bookingId);
  if (!booking) return { allowed: false, code: 404, msg: 'Booking not found' };
  if (!(booking.status === 'pending' || booking.status === 'accepted' || booking.status === 'completed')) return { allowed: false, code: 403, msg: 'Chat disabled for this booking' };
  const { userId, role } = req.user;
  const isUser = role === 'user' && booking.userId.toString() === userId;
  const isProvider = role === 'provider' && booking.providerId.toString() === userId;
  if (!isUser && !isProvider) return { allowed: false, code: 403, msg: 'Unauthorized' };
  return { allowed: true, booking };
}

// GET messages
router.get('/:bookingId/messages', auth, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const guard = await canChat(req, bookingId);
    if (!guard.allowed) return res.status(guard.code).json({ message: guard.msg });

    const messages = await Message.find({ bookingId }).sort({ createdAt: 1 });

    // Attach senderName without N+1 queries: fetch names once from booking parties
    const user = await require('../models/User').findById(guard.booking.userId).select('name');
    const provider = await require('../models/Provider').findById(guard.booking.providerId).select('name');

    const withNames = messages.map(m => ({
      ...m._doc,
      senderName: m.senderRole === 'user' ? (user?.name || 'User') : (provider?.name || 'Provider')
    }));

    res.json(withNames);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST send message
router.post('/:bookingId/messages', auth, upload.single('image'), async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { text = '' } = req.body;
    const image = req.file ? req.file.filename : '';
    if (!image && !text.trim()) return res.status(400).json({ message: 'Provide text or image' });

    const guard = await canChat(req, bookingId);
    if (!guard.allowed) return res.status(guard.code).json({ message: guard.msg });

    const msg = await Message.create({
      bookingId,
      senderId: req.user.userId,
      senderRole: req.user.role,
      text: text.trim(),
      image,
    });

    // attach senderName
    const senderName = req.user.role === 'user'
      ? (await require('../models/User').findById(req.user.userId).select('name'))?.name || 'User'
      : (await require('../models/Provider').findById(req.user.userId).select('name'))?.name || 'Provider';

    res.status(201).json({ ...msg._doc, senderName });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
