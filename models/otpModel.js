import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresIn: { type: Number, required: true },
},{timestamps:true});

export const OtpModel = mongoose.model("otp", otpSchema);
