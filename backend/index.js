import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./configs/db.js";
import corsMiddleware from "./configs/cors.js";

import authRoutes from "./routes/auth.routes.js";
import otpRoutes from "./routes/otp.routes.js";
import passwordRoutes from "./routes/password.routes.js";
import userRoutes from "./routes/user.routes.js"
import recipeRoutes from './routes/recipe.routes.js';
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config()
const app = express()

connectDB()
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(authRoutes);
app.use(otpRoutes);
app.use(passwordRoutes)
app.use(userRoutes)
app.use(recipeRoutes)
app.use(express.static(path.join(__dirname, 'public')));

app.get("/reset-password/:token", (req, res) => {
  res.sendFile(path.join(__dirname, './public', 'index.html'));
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























// import express from "express";
// import mongoose from "mongoose";
// // import cors from "cors";
// import dotenv from "dotenv";
// import postmark from "postmark";
// import jwt from "jsonwebtoken";

// import bcrypt from "bcrypt";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// dotenv.config();

// const app = express();
// const corsOptions = {
//   origin: "http://localhost:5173",
//   credentials: true,
// };

// app.use(cors(corsOptions));
// app.use(cookieParser()); // Add this middleware to parse cookies
// app.use(express.json());
// const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("Connected to MongoDB Atlas"))
//   .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

// const otpSchema = new mongoose.Schema({
//   email: { type: String, required: true },
//   otp: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
//   expiresAt: { type: Date, required: true },
// });

// const OTP = mongoose.model("OTP", otpSchema);

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, unique: true, required: true },
//   password: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// const User = mongoose.model("User", userSchema);
// const generateTokens = (user) => {
//   const accessToken = jwt.sign(
//     { userId: user._id, email: user.email },
//     process.env.JWT_SECRET,
//     { expiresIn: "15m" } // Short lived
//   );

//   const refreshToken = jwt.sign(
//     { userId: user._id },
//     process.env.REFRESH_TOKEN_SECRET,
//     { expiresIn: "7d" }
//   );

//   return { accessToken, refreshToken };
// };

// app.post("/api/userexists", async (req, res) => {
//   const { email } = req.body;

//   // Validate email input
//   if (!email) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Email is required" });
//   }

//   try {
//     const user = await User.findOne({ email });

//     if (user) {
//       return res
//         .status(400)
//         .json({ success: false, message: "User already exists" });
//     } else {
//       // Generate OTP and set expiry time
//       const otp = Math.floor(1000 + Math.random() * 9000).toString();
//       const expiryTime = new Date(Date.now() + 5 * 60 * 1000);

//       // Delete any existing OTPs for this email
//       await OTP.deleteMany({ email });

//       // Save the new OTP to the database
//       await OTP.create({ email, otp, expiresAt: expiryTime });

//       // Send OTP in the background without waiting for it to complete
//       client
//         .sendEmail({
//           From: process.env.FROM_EMAIL,
//           To: email,
//           Subject: "Your Recipe Genius Verification Code",
//           TextBody: `Your verification code is: ${otp}. This code will expire in 5 minutes.`,
//           HtmlBody: `
// 			<h1>Recipe Genius Verification Code</h1>
// 			<p>Your verification code is: <strong>${otp}</strong></p>
// 			<p>This code will expire in 5 minutes.</p>
// 		  `,
//         })
//         .then(() => console.log(`OTP sent to ${email}`))
//         .catch((error) =>
//           console.error(`Failed to send OTP to ${email}:`, error)
//         );

//       // Respond immediately without waiting for the OTP to be sent
//       return res.status(200).json({ success: true, message: "New user" });
//     }
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ success: false, message: "Server error, please try again" });
//   }
// });
// app.post("/api/verify-otp", async (req, res) => {
//   const { email, otp } = req.body;

//   // Validate inputs
//   if (!email || !otp) {
//     return res.status(400).json({
//       success: false,
//       message: "Email and OTP are required",
//     });
//   }

//   try {
//     // Find the OTP record for this email
//     const otpRecord = await OTP.findOne({ email, otp });

//     // Check if OTP exists
//     if (!otpRecord) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid OTP",
//       });
//     }

//     // Check if OTP is expired
//     if (new Date() > otpRecord.expiresAt) {
//       // Delete expired OTP
//       await OTP.deleteOne({ email, otp });
//       return res.status(400).json({
//         success: false,
//         message: "OTP has expired",
//       });
//     }

//     // OTP is valid, delete it from database
//     await OTP.deleteOne({ email, otp });

