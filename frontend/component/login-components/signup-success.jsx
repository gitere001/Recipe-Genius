import PropTypes from "prop-types";
import { Smile } from "lucide-react";

export default function SignupSuccess({
  setActiveLoginModal,
  signupData,
  activeLoginModal,
  setSignupData,
}) {
  function handleNavigateToLogin() {
    setSignupData((prev) => ({
      ...prev,
      name: "",
    }));
    setActiveLoginModal("signinStep");
  }

  return (
    <section
      className={`step ${
        activeLoginModal === "signUpSuccessStep" ? "active" : ""
      }`}
      aria-labelledby="signup-success-step-header"
    >
      <div className="icon-container">
        <Smile />{" "}
      </div>
      <header id="signup-success-step-header" className="finish">
        <h2 className="subtitle">
          Welcome, Chef <span>{signupData.name}</span>! 🎉
        </h2>
      </header>
      <p className="description">
        You&apos;ve successfully signed up! Log in now and start exploring a
        world of culinary delights.
      </p>
      <button
        onClick={handleNavigateToLogin}
        className="primary-button"
        aria-label="Back to login button"
      >
        Back to Login
      </button>
    </section>
  );
}

SignupSuccess.propTypes = {
  setActiveLoginModal: PropTypes.func.isRequired,
  activeLoginModal: PropTypes.string.isRequired,
  setSignupData: PropTypes.func.isRequired,
  signupData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }).isRequired,
};
