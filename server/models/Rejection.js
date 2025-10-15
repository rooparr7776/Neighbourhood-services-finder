const mongoose = require('mongoose');

const rejectionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  category: { type: String, required: true },
}, { timestamps: true });

rejectionSchema.index({ userId: 1, providerId: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Rejection', rejectionSchema);
