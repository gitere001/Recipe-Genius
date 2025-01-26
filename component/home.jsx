import AddIngriForm from "./form";
import Introduction from "./introduction";
import RecipeGenerationAnimation from "./animation";
import { useState } from "react";
import "./components-styles/home.css";
export default function Main() {
  const [showAnimation, SetShowAnimation] = useState(false);
  const [ingridients, setIngridients] = useState([]);

  function handleShowAnimation() {
    SetShowAnimation(true);
  }
  function handleHideAnimation() {
    SetShowAnimation(false);
  }

  return (
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
		ingridients={ingridients}
		setIngridients={setIngridients}
      />
    </main>
  );
}
