import { Heart, Trash2, Book } from "lucide-react";
import PropTypes from "prop-types";

export default function RecipeCard({
  title,
  prepTime,
  cookTime,
  isFavorite,
  id,
  setRecipes
}) {
  const toggleFavorite = (recipeId) => {
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe.id === recipeId
          ? { ...recipe, isFavorite: !recipe.isFavorite }
          : recipe
      )
    );
  };
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
          onClick={() => toggleFavorite(id)}
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
        <button className="recipe-card__view">
          <Book />
          View Recipe
        </button>
        <button className="recipe-card__delete" aria-label="Delete recipe">
          <Trash2 className="delete__recipe__icon" />
        </button>
      </footer>
    </article>
  );
}

RecipeCard.propTypes = {
  title: PropTypes.string.isRequired, // Must be a string
  prepTime: PropTypes.string.isRequired, // Must be a string
  cookTime: PropTypes.string.isRequired, // Must be a string
  isFavorite: PropTypes.bool.isRequired, // Must be a boolean
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // String or number
  setRecipes: PropTypes.func.isRequired, // Must be a function
};
