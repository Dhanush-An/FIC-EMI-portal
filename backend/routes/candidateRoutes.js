const express = require('express');
const {
  getProfile,
  updateProfile,
  uploadDocs,
  applyEMI,
  getApplications,
  getPayments
} = require('../controllers/candidateController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('candidate'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

router.post('/upload', upload.fields([
  { name: 'aadharCard', maxCount: 1 },
  { name: 'panCard', maxCount: 1 },
  { name: 'profilePhoto', maxCount: 1 }
]), uploadDocs);

router.post('/apply', applyEMI);
router.get('/applications', getApplications);
router.get('/payments', getPayments);

module.exports = router;
