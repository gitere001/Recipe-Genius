import { Heart, Trash2, Book } from "lucide-react";
import PropTypes from "prop-types";
import { API_URL } from "../../config";

export default function RecipeCard({
  title,
  prepTime,
  cookTime,
  isFavorite,
  _id,
  setRecipes,
  recipes,
  setDisplayRecipe,
  setRecipeDetails,
}) {
  const toggleFavorite = async () => {
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe._id === _id
          ? { ...recipe, isFavorite: !recipe.isFavorite }
          : recipe
      )
    );

    try {
      await fetch(`${API_URL}/api/recipes/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: !isFavorite }),
      });
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  const handleDelete = async () => {
    const isConfirmed = confirm("Are you sure you want to delete this recipe?");
    if (!isConfirmed) return;

    setRecipes((prevRecipes) =>
      prevRecipes.filter((recipe) => recipe._id !== _id)
    );

    try {
      await fetch(`${API_URL}/api/recipes/${_id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  function handleDisplayRecipe() {
    const recipeToDisplay = recipes.find((recipe) => recipe._id === _id);
    if (recipeToDisplay) {
      setRecipeDetails(recipeToDisplay);
      setDisplayRecipe(true);
    }
  }

  return (
    <article className="recipe-card">
      <header className="recipe-card__header">
        <div className="recipe-card__details">
          <h3 className="recipe-card__title">{title}</h3>
          <p className="recipe-card__meta">
            Prep: {prepTime.replace(/minutes?/gi, "mins")} | Cook:{" "}
            {cookTime.replace(/minutes?/gi, "mins")}
          </p>
        </div>
        <button
          onClick={toggleFavorite}
          className={`recipe-card__favorite ${isFavorite ? "favorited" : ""}`}
          aria-label="Add to favorites"
        >
          <Heart
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
          />
        </button>
      </header>

      <footer className="recipe-card__actions">
        <button onClick={handleDisplayRecipe} className="recipe-card__view">
          <Book />
          View Recipe
        </button>
        <button
          onClick={handleDelete}
          className="recipe-card__delete"
          aria-label="Delete recipe"
        >
          <Trash2 className="delete__recipe__icon" />
        </button>
      </footer>
    </article>
  );
}

RecipeCard.propTypes = {
  title: PropTypes.string.isRequired,
  prepTime: PropTypes.string.isRequired,
  cookTime: PropTypes.string.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  _id: PropTypes.string.isRequired,
  setRecipes: PropTypes.func.isRequired,
  recipes: PropTypes.array.isRequired,
  setDisplayRecipe: PropTypes.func.isRequired,
  setRecipeDetails: PropTypes.func.isRequired,
};
