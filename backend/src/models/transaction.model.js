import mongoose, { Schema, model } from "mongoose";

const transactionSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    offerId: {
      type: Schema.Types.ObjectId,
      ref: "Offer",
    },
    transactionAmt: {
      type: Number,
      required: [true, "Total amount is required"],
    },
    paymentMethod: {
      type: String,
      // TODO: check for the payment method[UPI, CC, DC]
    },
  },
  {
    timestamps: true,
  }
);
