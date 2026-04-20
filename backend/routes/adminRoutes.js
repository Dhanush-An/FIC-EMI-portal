const express = require('express');
const {
  getApplications,
  approveApplication,
  rejectApplication,
  getStaff,
  assignStaff,
  createStaff,
  getAuditLogs,
  getRefunds,
  getAllPayments
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/applications', getApplications);
router.put('/approve/:id', approveApplication);
router.put('/reject/:id', rejectApplication);
router.get('/staff', getStaff);
router.put('/assign/:id', assignStaff);
router.post('/staff', createStaff);
router.get('/audit', getAuditLogs);
router.get('/refunds', getRefunds);
router.get('/payments', getAllPayments);

module.exports = router;
