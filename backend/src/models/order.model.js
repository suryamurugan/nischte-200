import mongoose, { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Make sure to the userId"],
    },
    items: [
      {
        itemId: {
          type: Schema.Types.ObjectId,
          ref: "Menu",
          required: true,
        },
      },
    ],
    totalAmt: {
      type: Number,
    },
    deliveryStatus: {
      type: String,
      enum: ["Pending", "Successful"],
      default: "Pending",
    },
    transactionId: {
      type: String,
      required: true,
      trim: true,
    },
    offerId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = model("Order", orderSchema);
