import express from "express"
import authenticateUser from "../middlewares/auth.middleware.js";
import { sendResetLink, resetPassword, changePassword } from "../controllers/password.controller.js"

const router = express.Router();

router.post("/api/send-reset-link", sendResetLink);
router.post("/reset-password/:token", resetPassword);
router.post('/api/change-password', authenticateUser, changePassword)


export default router
