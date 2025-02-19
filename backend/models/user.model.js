import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },


  dietaryPreferences: {
    type: [String],  // Array of strings to store dietary preferences
    default: [],
  },
  allergies: {
    type: [String],  // Array of strings to store allergies
    default: [],
  },

   // 🔐 Password Reset Fields
   passwordResetToken: { type: String, default: null },
   passwordResetExpires: { type: Date, default: null },
});

export default mongoose.model("User", userSchema);
