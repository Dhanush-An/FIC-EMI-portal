const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  emiPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EMIPlan',
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  status: {
    type: String,
    enum: ['Created', 'Success', 'Failed'],
    default: 'Created',
  },
  type: {
    type: String,
    enum: ['DownPayment', 'EMI', 'RegistrationFee', 'Penalty'],
    required: true,
  },
  method: String,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Payment', paymentSchema);
