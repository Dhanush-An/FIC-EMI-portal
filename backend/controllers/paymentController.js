const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const EMIApplication = require('../models/EMIApplication');
const EMIPlan = require('../models/EMIPlan');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order (Down Payment)
// @route   POST /api/payments/order
// @access  Private (Candidate)
exports.createOrder = async (req, res) => {
  try {
    console.log('Creating Razorpay order with data:', req.body);
    const { amount, type, applicationId } = req.body;

    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Track payment in DB as 'Created'
    await Payment.create({
      userId: req.user.id,
      amount,
      razorpayOrderId: order.id,
      type: type || 'DownPayment',
      status: 'Created',
    });

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
// @access  Private (Candidate)
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      applicationId
    } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Payment is valid
      const payment = await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { 
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: 'Success' 
        },
        { new: true }
      );

      // If it was a down payment, update application to 'Active' 
      // and generate the actual EMI plan (simplified logic)
      if (applicationId) {
        const application = await EMIApplication.findById(applicationId);
        application.status = 'Active';
        await application.save();

        // Create the EMI Plan
        await createEMIPlan(application, payment.amount);
      }

      res.status(200).json({ success: true, message: 'Payment verified' });
    } else {
      res.status(400).json({ success: false, error: 'Invalid signature' });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Internal Helper: Create EMI Plan Schedule
const createEMIPlan = async (application, downPayment) => {
  const totalAmount = application.amountRequested;
  const tenure = application.tenure;
  const emiAmount = Math.round((totalAmount - downPayment) / tenure);

  const schedule = [];
  for (let i = 1; i <= tenure; i++) {
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + i);
    schedule.push({
      installmentNo: i,
      dueDate,
      amount: emiAmount,
      status: 'Pending',
    });
  }

  await EMIPlan.create({
    applicationId: application._id,
    candidateId: application.candidateId,
    totalAmount,
    downPayment,
    emiAmount,
    tenure,
    remainingBalance: totalAmount - downPayment,
    schedule,
  });
};
