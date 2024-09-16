import mongoose, { Schema, model } from "mongoose";

const orderedSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    itemId: {
      type: Schema.Types.ObjectId,
      ref: "Menu",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Ordered = model("Ordered", orderedSchema);
