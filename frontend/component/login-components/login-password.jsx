import PropTypes from "prop-types";
export default function LoginPassword({
  activeLoginModal,
  setActiveLoginModal,

  signupData,
  setSignupData,
}) {
  function navigateName(e) {
    e.preventDefault()
    setActiveLoginModal("nameStep");
  }

  return (
    <section
      className={`step ${activeLoginModal === "passwordStep" ? "active" : ""}`}
      aria-labelledby="password-step-header"
    >
      <header id="password-step-header" className="text-center">
        <h2 className="subtitle">Create a password</h2>
        <p className="description">
          Make it strong to keep your account secure
        </p>
      </header>
      <form aria-label="Password creation form">
        <div className="input-container">
          <i className="fa-solid fa-lock left"></i>
          <input
            onChange={(e) =>
              setSignupData((prev) => ({ ...prev, password: e.target.value }))
            }
            type="password"
            id="passwordInput"
            value={signupData.password}
            placeholder="Enter your password"
            aria-label="Password input"
          />
          <i
            className="fa-regular fa-eye right toggle-password"
            id="passwordToggleIcon"
            aria-label="Toggle password visibility"
          ></i>
        </div>
        <p className="helper-text">
          Use at least 8 characters, including numbers and symbols
        </p>
        <button
          onClick={navigateName}
          className={"primary-button"}
          id="passwordNextButton"
          disabled={signupData.password.length < 8}
          aria-label="Finish button"
        >
          Next
        </button>
      </form>
    </section>
  );
}

LoginPassword.propTypes = {
  activeLoginModal: PropTypes.string.isRequired,
  setActiveLoginModal: PropTypes.func.isRequired,
  submiting: PropTypes.bool.isRequired,
  setSubmiting: PropTypes.func.isRequired,
  feedbackSuccessful: PropTypes.bool.isRequired,
  setFeedbackSuccessful: PropTypes.func.isRequired,
  feedbackMessage: PropTypes.string.isRequired,
  setFeedbackMessage: PropTypes.func.isRequired,
  hasFeedback: PropTypes.bool.isRequired,
  setHasFeedback: PropTypes.func.isRequired,
  signupData: PropTypes.shape({
    password: PropTypes.string.isRequired,
  }).isRequired,
  setSignupData: PropTypes.func.isRequired,
};
