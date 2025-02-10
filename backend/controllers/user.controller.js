import User from "../models/user.model.js";
import { sendOtp, isOtpValid } from "./otp.controller.js";

const updateUserProfile = async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user.userId;

  if (!name && !email) {
    return res.status(400).json({
      success: false,
      message: "Nothing to update.",
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    let pendingVerification = false;

    // Check if the new email already exists
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use.",
        });
      }

      pendingVerification = true;
    }

    // Update the name if provided
    if (name) {
      user.name = name;
    }

    // Save the updated user to the database
    await user.save();

    // Send OTP if email was updated
    if (pendingVerification) {
      await sendOtp(email);
    }

    return res.status(200).json({
      success: true,
      message: pendingVerification
        ? "OTP sent for verification."
        : "Profile updated successfully.",
      pendingVerification,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Try again later.",
    });
  }
};

const verifyValidOtp = async (req, res) => {
  const { email, otp } = req.body;
  const userId = req.user.userId;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Email and OTP are required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    const { valid, reason } = await isOtpValid(email, otp);

    if (!valid) {
      return res.status(400).json({ success: false, message: reason });
    }
    user.email = email

    await user.save();

    return res.status(200).json({ success: true, message: reason });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error, please try again" });
  }
};

const getUserProfile = async (req, res) => {
  const userId = req.user.userId; // Extract from authentication middleware

  try {
    const user = await User.findById(userId).select("name email"); // Retrieve only name & email

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

export { getUserProfile, updateUserProfile, verifyValidOtp };
