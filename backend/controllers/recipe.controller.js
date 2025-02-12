import OpenAI from "openai";
import dotenv from "dotenv";
import json5 from "json5";
import Recipe from "../models/recipe.model.js";
import User from "../models/user.model.js";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Uses your OpenAI key
});

const SYSTEM_PROMPT = `You are an expert culinary AI assistant that creates delicious recipes based on available ingredients. Your target audience is global, but you may frequently encounter users from Kenya and East Africa, so you should prioritize recipes that use local ingredients and reflect East African culinary traditions. However, you are also encouraged to create innovative and globally inspired dishes that incorporate these ingredients in creative ways.

❗ CRITICAL RULE: Return **ONLY** a valid JSON object—NO explanations, NO introductions, NO markdown, NO greetings. **Only JSON.**
❗ If you return anything other than a JSON object, your response is invalid.
❗ **DO NOT** include special characters or non-standard letters in the title.
❗ The title must contain only **letters (A-Z, a-z), numbers (0-9), spaces, commas, hyphens, and parentheses**.

these are some common ingridients you may encounter and make suggest these dishes;
(
- **Maize flour / Unga wa ugali → ALWAYS suggest Ugali** (not dumplings or porridge).
- **Wheat flour / Unga wa ngano → ALWAYS suggest Chapati** (not cake unless sugar is included).
- **Rice / Mchele → Suggest Pilau if spices are included, otherwise plain rice**.
- **Beans / Maharagwe → Recommend Maharagwe ya Nazi (coconut bean stew)**.
- **Cowpeas / Kunde → Recommend Kunde na Ugali (stewed cowpeas with ugali)**.
- **Cassava / Mihogo → Recommend Fried Cassava or Boiled Cassava**.
- **Sweet Potatoes / Viazi Vitamu → Recommend Boiled Sweet Potatoes**.
- **Irish Potatoes / Viazi → Recommend Chips (fries) or Viazi Karai if turmeric is included**.
- **Goat Meat / Nyama ya Mbuzi → Recommend Mbuzi Choma (grilled goat)**.
- **Beef / Nyama ya Ngombe → Recommend Beef Stew or Nyama Choma**.
- **Chicken / Kuku → Recommend Kuku Choma (grilled) or Kuku wa Kupaka (coconut chicken)**.
- **Fish / Samaki → Recommend Samaki wa Kupaka (coconut fish) or Fried Fish**.
- **Green Bananas / Matoke → Recommend Matoke ya Nyama (banana stew with beef)**.
- **Vegetables (Sukuma wiki, spinach, cabbage) → Recommend Fried Sukuma Wiki with Ugali**.
- **Coconut Milk / Maziwa ya Nazi → Recommend Coconut-based dishes like Maharagwe ya Nazi or Samaki wa Kupaka**.)

RECIPE RULES:
1. Use provided ingredients whenever possible
2. Add only essential missing ingredients (salt, oil, basic spices)
3. All ingredients listed must be used in instructions
4. All instructions must be clear and sequential
5. Include exact measurements (e.g., "2 tablespoons" not "some")
6. Include precise temperatures and times
7. Follow standard recipe writing conventions
8. Be creative! Combine East African ingredients with global culinary techniques or fusion ideas when appropriate.

### JSON FORMAT:
{
  "title": "Recipe Name (30-60 chars)",
  "prepTime": "X minutes",
  "cookTime": "X minutes",
  "servings": <integer between 2-8>,
  "ingredients": [
    "<quantity> <unit> <ingredient>",
    "<quantity> <unit> <ingredient>"
  ],
  "instructions": [
    "<clear instruction step>",
    "<clear instruction step>"
  ],
  "message": "<Enjoyment message (50-100 chars)>"
}

STRICT FORMAT RULES:
- JSON Only (no explanations, no markdown, no extra text)
- Correct Data Types (servings: integer, prepTime & cookTime: 'X minutes', arrays for ingredients/instructions)
- No trailing commas or missing brackets
- Every listed ingredient must be used in the instructions
- Ensure JSON is valid before returning
`;

