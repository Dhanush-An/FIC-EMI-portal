const Razorpay = require('razorpay');
const EMIPlan = require('../models/EMIPlan');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Subscription
// @route   POST /api/subscriptions/create
// @access  Private (Candidate)
exports.createSubscription = async (req, res) => {
  try {
    const { amount, tenure, emiPlanId } = req.body;

    // 1. Create a Razorpay Plan if it doesn't exist (Simplified: usually you'd reuse plans)
    const razorpayPlan = await razorpay.plans.create({
      period: 'monthly',
      interval: 1,
      item: {
        name: 'Monthly EMI Installment',
        amount: amount * 100, // paise
        currency: 'INR',
        description: 'Monthly auto-debit for EMI plan',
      },
    });

    // 2. Create Subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: razorpayPlan.id,
      customer_notify: 1,
      total_count: tenure - 1, // first installment is downpayment, rest are auto-debit
      start_at: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // start next month
      addons: [],
      notes: {
        emiPlanId,
      },
    });

    // 3. Update EMIPlan with subscription ID
    await EMIPlan.findByIdAndUpdate(emiPlanId, { razorpaySubscriptionId: subscription.id });

    res.status(200).json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        short_url: subscription.short_url,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Webhook to handle recurring payment success/failure
// @route   POST /api/webhooks/razorpay
// @access  Public (Razorpay)
exports.handleWebhook = async (req, res) => {
  const secret = 'WEBHOOK_SECRET'; // Set this in Razorpay dashboard

  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest === req.headers['x-razorpay-signature']) {
    const event = req.body.event;
    
    if (event === 'subscription.charged') {
      const { subscription_id, payment_id, amount } = req.body.payload.payment.entity;
      
      // Update the EMI schedule in DB
      const plan = await EMIPlan.findOne({ razorpaySubscriptionId: subscription_id });
      if (plan) {
        // Find the next pending installment
        const installment = plan.schedule.find(s => s.status === 'Pending');
        if (installment) {
          installment.status = 'Paid';
          plan.remainingBalance -= amount / 100;
          await plan.save();
        }
      }
    }
    
    res.status(200).json({ status: 'ok' });
  } else {
    res.status(400).json({ success: false });
  }
};
