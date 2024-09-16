import mongoose, { Schema, model } from "mongoose";

const shopSchema = new Schema(
  {
    shopName: {
      type: String,
      required: [true, "Make sure to add the shop name"],
      index: true,
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Make sure to add the shop address"],
      trim: true,
    },
    contactNo: {
      type: String,
      required: [true, "Make to add the contact number"],
      unique: true,
    },
    picture: {
      type: String,
      required: [true, "Make sure to add the shop picture"],
    },
  },
  { timestamps: true }
);

export const Shop = model("Shop", shopSchema);
