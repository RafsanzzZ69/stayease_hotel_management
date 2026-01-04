import stripe from "../services/stripe.js";

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency } = req.body; 
    // amount in cents -> $10 = 1000
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency || "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ error: error.message });
  }
};
