const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const stripe = require('stripe');

router.post('/create-payment-intent', protect, async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid payment amount' });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeKey || stripeKey === 'your_stripe_secret_key_here') {
      // Fallback simulated payment intent for local testing/deployment without keys
      console.log('Stripe Key missing. Falling back to Simulated Mock checkout.');
      return res.status(200).json({
        clientSecret: 'mock_client_secret_' + Math.random().toString(36).substring(2),
        isMock: true,
        message: 'Mock payment session initialized'
      });
    }

    const stripeInstance = stripe(stripeKey);
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: Math.round(amount * 100), // amount in cents
      currency: 'usd',
      metadata: {
        userId: req.user._id.toString()
      }
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      isMock: false
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
