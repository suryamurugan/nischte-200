import mongoose, { Schema, model } from "mongoose";

const deliverySchema = new Schema(
  {
    status: {
      type: String,
      enum: ["pending", "completed", "canceled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Delivery = model("Delivery", deliverySchema);
