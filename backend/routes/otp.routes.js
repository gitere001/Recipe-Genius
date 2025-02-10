import express from "express";
import { userExists, verifyOtp, resendOtp } from "../controllers/otp.controller.js";

const router = express.Router();

router.post("/api/userexists", userExists);
router.post("/api/verify-otp", verifyOtp);
router.post("/api/resendOtp", resendOtp);

export default router;

