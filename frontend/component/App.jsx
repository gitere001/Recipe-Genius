import Header from "./header";
import Main from "./home";
import Modal from "./Modal";
import { useState, useEffect } from "react";
import LoginModal from "./login";
import { createPortal } from "react-dom";
export default function App() {
  const [activeModal, setActiveModal] = useState(null);

  const [showOverlay, setShowOverlay] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [submiting, setSubmiting] = useState(false);
  const [feedbackSuccessful, setFeedbackSuccessful] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [hasFeedback, setHasFeedback] = useState(false);
  const [activeLoginModal, setActiveLoginModal] = useState("welcomeStep");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userProfile, setUserProfile] = useState({});
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/refresh-token",
          {
            method: "POST",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (data.success) {
          setIsAuthenticated(true);
          fetchUserProfile();
          fetchRecipes()
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    }

    checkAuthStatus();
  }, []);


  async function fetchUserProfile() {
    try {
      const response = await fetch("http://localhost:5000/api/user-profile", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Send authentication token
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUserProfile(data.user); // Set user profile state
      } else {
        console.error("Error fetching profile:", data.message);
      }
    } catch (error) {
      console.error("Fetch Profile Error:", error);
    }
  }
  async function fetchRecipes() {
    try {
      const response = await fetch("http://localhost:5000/recipes.json")
      const data = await response.json()
      if (Array.isArray(data)) {
        setRecipes(data);
        console.log("data is a valid array of length: ", data.length);

      } else {
        setRecipes([])

        console.error("data is not an array", data);
      }

    } catch (error) {
      setRecipes([])

      console.log("error while fetching recipes", error);

    }

  }

  return (
    <>
      {createPortal(
        <div
          className={`login-signup-modal ${
            showLoginModal && !isAuthenticated ? "" : "hidden"
          }`}
        >
          <LoginModal
            showLoginModal={showLoginModal}
            setShowLoginModal={setShowLoginModal}
            submiting={submiting}
            setSubmiting={setSubmiting}
            feedbackSuccessful={feedbackSuccessful}
            setFeedbackSuccessful={setFeedbackSuccessful}
            feedbackMessage={feedbackMessage}
            setFeedbackMessage={setFeedbackMessage}
            hasFeedback={hasFeedback}
            setHasFeedback={setHasFeedback}
            activeLoginModal={activeLoginModal}
            setActiveLoginModal={setActiveLoginModal}
            fetchUserProfile={fetchUserProfile} // Pass fetchUserProfile
            setIsAuthenticated={setIsAuthenticated} // Pass setIsAuthenticated
          />
        </div>,
        document.body
      )}

      <Header
        setActiveModal={setActiveModal}
        setShowOverlay={setShowOverlay}
        chefName={userProfile.name}
      />
      <Modal
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        showOverlay={showOverlay}
        setShowOverlay={setShowOverlay}
        submiting={submiting}
        setSubmiting={setSubmiting}
        feedbackSuccessful={feedbackSuccessful}
        setFeedbackSuccessful={setFeedbackSuccessful}
        feedbackMessage={feedbackMessage}
        setFeedbackMessage={setFeedbackMessage}
        hasFeedback={hasFeedback}
        setHasFeedback={setHasFeedback}
        setShowLoginModal={setShowLoginModal}
        setActiveLoginModal={setActiveLoginModal}
        setIsAuthenticated={setIsAuthenticated}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        recipes={recipes}
        setRecipes={setRecipes}


      />

      <Main />
    </>
  );
}
