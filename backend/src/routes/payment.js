import express from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();

// POST /api/payment/create-payment-intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe trabaja en centavos
      currency: 'usd',
      metadata: { orderId: String(orderId) },
      automatic_payment_methods: { enabled: true }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/payment/webhook - Webhook de Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejar el evento
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    try {
      await prisma.order.update({
        where: { id: parseInt(paymentIntent.metadata.orderId) },
        data: { 
          status: 'PAID',
          paymentId: paymentIntent.id
        }
      });
      console.log(`✅ Orden ${paymentIntent.metadata.orderId} marcada como pagada`);
    } catch (error) {
      console.error('Error actualizando orden:', error);
    }
  }

  res.json({ received: true });
});

export default router;