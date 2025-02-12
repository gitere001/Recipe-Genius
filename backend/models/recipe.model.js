import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to User
  title: { type: String, required: true },
  prepTime: { type: String, required: true },
  cookTime: { type: String, required: true },
  servings: { type: Number, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: [String], required: true },
  message: { type: String },
  isFavorite: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },

});

export default mongoose.model("Recipe", recipeSchema);
