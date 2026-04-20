const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { createSubscription, handleWebhook } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.post('/subscribe', protect, createSubscription);

// Webhook is public (Razorpay calls it)
router.post('/webhook', handleWebhook);

module.exports = router;
