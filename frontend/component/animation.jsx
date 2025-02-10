import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./components-styles/animation.css";

export default function RecipeGenerationAnimation(props) {
  // Cooking images array
  const cookingImages = [
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=300&h=300",
    "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&q=80&w=300&h=300",
    "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=300&h=300",
    "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?auto=format&fit=crop&q=80&w=300&h=300",
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=300&h=300",
  ];

  // State variables
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [bubbles, setBubbles] = useState([]);

  function handleCancel() {
    const cancelConfirmation = confirm("Are you sure you want to cancel? Your recipe is being crafted")
    if (cancelConfirmation) {
      props.handleHideAnimation()
      props.setIngridients([])

    } else {
      return
    }
  }

  // Set up image rotation
  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % cookingImages.length
      );
    }, 2000);

    return () => clearInterval(imageInterval);
  }, []);

  // Set up progress ring animation
  useEffect(() => {
    if (animationProgress < 100) {
      const progressInterval = setInterval(() => {
        setAnimationProgress((prevProgress) =>
          prevProgress >= 100 ? 100 : prevProgress + 2
        );
      }, 100);

      return () => clearInterval(progressInterval);
    }
  }, [animationProgress]);

  // Create initial bubbles on mount
  useEffect(() => {
    const initialBubbles = Array.from({ length: 15 }, () => ({
      id: Math.random(),
      left: Math.random() * 100,
      size: Math.random() * 16 + 8,
      animationDuration: Math.random() * 2 + 2,
      animationDelay: Math.random() * 2,
    }));

    setBubbles(initialBubbles);
  }, []);

  return (
    props.showAnimation && (
      <div className={"animation-main-container"}>
        <div className="animation-container">
          <img
            className="rotating-image"
            src={cookingImages[currentImageIndex]}
            alt="Cooking"
          />
          <div className="progress-ring-bg"></div>
          <div
            className="progress-ring"
            style={{
              clipPath: `polygon(50% 50%, -50% -50%, ${animationProgress}% -50%, ${animationProgress}% ${animationProgress}%, -50% ${animationProgress}%)`,
            }}
          ></div>
          <div className="bubble-container">
            {bubbles.map((bubble) => (
              <div
                key={bubble.id}
                className="bubble"
                style={{
                  left: `${bubble.left}%`,
                  width: `${bubble.size * 1.5}px`,
                  height: `${bubble.size * 0.6}px`,
                  borderRadius: "50% / 25%",
                  animation: `bubble ${bubble.animationDuration}s ease-in-out ${bubble.animationDelay}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
        <div className="animation-text-container">
          <p className="animation-title">Creating your perfect recipe...</p>
          <p className="animation-subtitle">
            Analyzing ingredients and crafting the perfect combination
          </p>
          <button onClick={handleCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    )
  );
}

RecipeGenerationAnimation.propTypes = {
  showAnimation: PropTypes.bool.isRequired,
  handleHideAnimation: PropTypes.func,
   setIngridients: PropTypes.func.isRequired,
};
