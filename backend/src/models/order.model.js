import mongoose, { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Make sure to the userId"],
    },
    deliveryId: {
      type: Schema.Types.ObjectId,
      ref: "Delivery",
    },
    totalAmt: {
      type: Number,
      required: [true, "Make sure to add the total amount"],
    },
    offerId: {
      type: Schema.Types.ObjectId,
      ref: "Offer",
    },
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    },
  },
  {
    timestamps: true,
  }
);

export const Order = model("Order", orderSchema);
