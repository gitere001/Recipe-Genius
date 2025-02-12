import express from "express";
import {
  generateRecipe,
  saveRecipe,
  fetchRecipes,
  updateRecipe,
  deleteRecipe,
  updateDietaryPreferences,
} from "../controllers/recipe.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";

const router = express.Router();

// POST /api/recipes/generate
router.post("/api/generate-recipe", authenticateUser, generateRecipe);
router.post("/api/save-recipe", authenticateUser, saveRecipe);
router.get("/api/fetch-recipes", authenticateUser, fetchRecipes);
router.put("/api/recipes/:id", updateRecipe);
router.delete("/api/recipes/:id", deleteRecipe);
router.patch("/api/update-dietary", authenticateUser, updateDietaryPreferences);

export default router;
