import PropTypes from "prop-types";

export default function LoginReset({
  activeLoginModal,
  setActiveLoginModal,

}) {
  function navigateLoginPage() {
    setActiveLoginModal("signinStep");
  }
  return (
    <section
      className={`step ${
        activeLoginModal === "resetPasswordStep" ? "active" : ""
      }`}
      aria-labelledby="reset-success-step-header"
    >
      <div className="icon-container">
        <i className="fa-regular fa-envelope"></i>
      </div>
      <header id="reset-success-step-header" className="finish">
        <h2 className="subtitle">Check Your Email</h2>
      </header>
      <p className="description">
        Weve sent password reset instructions to your email address. Please
        check your inbox and follow the link to reset your password.
      </p>
      <button
        onClick={navigateLoginPage}
        className="primary-button"
        aria-label="Back to Welcome button"
      >
        Back to Login
      </button>
    </section>
  );
}

LoginReset.propTypes = {
  activeLoginModal: PropTypes.string.isRequired,
  setActiveLoginModal: PropTypes.func.isRequired,
};
