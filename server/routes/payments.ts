import { RequestHandler } from "express";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY || "";

// Lazy initialize Stripe - only create instance when API key is available
let stripeInstance: Stripe | null = null;

function getStripeInstance(): Stripe {
  if (!stripeInstance && stripeSecret) {
    stripeInstance = new Stripe(stripeSecret, { apiVersion: "2024-11-20.acacia" });
  }
  return stripeInstance as Stripe;
}

export const createPaymentIntent: RequestHandler = async (req, res) => {
  try {
    const { amount, currency = "usd", orderId, customerEmail } = req.body;

    if (!amount || amount < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    if (!stripeSecret || stripeSecret === "") {
      return res.status(500).json({
        success: false,
        message: "Stripe not configured. Contact administrator.",
      });
    }

    const stripe = getStripeInstance();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      description: `Order ${orderId}`,
      receipt_email: customerEmail,
      metadata: {
        orderId: String(orderId),
      },
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    });
  } catch (error: any) {
    console.error("Payment intent error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create payment intent",
    });
  }
};

export const confirmPayment: RequestHandler = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: "Payment intent ID is required",
      });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId
    );

    res.json({
      success: paymentIntent.status === "succeeded",
      data: {
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        paymentIntentId: paymentIntent.id,
      },
    });
  } catch (error: any) {
    console.error("Confirm payment error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to confirm payment",
    });
  }
};

export const handleWebhook: RequestHandler = async (req, res) => {
  try {
    const signature = req.headers["stripe-signature"];

    if (!signature || typeof signature !== "string") {
      return res.status(400).json({ received: false });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return res.status(500).json({
        error: "Webhook secret not configured",
      });
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      webhookSecret
    );

    switch (event.type) {
      case "payment_intent.succeeded":
        console.log("Payment succeeded:", event.data.object);
        break;
      case "payment_intent.payment_failed":
        console.log("Payment failed:", event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    res.status(400).json({
      error: `Webhook Error: ${error.message}`,
    });
  }
};

export const getPublishableKey: RequestHandler = (req, res) => {
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return res.status(500).json({
      success: false,
      message: "Stripe not configured",
    });
  }

  res.json({
    success: true,
    data: {
      publishableKey,
    },
  });
};