//     // Return success
//     return res.status(200).json({
//       success: true,
//       message: "OTP verified successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Server error, please try again",
//     });
//   }
// });

// app.post("/api/resendOtp", async (req, res) => {
//   const { email } = req.body;

//   // Input validation
//   if (!email) {
//     return res.status(400).json({
//       success: false,
//       message: "Email is required",
//     });
//   }

//   try {
//     // Rate limiting
//     const maxResendAttempts = 3;
//     const resendWindow = 15 * 60 * 1000; // 15 minutes

//     const recentResends = await OTP.countDocuments({
//       email,
//       createdAt: { $gte: new Date(Date.now() - resendWindow) },
//     });

//     if (recentResends >= maxResendAttempts) {
//       return res.status(429).json({
//         success: false,
//         message: "Too many OTP resend attempts. Please try again later.",
//       });
//     }

//     // Generate OTP and set expiry time
//     const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
//     const expiryTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

//     // Delete any existing OTPs for this email
//     await OTP.deleteMany({ email });

//     // Save new OTP
//     await OTP.create({
//       email,
//       otp,
//       expiresAt: expiryTime,
//     });

//     console.log(
//       `Generated OTP for ${email}: ${otp}, Expires at: ${expiryTime}`
//     );

//     // Send OTP email
//     try {
//       await client.sendEmail({
//         From: process.env.FROM_EMAIL,
//         To: email,
//         Subject: "Your Recipe Genius Verification Code",
//         TextBody: `Your verification code is: ${otp}. This code will expire in 5 minutes.`,
//         HtmlBody: `
// 			<h1>Recipe Genius Verification Code</h1>
// 			<p>Your verification code is: <strong>${otp}</strong></p>
// 			<p>This code will expire in 5 minutes.</p>
// 		  `,
//       });
//       console.log(`OTP sent to ${email}`);
//     } catch (error) {
//       console.error(`Failed to send OTP to ${email}:`, error);
//       // Optionally, log this error to a monitoring tool
//     }

//     return res.status(200).json({
//       success: true,
//       message: "New OTP sent successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Server error, please try again",
//     });
//   }
// });

// app.post("/api/registeruser", async (req, res) => {
//   const { name, email, password } = req.body;
//   if (!name || !email || !password) {
//     return res.status(400).json({ error: "All fields are required" });
//   }
//   try {
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//     });
//     await newUser.save();
//     res
//       .status(201)
//       .json({ success: true, message: "User registered successfully!" });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ success: false, message: "Server error, please try again" });
//   }
// });
// app.post("/api/loginuser", async (req, res) => {
//   const { email, password } = req.body;

//   // Validate input fields
//   if (!email || !password) {
//     return res
//       .status(400)
//       .json({ success: false, message: "All fields are required" });
//   }

//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res
//         .status(400)
//         .json({ success: false, message: "User not found" });
//     }

//     // Compare provided password with stored hashed password
//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid credentials" });
//     }

//     const { accessToken, refreshToken } = generateTokens(user);

//     // Set access token cookie with expiration
//     res.cookie('accessToken', accessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       maxAge: 15 * 60 * 1000, // 15 minutes
//       expires: new Date(Date.now() + 15 * 60 * 1000) // Explicit expiry time
//     });

//     // Set refresh token cookie with expiration
//     res.cookie('refreshToken', refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//       expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Explicit expiry time
//     });

//     return res
//       .status(200)
//       .json({ success: true, message: "Login successful!" });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ success: false, message: "Server error, please try again" });
//   }
// });

// app.post("/api/refresh-token", async (req, res) => {
//   const { refreshToken } = req.cookies;
//   console.log(req.cookies);

//   if (!refreshToken) {
//     return res.status(401).json({ success: false, message: "Refresh token required" });
//   }

//   try {
//     const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
//     const user = await User.findById(payload.userId);

//     if (!user) {
//       return res.status(401).json({ success: false, message: "User not found" });
//     }

//     const tokens = generateTokens(user);

//     // Set new access token cookie with expiration
//     res.cookie("accessToken", tokens.accessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       maxAge: 15 * 60 * 1000, // 15 minutes
//       expires: new Date(Date.now() + 15 * 60 * 1000) // Explicit expiry time
//     });

//     return res.json({ success: true, message: "Valid refresh token" });
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid refresh token" });
//   }
// });

// app.post("/api/logout", (req, res) => {
//   res.clearCookie("accessToken");
//   res.clearCookie("refreshToken");
//   return res.status(200).json({ success: true, message: "Logout successful!" });
// });


// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


