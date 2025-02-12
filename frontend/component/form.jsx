import { Plus, Trash2 } from "lucide-react";
import { useWindowWidth } from "./responsive";
import "./components-styles/form.css";
import PropTypes from "prop-types";
import { API_URL } from "../config";

export default function AddIngriForm({
  showAnimation,
  handleShowAnimation,
  SetShowAnimation,
  ingridients,
  setIngridients,
  setDisplayRecipe,
  setRecommendedRecipe,
  userProfile,
}) {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= 768;


  async function getRecipe() {
    handleShowAnimation();
    const preferencesData = {
      dietPreferences: userProfile.dietaryPreferences,
      allergyList: userProfile.allergies,
    };

    try {
      const response = await fetch(
        `${API_URL}/api/generate-recipe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ingredients: ingridients,
            preferences: preferencesData,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      if (!data.success || !data.data) {
        throw new Error("Invalid response format from server");
      }

      const recipe = data.data;

      const requiredFields = [
        "title",
        "prepTime",
        "cookTime",
        "servings",
        "ingredients",
        "instructions",
        "message",
      ];

      const missingFields = requiredFields.filter((field) => !recipe[field]);
      if (missingFields.length > 0) {
        throw new Error(
          `Missing required recipe fields: ${missingFields.join(", ")}`
        );
      }

      setRecommendedRecipe({
        title: recipe.title,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        message: recipe.message,
      });
      setDisplayRecipe(true);
    } catch (error) {
      console.error("Recipe generation failed:", error);
    } finally {
      SetShowAnimation(false);
    }
  }

  const ingridientElements = ingridients.map((ingridient, index) => {
    return (
      <span className="ingridient" key={index}>
        {ingridient}{" "}
        <i
          onClick={() => removeIngridient(index)}
          className="fa-solid fa-x remove"
        ></i>
      </span>
    );
  });

  function handleAddItem(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newIngridient = formData.get("ingridient");
    if (newIngridient.trim()) {
      setIngridients((prevIngridients) => {
        return [...prevIngridients, formData.get("ingridient")];
      });
      form.reset();
    }
  }

  function removeIngridient(indexToRemove) {
    setIngridients((prevIngridient) => {
      return prevIngridient.filter((_, index) => index !== indexToRemove);
    });
  }

  function clearAll() {
    setIngridients([]);
  }

  return (
    <>
      <section
        className={`add-ingridients-container ${showAnimation ? "hidden" : ""}`}
      >
        <form className="add-ingridients" onSubmit={handleAddItem}>
          <input
            type="text"
            placeholder="e.g. Oregano"
            name="ingridient"
            maxLength={40}
          />
          <button>
            <Plus className="w-5 h-5 mr-2" />
            {isMobile ? "" : "Add Ingridients"}
          </button>
        </form>
        <section className="ingridients-container">
          {ingridients.length > 0 ? (
            <h2>
              Ingridients At Hand{" "}
              <span onClick={clearAll} className="clear-all">
                <Trash2 className="w-3 h-3" />{" "}
                {isMobile ? "clear" : "Clear All"}
              </span>
            </h2>
          ) : null}
          <div className="ingridient-card">{ingridientElements}</div>
        </section>
      </section>
      {ingridients.length > 0 && !showAnimation ? (
        <section className="get-recipe-container">
          <p>
            Ready to discover a delicious recipe with your {ingridients.length}{" "}
            ingredient
            {ingridients.length === 1 ? "" : "s"}?
          </p>
          <button
            onClick={getRecipe}
            className={`get-recipe-btn ${
              ingridients.length < 4 ? "disabled" : ""
            }`}
          >
            Generate Recipe
          </button>
        </section>
      ) : null}
    </>
  );
}

AddIngriForm.propTypes = {
  showAnimation: PropTypes.bool.isRequired,
  handleShowAnimation: PropTypes.func.isRequired,
  SetShowAnimation: PropTypes.func.isRequired,
  ingridients: PropTypes.arrayOf(PropTypes.string).isRequired,
  setIngridients: PropTypes.func.isRequired,
  setDisplayRecipe: PropTypes.func.isRequired,
  setRecommendedRecipe: PropTypes.func.isRequired,
  recommendedRecipe: PropTypes.object.isRequired,
  userProfile: PropTypes.shape({
    dietaryPreferences: PropTypes.arrayOf(PropTypes.string),
    allergies: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};
