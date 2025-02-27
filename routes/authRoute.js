import express from "express";
import { body } from "express-validator";
import {
  deleteUserController,
  getAllUserProfile,
  loginController,
  registerController,
  resetPassword,
  sendOtpMail,
  updateUserImage,
  updateUserProfile,
} from "../controllers/userController.js";
import { upload } from "../middleware/multerMiddleware.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
const router = express.Router();

const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];
const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];


const validateUpdateUser = [
  body("name")
    .optional() // Allows field to be omitted
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),

  body("email").optional().trim().isEmail().withMessage("Invalid email format"),

  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];



const validateResetPassword = [
    body("email").trim().isEmail().withMessage("Invalid email format"),
    body("otp").trim().isLength({ min: 3, max: 6 }).withMessage("OTP must be 6 digits"),
    body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  ];
  
// register user
router.post(
  "/register",
  upload.single("image"),
  validateRegister,
  registerController
);
// login user
router.post("/login",  validateLogin, loginController);
// get user profile
router.get("/getAllUser", requireSignIn, isAdmin, getAllUserProfile);
// update user profile
router.put("/updateProfileImage", requireSignIn, upload.single("image"), updateUserImage);
// update user-profile
router.put("/updateProfile",validateUpdateUser,requireSignIn,updateUserProfile)
// forgot password
router.post("/forgot-password", sendOtpMail);
// reset-password
router.post("/reset-password",validateResetPassword, resetPassword);
// delete user
router.delete("/delete-user/:id",requireSignIn,isAdmin,deleteUserController)
export default router;
