const express = require('express');
const {
  createTicket,
  getTickets,
  addMessage
} = require('../controllers/supportController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/tickets', createTicket);
router.get('/tickets', getTickets);
router.post('/tickets/:id/message', addMessage);

module.exports = router;
