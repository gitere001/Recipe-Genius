import Otp from "../models/otp.model.js";
import User from "../models/user.model.js";
import postmark from "postmark";
import dotenv from "dotenv";
dotenv.config();

const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

export const sendOtp = async (email) => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expiryTime = new Date(Date.now() + 5 * 60 * 1000);
  await Otp.deleteMany({ email });
  await Otp.create({ email, otp, expiresAt: expiryTime });

  try {
    await client.sendEmail({
      From: process.env.FROM_EMAIL,
      To: email,
      Subject: "Your Recipe Genius Verification Code",
      TextBody: `Your verification code is: ${otp}. This code will expire in 5 minutes.`,
      HtmlBody: `<h1>Recipe Genius Verification Code</h1>
                 <p>Your verification code is: <strong>${otp}</strong></p>
                 <p>This code will expire in 5 minutes.</p>`,
    });
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send OTP to ${email}:`, error);
    throw error; // rethrow so the caller can handle the failure
  }
};
export const isOtpValid = async (email, otp) => {
  try {
    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord) {
      return {
        valid: false,
        reason: "Invalid OTP",
      };
    }

    if (new Date() > otpRecord.expiresAt) {
      await Otp.deleteOne({ email, otp });
      return {
        valid: false,
        reason: "OTP has expired",
      };
    }

    await Otp.deleteOne({ email, otp });
    return {
      valid: true,
      reason: "OTP verified successfully",
    };
  } catch (error) {
    console.error("Error validating OTP:", error);
    return {
      valid: false,
      reason: "Server error, please try again",
    };
  }
};

// Check if user exists and send OTP
export const userExists = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    } else {
      await sendOtp(email);

      return res.status(200).json({ success: true, message: "New user" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error, please try again" });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Email and OTP are required" });
  }

  try {
    const { valid, reason } = await isOtpValid(email, otp);

    if (!valid) {
      return res.status(400).json({ success: false, message: reason });
    }

    return res.status(200).json({ success: true, message: reason });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error, please try again" });
  }
};
// Resend OTP
export const resendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  try {
    const maxResendAttempts = 3;
    const resendWindow = 15 * 60 * 1000;

    const recentResends = await Otp.countDocuments({
      email,
      createdAt: { $gte: new Date(Date.now() - resendWindow) },
    });

    if (recentResends >= maxResendAttempts) {
      return res.status(429).json({
        success: false,
        message: "Too many OTP resend attempts. Please try again later.",
      });
    }

    await sendOtp(email);
    return res
      .status(200)
      .json({ success: true, message: "New OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error, please try again" });
  }
};
