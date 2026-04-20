const CandidateProfile = require('../models/CandidateProfile');
const EMIApplication = require('../models/EMIApplication');

// @desc    Get or create candidate profile
// @route   GET /api/candidate/profile
// @access  Private (Candidate)
exports.getProfile = async (req, res) => {
  try {
    let profile = await CandidateProfile.findOne({ userId: req.user.id });
    
    if (!profile) {
      profile = await CandidateProfile.create({ userId: req.user.id });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update candidate profile
// @route   PUT /api/candidate/profile
// @access  Private (Candidate)
exports.updateProfile = async (req, res) => {
  try {
    const profile = await CandidateProfile.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Upload KYC documents
// @route   POST /api/candidate/upload
// @access  Private (Candidate)
exports.uploadDocs = async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ success: false, error: 'Please upload files' });
    }

    const updateData = {};
    if (req.files.aadharCard) updateData['documents.aadharCard'] = `/uploads/kyc/${req.files.aadharCard[0].filename}`;
    if (req.files.panCard) updateData['documents.panCard'] = `/uploads/kyc/${req.files.panCard[0].filename}`;
    if (req.files.profilePhoto) updateData['documents.profilePhoto'] = `/uploads/kyc/${req.files.profilePhoto[0].filename}`;

    const profile = await CandidateProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updateData },
      { new: true }
    );

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Apply for EMI
// @route   POST /api/candidate/apply
// @access  Private (Candidate)
exports.applyEMI = async (req, res) => {
  try {
    const { amountRequested, tenure } = req.body;

    const application = await EMIApplication.create({
      candidateId: req.user.id,
      amountRequested,
      tenure,
      status: 'Submitted',
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get candidate's EMI applications
// @route   GET /api/candidate/applications
// @access  Private (Candidate)
exports.getApplications = async (req, res) => {
  try {
    const applications = await EMIApplication.find({ candidateId: req.user.id });
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