export const generateRecipe = async (req, res) => {
  try {
    const { ingredients, preferences } = req.body;
    const dietaryPreferences = preferences.dietPreferences;
    const allergies = preferences.allergyList;
   
    if (
      !ingredients ||
      !Array.isArray(ingredients) ||
      ingredients.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide an array of ingredients in the format: { "ingredients": ["ingredient1", "ingredient2"] }',
      });
    }

    const ingredientString = ingredients.join(", ");
    let userContent = `I have ${ingredientString}. Please give me a recipe you would recommend I make.`;
    if (Array.isArray(dietaryPreferences) && dietaryPreferences.length > 0) {
      userContent += ` Dietary preferences: ${dietaryPreferences.join(", ")}.`;
    }
    if (Array.isArray(allergies) && allergies.length > 0) {
      userContent += ` Allergies: ${allergies.join(", ")}.`;
    }

    // OpenAI Request
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: userContent,
        },
      ],
      max_tokens: 1024,
    });


    const jsonMatch = response.choices[0].message.content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("No valid JSON found in AI response");
    }

    const cleanJSON = jsonMatch[0];

    let recipe;
    try {
      recipe = json5.parse(cleanJSON);
    } catch (parseError) {
      console.error("JSON Parsing Error:", parseError);
      throw new Error("Failed to parse JSON from AI response");
    }

    // Validate Recipe Structure
    const requiredFields = [
      "title",
      "prepTime",
      "cookTime",
      "servings",
      "ingredients",
      "instructions",
      "message",
    ];
    requiredFields.forEach((field) => {
      if (!recipe.hasOwnProperty(field)) {
        throw new Error(`Missing required field: ${field}`);
      }
    });

    // Ensure correct data types
    if (typeof recipe.title !== "string") {
      throw new Error("Invalid title format");
    }
    if (!/^\d+ minutes$/.test(recipe.prepTime)) {
      throw new Error("Invalid prepTime format");
    }
    if (!/^\d+ minutes$/.test(recipe.cookTime)) {
      throw new Error("Invalid cookTime format");
    }
    if (typeof recipe.servings !== "number") {
      throw new Error("Invalid servings count");
    }
    if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
      throw new Error("Invalid ingredients format");
    }
    if (
      !Array.isArray(recipe.instructions) ||
      recipe.instructions.length === 0
    ) {
      throw new Error("Invalid instructions format");
    }
    if (typeof recipe.message !== "string") {
      throw new Error("Invalid message format");
    }

    return res.status(200).json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    console.error("Recipe generation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate recipe",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

export const saveRecipe = async (req, res) => {
  try {
    const {
      title,
      prepTime,
      cookTime,
      servings,
      ingredients,
      instructions,
      message,
      isFavorite,
      dietaryPreferences,
      allergies,
    } = req.body;

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No user found" });
    }

    const newRecipe = new Recipe({
      title,
      prepTime,
      cookTime,
      servings,
      ingredients,
      instructions,
      message,
      isFavorite,
      dietaryPreferences,
      allergies,
      user: req.user.userId,
    });

    await newRecipe.save();
    res.status(201).json({
      success: true,
      message: "Recipe saved successfully!",
      recipe: newRecipe,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error saving recipe",
      error: error.message,
    });
  }
};
export const fetchRecipes = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user.userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    // Fetch recipes from database for the logged-in user
    const recipes = await Recipe.find({ user: req.user.userId });

    res.status(200).json({ success: true, recipes });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedRecipe = await Recipe.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedRecipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found" });
    }

    res.json(updatedRecipe);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating recipe", error });
  }
};

// Delete Recipe
export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRecipe = await Recipe.findByIdAndDelete(id);

    if (!deletedRecipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found" });
    }

    res.json({ success: true, message: "Recipe deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting recipe", error });
  }
};

export const updateDietaryPreferences = async (req, res) => {
  try {
    const { dietaryPreferences, allergies } = req.body;

    if (!req.user || !req.user.userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    // Find the user by their userId
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Update the dietaryPreferences and allergies only if new values are provided
    if (dietaryPreferences !== undefined) {
      user.dietaryPreferences = dietaryPreferences;
    }
    if (allergies !== undefined) {
      user.allergies = allergies;
    }
    console.log(user);

    // Save the updated user data
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Dietary preferences updated successfully!",
      user, // Send back the updated user object
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error updating dietary preferences",
      error: error.message,
    });
  }
};
