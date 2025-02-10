import User from "../models/user.model.js";
import { generateTokens } from "../utils/jwt.js";
import { verifyPassword } from "../utils/password.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authenticateUser from "../middlewares/auth.middleware.js";

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error, please try again" });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate input fields
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Compare provided password with stored hashed password
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Set access token cookie with expiration
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });

    // Set refresh token cookie with expiration
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res
      .status(200)
      .json({ success: true, message: "Login successful!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error, please try again" });
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  

  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "Refresh token required" });
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(payload.userId);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    const tokens = generateTokens(user);

    // Set new access token cookie with expiration
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });

    return res.json({ success: true, message: "Valid refresh token" });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

// Logout user
const logoutUser = (req, res) => {

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.status(200).json({ success: true, message: "Logout successful!" });
};

const deleteUser = async (req, res) => {

  try {
    const userId = req.user.userId; // Extract user ID from the authenticated user

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Optionally clear cookies after deletion (logging out the user)
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res
      .status(200)
      .json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later",
    });
  }
};

export { loginUser, refreshToken, logoutUser, registerUser, deleteUser };
