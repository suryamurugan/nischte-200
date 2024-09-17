import mongoose, { Schema, model } from "mongoose";

const orderedSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    items: [
      {
        itemId: {
          type: Schema.Types.ObjectId,
          ref: "Menu",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Ordered = model("Ordered", orderedSchema);
