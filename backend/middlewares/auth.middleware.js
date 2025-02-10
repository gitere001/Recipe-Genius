import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { generateTokens } from "../utils/jwt.js";

const authenticateUser = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.cookies;
    console.log("accessToken", accessToken);
    console.log("refleshToken", refreshToken);

    // Check if the access token exists and is valid
    if (accessToken) {
      console.log("access token present");
      try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        console.log("decoded", decoded);
        req.user = { userId: decoded.userId, email: decoded.email };
        return next();
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          // Token expired, try using refresh token
        } else {
          return res.status(403).json({ success: false, message: "Invalid access token." });
        }
      }
    }

    // If no access token or it has expired, check the refresh token
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "Authentication required. Please log in." });
    }

    try {
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

      // Find the user associated with the refresh token
      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new Error("User not found.");
      }

      // Generate new tokens
      const { accessToken: newAccessToken } = generateTokens(user);

      // Set new access token cookie
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      // Attach user to request
      req.user = { userId: user._id, email: user.email };

      return next();
    } catch (error) {
      // If refresh token is invalid or expired, clear cookies and require login
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      const message = error instanceof jwt.TokenExpiredError
        ? "Session expired. Please log in again."
        : "Invalid session. Please log in again.";

      return res.status(401).json({ success: false, message });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export default authenticateUser;
