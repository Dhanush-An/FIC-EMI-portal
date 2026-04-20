const mongoose = require('mongoose');

const candidateProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  personalInfo: {
    dob: Date,
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    fatherName: String,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: { type: String, default: 'India' },
  },
  employment: {
    type: {
      type: String,
      enum: ['Salaried', 'Self-Employed', 'Business', 'Student', 'Other'],
    },
    employerName: String,
    monthlyIncome: Number,
    designation: String,
  },
  documents: {
    aadharCard: String, // URL
    panCard: String,    // URL
    profilePhoto: String, // URL
    addressProof: String, // URL
  },
  verificationStatus: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CandidateProfile', candidateProfileSchema);
