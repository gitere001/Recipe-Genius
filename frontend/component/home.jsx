import AddIngriForm from "./form";
import Introduction from "./introduction";
import RecipeGenerationAnimation from "./animation";
import { useState } from "react";
import RecipeComponent from "./recipe";
import "./components-styles/home.css";
import PropTypes from "prop-types";

export default function Main({ setRecipes, userProfile }) {
  const [showAnimation, SetShowAnimation] = useState(false);
  const [recommendedRecipe, setRecommendedRecipe] = useState({});
  const [ingridients, setIngridients] = useState([]);
  const [displayRecipe, setDisplayRecipe] = useState(false);

  function handleShowAnimation() {
    SetShowAnimation(true);
  }

  function handleHideAnimation() {
    SetShowAnimation(false);
  }

  return (
    <>
      {displayRecipe && (
        <RecipeComponent
          {...(recommendedRecipe ?? {})}
          setDisplayRecipe={setDisplayRecipe}
          setIngridients={setIngridients}
          setRecipes={setRecipes}
        />
      )}
      {!displayRecipe && (
        <main className="home-main">
          <RecipeGenerationAnimation
            showAnimation={showAnimation}
            handleHideAnimation={handleHideAnimation}
            setIngridients={setIngridients}
          />
          <Introduction showAnimation={showAnimation} />
          <AddIngriForm
            showAnimation={showAnimation}
            handleShowAnimation={handleShowAnimation}
            SetShowAnimation={SetShowAnimation}
            ingridients={ingridients}
            setIngridients={setIngridients}
            setDisplayRecipe={setDisplayRecipe}
            setRecommendedRecipe={setRecommendedRecipe}
            recommendedRecipe={recommendedRecipe}
            userProfile={userProfile}
          />
        </main>
      )}
    </>
  );
}

Main.propTypes = {
  setRecipes: PropTypes.func.isRequired,
};
