import express from "express";
import authenticateUser from "../middlewares/auth.middleware.js";
import { getUserProfile, updateUserProfile, verifyValidOtp } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/api/user-profile", authenticateUser, getUserProfile);  // Fetch user details
router.put("/api/update-profile", authenticateUser, updateUserProfile); // Update profile
router.put("/api/update-email", authenticateUser, verifyValidOtp);

export default router;
