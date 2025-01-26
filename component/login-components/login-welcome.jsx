import PropTypes from "prop-types";

export default function LoginWelcome({ activeLoginModal, setActiveLoginModal }) {


  function navigateEmail() {
    setActiveLoginModal("emailStep")
  }
  function navigateSignIn() {
    setActiveLoginModal("signinStep")
  }
  return (
    <section
      className={`step ${activeLoginModal === "welcomeStep" ? "active" : ""}`}
      id="welcome-step"
      aria-labelledby="welcome-step-header"
    >
      <img
        className="recipe-image"
        src="images/cooking.png"
        alt="recipe image"
      />
      <header id="welcome-step-header">
        <h1 className="title">Recipe Genius</h1>
      </header>
      <p className="tagline">Turn ingredients into inspiration</p>
      <div className="features">
        <article
          className="feature"
          aria-label="Feature: List your available ingredients"
        >
          <i className="fa-solid fa-utensils"></i>
          <p>List your available ingredients</p>
        </article>
        <article
          className="feature"
          aria-label="Feature: AI-powered recipe suggestions"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M12 2L9 9 2 12 9 15 12 22 15 15 22 12 15 9z"
              fill="currentColor"
            />
          </svg>
          <p>Get AI-powered recipe suggestions</p>
        </article>
      </div>
      <div className="button-group">
        <button
        onClick={navigateEmail}
          className="primary-button"
          id="primaryBtn"
          aria-label="Get Started"
        >
          Get Started
        </button>
        <button
        onClick={navigateSignIn}
          className="secondary-button"
          id="secondaryBtn"
          aria-label="Log In"
        >
          Log In
        </button>
      </div>
    </section>
  );
}

LoginWelcome.propTypes ={
  activeLoginModal: PropTypes.string.isRequired,
  setActiveLoginModal: PropTypes.func.isRequired
}