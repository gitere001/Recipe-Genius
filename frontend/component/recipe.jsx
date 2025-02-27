import PropTypes from "prop-types";
import { X, BookmarkPlus } from "lucide-react";
import "./components-styles/recipe.css";
import { API_URL } from "../config";

const RecipeComponent = ({
  title = "Untitled Recipe",
  prepTime = "0 minutes",
  cookTime = "0 minutes",
  servings = 1,
  ingredients = [],
  instructions = [],
  message = "Enjoy your meal!",
  setDisplayRecipe,
  setIngridients,
  setRecipes,
}) => {
  // Function to handle saving the recipe
  async function saveRecipe() {
    try {
      const response = await fetch(`${API_URL}/api/save-recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensures cookies are sent for authentication
        body: JSON.stringify({
          title,
          prepTime,
          cookTime,
          servings,
          ingredients,
          instructions,
          message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Recipe saved successfully!");
        setRecipes((prevRecipes) => [...prevRecipes, data.recipe]);
      } else {
        alert(`❌ Failed to save recipe: ${data.message}`);
      }
    } catch (error) {
      console.error("❌ Error saving recipe:", error);
      alert("❌ An error occurred while saving the recipe.");
    }

    setDisplayRecipe(false);
    setIngridients([]);
  }

  // Function to handle closing the recipe
  function onClose() {
    setDisplayRecipe(false);
    setIngridients([]);
  }

  return (
    <div className="recipe-container">
      <div className="recipe-header">
        <div className="action-buttons">
          <button
            onClick={saveRecipe}
            className="action-btn save-btn"
            aria-label="Save Recipe"
          >
            <BookmarkPlus className="icon" />
            <span>Save Recipe</span>
          </button>

          <button
            onClick={onClose}
            className="action-btn close-btn"
            aria-label="Close Recipe"
          >
            <X className="icon" />
            <span>Close</span>
          </button>
        </div>

        <h1 className="recipe-title">{title}</h1>

        <div className="recipe-info">
          <div className="info-item">
            <strong>Prep Time</strong>
            <span>{prepTime}</span>
          </div>
          <div className="info-item">
            <strong>Cook Time</strong>
            <span>{cookTime}</span>
          </div>
          <div className="info-item">
            <strong>Servings</strong>
            <span>{servings}</span>
          </div>
        </div>
      </div>

      <div className="recipe-content">
        <section className="ingredients-section">
          <h2>Ingredients</h2>
          {ingredients.length > 0 ? (
            <ul className="ingredients-list">
              {ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          ) : (
            <p>No ingredients provided.</p>
          )}
        </section>

        <section className="instructions-section">
          <h2>Instructions</h2>
          {instructions.length > 0 ? (
            <ol className="instructions-list">
              {instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          ) : (
            <p>No instructions available.</p>
          )}
        </section>

        <div className="recipe-message">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

// PropTypes Validation
RecipeComponent.propTypes = {
  title: PropTypes.string,
  prepTime: PropTypes.string,
  cookTime: PropTypes.string,
  servings: PropTypes.number,
  ingredients: PropTypes.arrayOf(PropTypes.string),
  instructions: PropTypes.arrayOf(PropTypes.string),
  message: PropTypes.string,
  setDisplayRecipe: PropTypes.func.isRequired,
  setIngridients: PropTypes.func.isRequired,
  setRecipes: PropTypes.func.isRequired
};

export default RecipeComponent;
