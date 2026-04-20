const mongoose = require('mongoose');

const emiApplicationSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assigned staff
  },
  emiPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EMIPlan',
  },
  service: {
    type: String,
    required: true,
    default: 'Professional Course'
  },
  amountRequested: {
    type: Number,
    required: true,
  },
  tenure: {
    type: Number, // in months
    required: true,
  },
  interestRate: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Draft', 'Submitted', 'Under Review', 'Verified', 'Approved', 'Rejected', 'Active'],
    default: 'Draft',
  },
  remarks: [{
    text: String,
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  }],
  applicationDate: {
    type: Date,
    default: Date.now,
  },
  approvalDate: Date,
});

module.exports = mongoose.model('EMIApplication', emiApplicationSchema);
