
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import { generateOtp } from "../utils/generateOtp.js";

// ========================================
// REGISTER USER WITH EMAIL OTP
// ========================================

export const registerUser = async (req, res) => {
  let createdUserId;

  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password.",
      });
    }

    // Validate name
    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must contain at least 2 characters.",
      });
    }

    // Validate email format
    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // Validate password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.isVerified
          ? "Email is already registered. Please login."
          : "An account with this email already exists. Please contact support.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate OTP
    const { otp, otpHash, otpExpiresAt } = generateOtp();

    // Create unverified user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      isVerified: false,
      otpHash,
      otpExpiresAt,
    });

    createdUserId = user._id;

    // Send verification email
    await sendEmail(
      normalizedEmail,
      "Verify Your NovaCart Account",
      `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 25px; background: #FAF5EB; border-radius: 12px;">
          <h2 style="color: #795039;">Welcome to NovaCart!</h2>
          <p>Hello ${name.trim()},</p>
          <p>Thank you for creating your NovaCart account.</p>
          <p>Your email verification code is:</p>
          <h1 style="color: #795039; letter-spacing: 8px; text-align: center;">${otp}</h1>
          <p>This code expires in 5 minutes.</p>
          <p>If you did not request this code, please ignore this email.</p>
          <hr />
          <p style="color: #79695F;">NovaCart Team</p>
        </div>
      `
    );

    return res.status(201).json({
      success: true,
      message: "Registration started. Please check your email for OTP verification.",
      email: normalizedEmail,
    });

  } catch (error) {
    console.error("Registration error:", error);

    // Delete newly created user if email sending fails
    if (createdUserId) {
      await User.findByIdAndDelete(createdUserId).catch(() => {});
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
};


// ========================================
// VERIFY EMAIL OTP
// ========================================

export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    if (!/^\d{6}$/.test(String(otp))) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 6-digit OTP.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+otpHash +otpExpiresAt");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found. Please register first.",
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: "Email is already verified.",
      });
    }

    if (!user.otpHash || !user.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new OTP.",
      });
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Hash entered OTP and compare
    const enteredOtpHash = (await import("crypto"))
      .default.createHash("sha256")
      .update(String(otp))
      .digest("hex");

    if (enteredOtpHash !== user.otpHash) {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP. Please try again.",
      });
    }

    // Activate account
    user.isVerified = true;
    user.otpHash = undefined;
    user.otpExpiresAt = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified! Your NovaCart account has been created successfully.",
    });

  } catch (error) {
    console.error("OTP verification error:", error);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed. Please try again.",
    });
  }
};


// ========================================
// LOGIN USER WITH JWT
// ========================================

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Block unverified accounts
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
};

// ========================================
// CHANGE CUSTOMER PASSWORD
// ========================================

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match.",
      });
    }

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    const isCurrentPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully. Please login again with your new password.",
    });

  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to change password. Please try again.",
    });
  }
};
