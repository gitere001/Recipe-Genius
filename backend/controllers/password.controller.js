import User from "../models/user.model.js";
import postmark from "postmark";
import crypto from "crypto";
import bcrypt from "bcrypt";

const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

// ✅ 1. Utility function to check if user exists
const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// ✅ 2. Send Password Reset Email
const sendResetLink = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Email does not exist" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // 🔗 Create Reset Link
    const resetLink = `${
      process.env.CLIENT_URL || "http://localhost:5000"
    }/reset-password/${resetToken}`;

    // 📧 Send Email
    await client.sendEmail({
      From: process.env.FROM_EMAIL,
      To: email,
      Subject: "Password Reset Request",
      TextBody: `To reset your password, click the following link: ${resetLink}\nIf you did not request this, please ignore this email.`,
      HtmlBody: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Password Reset Request</h2>
          <p>We received a request to reset your password. Click the button below to proceed:</p>
          <p>
            <a href="${resetLink}" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 15px; text-decoration: none; border-radius: 5px;">
              Reset Password
            </a>
          </p>
          <p>If you did not request this, please ignore this email.</p>
          <p>Best regards, <br> The Recipe Genius Team</p>
        </div>
      `,
    });

    // ✅ Send Success Response
    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error(`Failed to send password reset email to ${email}:`, error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later",
    });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // Check if all fields are provided
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  // Ensure new password and confirmation match
  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Passwords do not match" });
  }

  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Verify the current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect current password" });
    }

    // Hash and update the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully!",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later",
    });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  console.log("token", token);
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Passwords do not match" });
  }

  try {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    // 🔒 Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // ❌ Clear reset token fields
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    // 💾 Save the updated user
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful! You can now log in.",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later",
    });
  }
};

export { sendResetLink, resetPassword, changePassword };
