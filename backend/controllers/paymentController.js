const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const EMIApplication = require('../models/EMIApplication');
const EMIPlan = require('../models/EMIPlan');

let razorpay;
try {
  if (process.env.RAZORPAY_KEY_ID) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
} catch (err) {
  console.error('Razorpay initialization failed:', err.message);
}

// @desc    Create Razorpay Order (Down Payment)
// @route   POST /api/payments/order
// @access  Private (Candidate)
exports.createOrder = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(500).json({ success: false, error: 'Razorpay is not configured on the server. Please add RAZORPAY_KEY_ID to environment variables.' });
    }
    console.log('Creating Razorpay order with data:', req.body);
    const { amount, type, applicationId, installmentNo } = req.body;

    const options = {
      amount: Math.round(Number(amount) * 100), // amount in the smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    console.log('Final Razorpay options:', options);
    const order = await razorpay.orders.create(options);

    // Track payment in DB as 'Created'
    await Payment.create({
      userId: req.user.id,
      amount: Number(amount),
      razorpayOrderId: order.id,
      type: type || 'DownPayment',
      installmentNo: installmentNo,
      status: 'Created',
    });

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('❌ RAZORPAY ERROR DETAILS:', error);
    
    // Extract the most descriptive error message possible
    const errorMessage = error.error?.description || error.description || error.message || 'Razorpay rejected the request.';
    
    res.status(400).json({ 
      success: false, 
      error: errorMessage,
      details: error.error || error
    });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
// @access  Private (Candidate)
exports.verifyPayment = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(500).json({ success: false, error: 'Razorpay is not configured on the server.' });
    }
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

      // Handle different payment types
      if (payment.type === 'DownPayment' && applicationId) {
        const application = await EMIApplication.findById(applicationId);
        application.status = 'Active';
        await application.save();

        // Create the EMI Plan
        await createEMIPlan(application, payment.amount);
      } else if (payment.type === 'EMI' && applicationId) {
        // Find the application and its EMI plan
        const application = await EMIApplication.findById(applicationId);
        if (application && application.emiPlanId) {
          const plan = await EMIPlan.findById(application.emiPlanId);
          if (plan) {
            // Find and update the specific installment in the schedule
            const installmentIndex = plan.schedule.findIndex(
              s => s.installmentNo === payment.installmentNo
            );

            if (installmentIndex !== -1) {
              plan.schedule[installmentIndex].status = 'Paid';
              plan.schedule[installmentIndex].paymentId = payment._id;
              
              // Reduce remaining balance
              plan.remainingBalance -= payment.amount;
              
              // If all paid, close the plan
              const allPaid = plan.schedule.every(s => s.status === 'Paid');
              if (allPaid) {
                plan.status = 'Completed';
                application.status = 'Completed';
                await application.save();
              }
              
              await plan.save();
              console.log(`✅ EMI Installment ${payment.installmentNo} marked as Paid`);
            }
          }
        }
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

  const plan = await EMIPlan.create({
    applicationId: application._id,
    candidateId: application.candidateId,
    totalAmount,
    downPayment,
    emiAmount,
    tenure,
    remainingBalance: totalAmount - downPayment,
    schedule,
  });

  // Link plan back to application
  application.emiPlanId = plan._id;
  await application.save();
};
