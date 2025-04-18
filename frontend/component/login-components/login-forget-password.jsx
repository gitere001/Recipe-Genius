import PropTypes from "prop-types";
import { API_URL } from "../../config";

export default function LoginForgetPassword({
  activeLoginModal,
  setActiveLoginModal,
  setSubmiting,
  submiting,
  setHasFeedback,
  setFeedbackMessage,
  setFeedbackSuccessful,
  loginData,
  setLoginData,
}) {
  function handleInputChange(e) {
    setLoginData((prev) => {
      return { ...prev, email: e.target.value.trim() };
    });
  }
  function navigateLoginPage() {
    setActiveLoginModal("signinStep");
  }
  function navigateResetPassword() {
    setActiveLoginModal("resetPasswordStep");
  }
  function handleErrorFeedback(responseMessage) {
    setSubmiting(false);
    setHasFeedback(true);
    setFeedbackSuccessful(false);
    setFeedbackMessage(responseMessage);

    setTimeout(() => {
      setHasFeedback(false);
      setFeedbackMessage("");
    }, 2000);
  }

  async function handleResetpassword(e) {
    e.preventDefault();
    setSubmiting(true);
    try {
      const response = await fetch(`${API_URL}/api/send-reset-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: loginData.email }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmiting(false);
        navigateResetPassword();
      } else {
        handleErrorFeedback(data.message);
      }
    } catch (error) {
      console.log(error);
      handleErrorFeedback("An error occurred");
    }
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  return (
    <section
      className={`step ${
        activeLoginModal === "forgetPasswordStep" ? "active" : ""
      }`}
      id="forgot-password-step"
      aria-labelledby="forgot-password-step-header"
    >
      <header id="forgot-password-step-header" className="text-center">
        <h2 className="subtitle">Reset Password</h2>
        <p className="description">
          Enter your email address to receive password reset instructions
        </p>
      </header>
      <form id="forgotPasswordForm" aria-label="Forgot password form">
        <div className="input-container">
          <i className="fa-regular fa-envelope left"></i>
          <input
            onChange={(e) => handleInputChange(e)}
            type="email"
            name="resetEmail"
            placeholder="Enter your email address"
            aria-label="Reset email input"
            value={loginData.email}
          />
        </div>
        <button
          onClick={(e) => handleResetpassword(e)}
          className="primary-button"
          disabled={!isValidEmail(loginData.email)}
          aria-label="Send Reset Link button"
        >
          {submiting ? "verifying email..." : "Send Reset Link"}
        </button>
      </form>
      <p
        className="helper-text"
        style={{ textAlign: "center", marginTop: "1rem" }}
      >
        Remember your password?{" "}
        <a
          href="#"
          onClick={navigateLoginPage}
          className="text-button"
          id="backToLoginButton"
          aria-label="Back to Login link"
        >
          Back to Login
        </a>
      </p>
    </section>
  );
}

LoginForgetPassword.propTypes = {
  submiting: PropTypes.bool.isRequired,
  activeLoginModal: PropTypes.string.isRequired,
  setActiveLoginModal: PropTypes.func.isRequired,
  setSubmiting: PropTypes.func.isRequired,
  setFeedbackSuccessful: PropTypes.func.isRequired,
  setFeedbackMessage: PropTypes.func.isRequired,
  setHasFeedback: PropTypes.func.isRequired,
  loginData: PropTypes.shape({
    email: PropTypes.string.isRequired,
    password: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  setLoginData: PropTypes.func.isRequired,
};
