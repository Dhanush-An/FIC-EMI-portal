const EMIApplication = require('../models/EMIApplication');
const CandidateProfile = require('../models/CandidateProfile');
const User = require('../models/User');

// @desc    Get assigned applications
// @route   GET /api/staff/applications
// @access  Private (Staff)
exports.getAssignedApplications = async (req, res) => {
  try {
    const applications = await EMIApplication.find({ staffId: req.user.id })
      .populate('candidateId', 'name email phone')
      .sort('-applicationDate');

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Onboard new candidate
// @route   POST /api/staff/onboard
// @access  Private (Staff)
exports.onboardCandidate = async (req, res) => {
  try {
    const { 
      name, email, phone, address, dob, occupation, income, city, zip, state, 
      service, amount, tenure, notes, password 
    } = req.body;

    // 1. Create candidate user if not exists
    const normalizedEmail = email.toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      user = await User.create({
        name,
        email: normalizedEmail,
        phone,
        password: password || 'Password@123',
        role: 'candidate',
        isVerified: true
      });
    }

    // 2. Create EMI Application only if financial details are provided
    let application = null;
    if (amount || service) {
      // Prevent duplicate pending applications for same service
      const existingApp = await EMIApplication.findOne({ 
        candidateId: user._id, 
        service: service || 'Not Selected',
        status: { $in: ['Submitted', 'Verified'] } 
      });

      if (!existingApp) {
        application = await EMIApplication.create({
          candidateId: user._id,
          staffId: req.user.id,
          service: service || 'Not Selected',
          amountRequested: amount || 0,
          tenure: tenure || 12,
          status: 'Submitted',
          remarks: notes ? [{ text: notes, by: req.user.id }] : []
        });
      } else {
        application = existingApp; // Re-use existing to avoid duplicates
      }
    }

    // 3. Create/Update Profile with full detail nesting
    let profile = await CandidateProfile.findOne({ userId: user._id });
    if (!profile) {
      profile = await CandidateProfile.create({
        userId: user._id,
        personalInfo: { dob },
        employment: { 
          type: occupation, 
          monthlyIncome: income 
        },
        address: { 
          street: address,
          city,
          state,
          zip
        }
      });
    } else {
      profile.personalInfo = { ...profile.personalInfo, dob: dob || profile.personalInfo?.dob };
      profile.employment = { 
        ...profile.employment, 
        type: occupation || profile.employment?.type,
        monthlyIncome: income || profile.employment?.monthlyIncome
      };
      profile.address = { 
        ...profile.address,
        street: address || profile.address?.street,
        city: city || profile.address?.city,
        state: state || profile.address?.state,
        zip: zip || profile.address?.zip
      };
      await profile.save();
    }

    res.status(201).json({ 
      success: true, 
      message: application ? 'Candidate onboarded with loan request' : 'Candidate registered successfully',
      data: { user, application, profile }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Verify application documents (KYC)
// @route   PUT /api/staff/verify/:id
// @access  Private (Staff)
exports.verifyApplication = async (req, res) => {
  try {
    const application = await EMIApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    application.status = 'Verified';
    application.remarks.push({
      text: 'Documents verified by Staff',
      by: req.user.id
    });

    await application.save();

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get all candidates
// @route   GET /api/staff/candidates
// @access  Private (Staff)
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await User.find({ role: 'candidate' }).select('-password').lean();
    
    // Enrich candidates with their latest application status
    const enrichedCandidates = await Promise.all(candidates.map(async (candidate) => {
      const latestApp = await EMIApplication.findOne({ candidateId: candidate._id }).sort('-applicationDate');
      return {
        ...candidate,
        hasActiveLoan: !!latestApp,
        loanStatus: latestApp ? latestApp.status : 'None',
        tenure: latestApp ? latestApp.tenure : null,
        service: latestApp ? latestApp.service : null
      };
    }));

    res.status(200).json({ success: true, count: enrichedCandidates.length, data: enrichedCandidates });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get candidate profile for verification
// @route   GET /api/staff/candidate/:id
// @access  Private (Staff)
exports.getCandidateProfile = async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne({ userId: req.params.id })
      .populate('userId', 'name email phone');

    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

