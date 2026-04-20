const express = require('express');
const {
  getAssignedApplications,
  verifyApplication,
  getCandidateProfile,
  onboardCandidate,
  getAllCandidates
} = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('staff'));

router.get('/applications', getAssignedApplications);
router.get('/candidates', getAllCandidates);
router.post('/onboard', onboardCandidate);
router.put('/verify/:id', verifyApplication);
router.get('/candidate/:id', getCandidateProfile);

module.exports = router;
