const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance
let razorpayInstance = null;

const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.warn('Razorpay keys are missing. Payment feature may not work.');
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
    });
  }
  return razorpayInstance;
};

// @desc    Create a new Razorpay Order
// @route   POST /api/payment/order
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount) {
      return res.status(400).json({ message: 'Amount is required to create a payment order.' });
    }

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise for INR)
      currency,
      receipt: receipt || `receipt_${Date.now()}`
    };

    const instance = getRazorpayInstance();
    const order = await instance.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: 'Failed to create Razorpay order.' });
    }

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    res.status(500).json({ message: 'Server error while creating payment order.' });
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payment/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment verification details.' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment signature verification failed. Transaction might be tampered.' });
    }

    // Payment is valid
    res.status(200).json({
      success: true,
      message: 'Payment verified successfully.'
    });
  } catch (error) {
    console.error('Razorpay Verification Error:', error);
    res.status(500).json({ message: 'Server error while verifying payment.' });
  }
};
