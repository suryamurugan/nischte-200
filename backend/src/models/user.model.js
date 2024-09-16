import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "Make to add the username"],
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    address: {
      type: String,
      required: [true, "Make to add the address"],
      trim: true,
    },
    contactNo: {
      type: String,
      required: [true, "Make to add the contact number"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Make to add the email"],
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model("User", userSchema);
