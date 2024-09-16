import mongoose, { Schema, model } from "mongoose";

const offerSchema = new Schema(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    discountRate: {
      type: Number,
      min: [0, "Discount rate cannot be less than 0"],
      max: [100, "Discount rate cannot exceed 100"],
    },
    minOrderAmt: {
      type: Number,
      min: [0, "Minimum order amount must be a positive number"],
    },
  },
  { timestamps: true }
);

export const Offer = model("Offer", offerSchema);
