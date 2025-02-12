import { useState, useEffect } from "react";
import { Search, ArrowLeft } from "lucide-react";
import "./MyrecipesModal.css";
import PropTypes from "prop-types";

import RecipeCard from "./recipeCard";
import DisplayRecipeComponent from "./displayRecipe";
import { API_URL } from "../../config";

export default function MyrecipesModal({
  recipes,
  setRecipes,
  setActiveModal,
}) {
  const [activeButton, setActiveButton] = useState("all");
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [displayRecipe, setDisplayRecipe] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState({});




  useEffect(() => {
    if (activeButton === "all") {
      setFilteredRecipes(recipes);
    } else {
      setFilteredRecipes(recipes.filter((recipe) => recipe.isFavorite));
    }
  }, [activeButton, recipes]);

  const recipeCardsElements = filteredRecipes.map((recipe) => {
    return (
      <RecipeCard
        key={recipe._id}
        setRecipes={setRecipes}
        {...recipe}
        recipes={recipes}
        setDisplayRecipe={setDisplayRecipe}
        setRecipeDetails={setRecipeDetails}

      />
    );
  });
  useEffect(() => {
    if (searchString.trim().length > 0) {
      setFilteredRecipes(
        recipes
          .filter((recipe) =>
            recipe.title?.toLowerCase().startsWith(searchString.toLowerCase())
          )
          .slice(0, 6)
      );
    } else {
      setFilteredRecipes(
        activeButton === "all"
          ? recipes
          : recipes.filter((recipe) => recipe.isFavorite)
      );
    }
  }, [searchString, activeButton, recipes]);

  function handleSearch(e) {
    setSearchString(e.target.value.trim());
  }


  return (
    <div className="show-modal" id="myrecipes">
      {displayRecipe && (
        <DisplayRecipeComponent
          {...recipeDetails}
          setDisplayRecipe={setDisplayRecipe}
          setRecipeDetails={setRecipeDetails}

        />
      )}
      {!displayRecipe && (
        <main className="main-display">
          <ArrowLeft
            onClick={() => setActiveModal(null)}
            className="back-btn"
          />
          <header className="main-header">
            <h1>My Recipes</h1>
          </header>

          {recipes.length > 0 && (
            <div className="search-container">
              <Search className="search-icon" />
              <input
                onChange={(e) => handleSearch(e)}
                type="text"
                placeholder="Search recipes by name..."
              />
            </div>
          )}

          {recipes.length > 0 && (
            <div className="toggle-fav-buttons">
              <button
                onClick={() => setActiveButton("all")}
                className={`recipe-button ${
                  activeButton === "all" ? "active-all" : ""
                }`}
              >
                All Recipes
              </button>

              <button
                onClick={() => setActiveButton("fav")}
                className={`recipe-button ${
                  activeButton === "fav" ? "active-fav" : ""
                }`}
              >
                Favorites
              </button>
            </div>
          )}
          <section className="recipes-container">
            {filteredRecipes.length > 0 ? (
              recipeCardsElements
            ) : searchString.length > 0 ? (
              <div className="recipes-not-found">
                <img
                  className="no-results-icon"
                  src={`${API_URL}/images/magnifying-glass.png`}
                  alt="search icon"
                />
                <p className="no-results-text">No matching recipes found.</p>
                <p className="no-results-suggestion">
                  Try searching with a different keyword.
                </p>
              </div>
            ) : activeButton === "fav" && recipes.length > 0 ? (
              <div className="recipes-not-found">
                <img
                  className="no-results-icon"
                  src={`${API_URL}/images/no-favorite.png`}
                  alt="favorite icon"
                />
                <p className="no-results-text">No favorite recipes found.</p>
                <p className="no-results-suggestion">
                  Try adding recipes to your favorites.
                </p>
              </div>
            ) : (
              <div className="recipes-not-found">
                <img
                  className="no-results-icon"
                  src={`${API_URL}/images/no-recipe-found.png`}
                  alt="search icon"
                />
                <p className="no-results-text">
                  No recipes available at this time.
                </p>
                <p className="no-results-suggestion">
                  Try adding a new recipe.
                </p>
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  );
}
const recipePropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  prepTime: PropTypes.string.isRequired,
  cookTime: PropTypes.string.isRequired,
  servings: PropTypes.number.isRequired,
  ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
  instructions: PropTypes.arrayOf(PropTypes.string).isRequired,
  message: PropTypes.string.isRequired,
  isFavorite: PropTypes.bool.isRequired,
});
MyrecipesModal.propTypes = {
  recipes: PropTypes.arrayOf(recipePropType).isRequired,
  setRecipes: PropTypes.func.isRequired,
  setActiveModal: PropTypes.func.isRequired,
};
