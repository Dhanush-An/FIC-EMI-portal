const EMIApplication = require('../models/EMIApplication');
const CandidateProfile = require('../models/CandidateProfile');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const Refund = require('../models/Refund');
const Payment = require('../models/Payment');

// @desc    Get all applications
// @route   GET /api/admin/applications
// @access  Private (Admin)
exports.getApplications = async (req, res) => {
  try {
    const applications = await EMIApplication.find()
      .populate('candidateId', 'name email phone')
      .populate('staffId', 'name')
      .populate('emiPlanId')
      .sort('-applicationDate');

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Approve application
// @route   PUT /api/admin/approve/:id
// @access  Private (Admin)
exports.approveApplication = async (req, res) => {
  try {
    const application = await EMIApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    application.status = 'Approved';
    application.approvalDate = Date.now();
    application.remarks.push({
      text: 'Application approved by Admin',
      by: req.user.id
    });

    await application.save();

    // Log Action
    await AuditLog.create({
      actor: req.user.id,
      action: 'EMI Approved',
      module: 'Applications',
      oldValue: 'Verified',
      newValue: 'Approved',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Reject application
// @route   PUT /api/admin/reject/:id
// @access  Private (Admin)
exports.rejectApplication = async (req, res) => {
  try {
    const { reason } = req.body;
    const application = await EMIApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    application.status = 'Rejected';
    application.remarks.push({
      text: reason || 'Application rejected by Admin',
      by: req.user.id
    });

    await application.save();

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get all staff
// @route   GET /api/admin/staff
// @access  Private (Admin)
exports.getStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: 'staff' });
    res.status(200).json({ success: true, data: staff });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Assign application to staff
// @route   PUT /api/admin/assign/:id
// @access  Private (Admin)
exports.assignStaff = async (req, res) => {
  try {
    const { staffId } = req.body;
    const application = await EMIApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    application.staffId = staffId;
    await application.save();

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Create new staff
// @route   POST /api/admin/staff
// @access  Private (Admin)
exports.createStaff = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const staffExist = await User.findOne({ email });
    if (staffExist) {
       return res.status(400).json({ success: false, error: 'User already exists with this email' });
    }

    const staff = await User.create({
      name,
      email,
      password,
      role: 'staff',
      phone,
      isVerified: true
    });

    // Log Action
    await AuditLog.create({
      actor: req.user.id,
      action: 'Staff Created',
      module: 'Staff Management',
      newValue: email,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(201).json({ success: true, data: staff });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get all audit logs
// @route   GET /api/admin/audit
// @access  Private (Admin)
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('actor', 'name role')
      .sort('-timestamp');
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get all refund requests
// @route   GET /api/admin/refunds
// @access  Private (Admin)
exports.getRefunds = async (req, res) => {
  try {
    const refunds = await Refund.find()
      .populate('candidateId', 'name email')
      .populate('paymentId')
      .sort('-createdAt');
    res.status(200).json({ success: true, data: refunds });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get all payments
// @route   GET /api/admin/payments
// @access  Private (Admin)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'name email')
      .sort('-createdAt');
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
