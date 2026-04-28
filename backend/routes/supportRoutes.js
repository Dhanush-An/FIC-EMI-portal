const express = require('express');
const {
  createTicket,
  getTickets,
  addMessage,
  updateTicketStatus
} = require('../controllers/supportController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/tickets', createTicket);
router.get('/tickets', getTickets);
router.post('/tickets/:id/message', addMessage);
router.put('/tickets/:id/status', updateTicketStatus);

module.exports = router;
