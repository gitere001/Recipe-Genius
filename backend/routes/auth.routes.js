import express from "express";
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  deleteUser
} from "../controllers/auth.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/api/registeruser", registerUser);
router.post("/api/loginuser", loginUser);
router.post("/api/refresh-token", refreshToken);
router.post("/api/logout", logoutUser);
router.delete('/api/delete-account', authenticateUser, deleteUser);

export default router;

