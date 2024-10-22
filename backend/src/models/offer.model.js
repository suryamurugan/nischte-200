import mongoose, { Schema, model } from "mongoose";

const offerTypeSchema = new Schema({
  // Taught of adding some index/field, but need to check for near future use-cases...
  name: {
    type: String,
    required: [true, "Make sure to add the offer type"],
    enum: [
      "Flat-Discount",
      "Plus-Offer",
      "Special-Offer",
      "Complimentary",
      "Discount-Dishes",
    ],
  },
});

const offerDescriptionSchema = new Schema({
  discountRate: {
    type: Number,
  },
  minOrder: {
    type: Number,
  },
  plusOffers: {
    type: Number,
  },
  specialOccasionDate: {
    type: Date,
  },
  discountDishes: {
    type: [String],
    default: undefined,
  },
  numberOfVisits: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    required: true,
  },
});

const offerSchema = new Schema(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: [true, "Make sure to add the shop"],
    },
    itemId: {
      type: Schema.Types.ObjectId,
      ref: "Menu",
      required: [true, "Make sure to add the item"],
    },
    offers: [
      {
        offerType: {
          type: offerTypeSchema,
          required: [true, "Make sure to add the offer-type"],
        },
        offerDescription: {
          type: offerDescriptionSchema,
          required: [true, "Make sure to add the description"],
        },
        _isActive: {
          type: Boolean,
          required: [true, "Make sure to add how long the offer would remain"],
        },
      },
    ],
  },
  { timestamps: true }
);

export const Offer = model("Offer", offerSchema);
