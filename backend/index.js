import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// import redisClient from "./configs/redis.js";

import connectDB from "./configs/db.js";
import corsMiddleware from "./configs/cors.js";

import authRoutes from "./routes/auth.routes.js";
import otpRoutes from "./routes/otp.routes.js";
import passwordRoutes from "./routes/password.routes.js";
import userRoutes from "./routes/user.routes.js";
import recipeRoutes from "./routes/recipe.routes.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

connectDB();
// (async () => {
//   try {
//     await redisClient.connect();
//     console.log("✅ Redis connection established!");
//   } catch (error) {
//     console.error("❌ Redis connection failed:", error);
//   }
// })();
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(authRoutes);
app.use(otpRoutes);
app.use(passwordRoutes);
app.use(userRoutes);
app.use(recipeRoutes);
app.use(express.static(path.join(__dirname, "public")));

app.get("/reset-password/:token", (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "index.html"));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
