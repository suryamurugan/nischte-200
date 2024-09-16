import mongoose, { Schema, model } from "mongoose";

const menuSchema = new Schema(
  {
    itemName: {
      type: String,
      required: [true, "Make sure to the item name"],
      index: true,
      trim: true,
    },
    itemDescription: {
      type: String,
      required: [true, "Make to sure to the item description"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Make sure to add the item price"],
    },
    category: {
      type: String,
      required: [true, "Make sure to add the category for-eg:[Veg, Non-veg]"],
    },
    picture: {
      type: String,
      required: [true, "Make sure to add the item picture"],
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    offerId: {
      type: Schema.Types.ObjectId,
      ref: "Offer",
    },
  },
  { timestamps: true }
);

export const Menu = model("Menu", menuSchema);
