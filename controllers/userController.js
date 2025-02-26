import { comparePassword, hashPassword } from "../helpers/authHalper.js";
import userModel from "../models/userModel.js";
import { validationResult } from "express-validator";
import { uploadImageOnCloudinary } from "../helpers/imageUploder.js";
import JWT from "jsonwebtoken";
import { OtpModel } from "../models/otpModel.js";
import nodemailer from "nodemailer";

export const registerController = async (req, res) => {
  try {
    // Validate request data using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { name, email, password, image } = req.body;
    const imagePath = req.file ? req.file.path : null;

    if (!name || !email || !password) {
      return res.status(403).json({
        success: false,
        message: "all fields are required",
      });
    }
    const existUser = await userModel.findOne({ email });

    if (existUser) {
      return res.status(400).json({
        success: false,
        message: "User is aleady register",
      });
    }

    // Check if image is provided
    if (!imagePath) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // upload on cloudniry
    const { secure_url, public_id } = await uploadImageOnCloudinary(
      imagePath,
      "users"
    );
    if (!secure_url) {
      return res.status(500).json({
        success: false,
        message: "error uploading image",
      });
    }
    const hashedPassword = await hashPassword(password);

    const userDetails = new userModel({
      name,
      email,
      password: hashedPassword,
      image: {
        secure_url,
        public_id,
      },
    });
    await userDetails.save();

    return res.status(201).json({
      success: true,
      message: "user is register succesfully",
      userDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error in  signUp",
      error: error.message,
    });
  }
};
// login controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // chk user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email not found",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid password",
      });
    }
    // token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in login user",
      error: error.message,
    });
  }
};
// get user profile
export const getAllUserProfile = async (req, res) => {
  try {
    const user = await userModel.find({}).select("-password");
    if (user.length === 0) {
      return res.status(403).json({
        success: false,
        message: "no user found till now",
      });
    }
    return res.status(200).send({
      success: true,
      message: "user get successfully",
      total: user.length,
      user,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in get user profile",
      error: error.message,
    });
  }
};
// update user
export const updateUserProfile = async (req, res) => {
  try {
    const id = req.user.id;
    // validation result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name and Email are required",
      });
    }

    // Check if user exists
    const existingUser = await userModel.findById(req.user._id);
    console.log(existingUser);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    // Update user details
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name,
        email,
        password: hashedPassword,
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error updating user profile",
      error: error.message,
    });
  }
};
// update image
export const updateUserImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "image is required",
      });
    }
    const imageUrl = `/public/images/${req.file.filename}`;
    const updatedImage = await userModel.findByIdAndUpdate(
      req.user._id,
      { image: imageUrl },
      { new: true }
    );
    console.log(updateUserImage);
    return res.status(200).send({
      success: true,
      message: "Profile image updated successfully",
      user: updatedImage,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "error in update image",
      error: error.message,
    });
  }
};
// forgot password
export const sendOtpMail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
    let user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist",
      });
    }
    // Generate
    let otp = Math.floor(Math.random() * 10000 + 1);
    let otpData = new OtpModel({
      email,
      otp,
      expiresIn: Date.now() + 10 * 60 * 1000,
    });
    await otpData.save();

    // Send OTP use nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "kalyanpradeep.184@gmail.com",
        pass: "tmuq yxzw uxzh xhdr",
      },
    });

    const mailOptions = {
      from: '"Kalyan Pradeep" <kalyanpradeep.184@gmail.com>',
      to: `${email}`,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
    };

    const info = await transporter.sendMail(mailOptions);
    return res.status(200).send({
      success: true,
      message: "otp send successfully",
      otpData,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "error in send otp on mailid",
      error: error.message,
    });
  }
};
// reset-password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    console.log("Extracted New Password:", password);
    // validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    // Find OTP record
    let otpRecord = await OtpModel.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(404).send({
        success: false,
        message: "Invalid OTP",
      });
    }
    // Check if OTP is expired
    if (Date.now() > otpRecord.expiresIn) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }
    const hashedPassword = await hashPassword(password);
    console.log("New Password:", password);
    console.log(hashedPassword);

    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).send({
        success: false,
        message: "User not found. Password not updated.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
      updatedUser,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in reset password",
      error: error.message,
    });
  }
};
