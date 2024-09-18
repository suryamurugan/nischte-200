import mongoose, { Schema, model } from "mongoose";

const offerSchema = new Schema(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    itemId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    offerType: {
      type: String,
      enum: [
        "Flat Discount",
        "Buy One Get One Free",
        "Special Occasion",
        "Complimentary",
        "Discount dishes",
      ],
      required: true,
    },
    offerDescription: {
      type: String,
      trim: true,
      required: true,
    },
    discountRate: {
      type: Number,
    },
    minOrderAmt: {
      type: Number,
    },
  },
  { timestamps: true }
);

export const Offer = model("Offer", offerSchema);
