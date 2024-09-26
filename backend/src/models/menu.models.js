import mongoose, { Schema, model } from "mongoose";

const menuSchema = new Schema(
  {
    items: [
      {
        itemName: {
          type: String,
          required: [true, "Make sure to add the item name"],
          index: true,
          trim: true,
        },
        itemDescription: {
          type: String,
          required: [true, "Make sure to add the item description"],
          trim: true,
        },
        price: {
          type: Number,
          required: [true, "Make sure to add the item price"],
        },
        category: {
          type: [String],
          required: [
            true,
            "Make sure to add the category e.g., [Veg, Non-veg]",
          ],
        },
        picture: {
          type: String,
          required: [true, "Make sure to add the item picture"],
        },
        offerId: {
          type: Schema.Types.ObjectId,
          ref: "Offer",
        },
      },
    ],
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
  },
  { timestamps: true }
);

export const Menu = model("Menu", menuSchema);
