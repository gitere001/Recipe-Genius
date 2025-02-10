import PropTypes from "prop-types";
export default function LoginSuccess({ activeLoginModal, setShowLoginModal }) {

  function handleNavigateHome() {
    setShowLoginModal(false);

  }
  let chefName = null;
  const chefNameData = localStorage.getItem("chefName");
  try {
    chefName = chefNameData ? JSON.parse(chefNameData) : null;
  } catch (error) {
    console.error("Error parsing chefName data:", error);
  }

  return (
    <section
      className={`step ${activeLoginModal === "successStep" ? "active" : ""}`}
      id="success-step"
      aria-labelledby="success-step-header"
    >
      <div className="icon-container">
        <i className="lucide-chef-hat"></i>
      </div>
      <header id="success-step-header" className="finish">
        <h2 className="subtitle">
          You&apos;re all set, Chef <span>{chefName ? chefName : ""}</span>!
        </h2>
      </header>
      <p className="description">
        Time to turn your ingredients into delicious meals
      </p>
      <button
        onClick={handleNavigateHome}
        className="primary-button"
        aria-label="Start cooking button"
      >
        Let&apos;s Get Cooking
      </button>
    </section>
  );
}

LoginSuccess.propTypes = {
  activeLoginModal: PropTypes.string.isRequired,
  setShowLoginModal: PropTypes.func.isRequired,

};
