import AddIngriForm from "./form";
import Introduction from "./introduction";
import RecipeGenerationAnimation from "./animation";
import { useState, useEffect } from "react";
import RecipeComponent from "./recipe";
import "./components-styles/home.css";
export default function Main() {
  const [showAnimation, SetShowAnimation] = useState(false);
  const [displayRecipe, setDisplayRecipe] = useState(false);
  const [recommendedRecipe, setRecommendedRecipe] = useState({});

  const [ingridients, setIngridients] = useState([]);

  function handleShowAnimation() {
    SetShowAnimation(true);
  }
  function handleHideAnimation() {
    SetShowAnimation(false);
  }
  useEffect(() => {
    console.log("Updated recommended recipe state:", recommendedRecipe);
  }, [recommendedRecipe]); // This will trigger when recommendedRecipe is updated

  return (
    <>
      {displayRecipe && (
        <RecipeComponent
          {...recommendedRecipe ?? {}}
          setDisplayRecipe={setDisplayRecipe}
          setIngridients={setIngridients}
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
          />
        </main>
      )}
    </>
  );
}
