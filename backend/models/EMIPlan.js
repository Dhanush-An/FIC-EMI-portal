const mongoose = require('mongoose');

const emiPlanSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EMIApplication',
    required: true,
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  totalAmount: Number,
  downPayment: Number,
  emiAmount: Number,
  tenure: Number,
  interestRate: Number,
  remainingBalance: Number,
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Closed', 'Defaulted'],
    default: 'Active',
  },
  schedule: [{
    installmentNo: Number,
    dueDate: Date,
    amount: Number,
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Overdue'],
      default: 'Pending',
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
  }],
  razorpaySubscriptionId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('EMIPlan', emiPlanSchema);
