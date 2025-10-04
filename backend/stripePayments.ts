/**
 * Stripe Payment Integration
 * Handles payment processing for subscriptions
 */

import { Router } from 'express';
import Stripe from 'stripe';

const router = Router();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-09-30.clover'
});

/**
 * POST /api/payments/create-checkout-session
 * Create a Stripe checkout session
 */
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { subscriptionId, subscriptionName, price, email } = req.body;

    if (!subscriptionId || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: subscriptionName || 'SplitShare Subscription',
              description: `Subscription ID: ${subscriptionId}`,
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout/${subscriptionId}`,
      customer_email: email,
      metadata: {
        subscriptionId,
      },
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('[Stripe] Create session error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

/**
 * POST /api/payments/verify-payment
 * Verify payment after successful checkout
 */
router.post('/verify-payment', async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Payment successful
      res.json({
        success: true,
        paymentStatus: 'paid',
        subscriptionId: session.metadata?.subscriptionId,
        customerEmail: session.customer_email,
      });
    } else {
      res.json({
        success: false,
        paymentStatus: session.payment_status,
      });
    }
  } catch (error) {
    console.error('[Stripe] Verify payment error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhooks for payment events
 */
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return res.status(400).json({ error: 'Missing signature or webhook secret' });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('[Stripe] Payment successful:', session.id);
        // Update database with successful payment
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('[Stripe] Payment intent succeeded:', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('[Stripe] Payment failed:', failedPayment.id);
        break;

      default:
        console.log(`[Stripe] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('[Stripe] Webhook error:', error);
    res.status(400).json({ error: 'Webhook verification failed' });
  }
});

export default router;
