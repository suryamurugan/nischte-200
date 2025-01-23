import { razorpayInstance } from "../index.js";
import crypto from "crypto";
import { Payment } from "../models/payment.model.js";

export const checkout = async (req, res) => {
  try {
    const amountInPaise = Math.round(Number(req.body.amount) * 100);
    const options = {
      amount: amountInPaise,
      currency: "INR",
    };
    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error in checkout function:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check",
    });
  }
};

export const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    const payment = await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    res.redirect(
      `http://localhost:5173/order?reference=${razorpay_payment_id}`
    );
  } else {
    res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
  }
};
