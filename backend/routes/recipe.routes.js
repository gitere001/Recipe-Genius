import express from 'express';
import { generateRecipe } from '../controllers/recipe.controller.js';
import authenticateUser from '../middlewares/auth.middleware.js';

const router = express.Router();

// POST /api/recipes/generate
router.post('/api/generate-recipe', authenticateUser, generateRecipe);

export default router;