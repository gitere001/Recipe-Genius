import PropTypes from "prop-types";
export default function LoginEmail({
  activeLoginModal,
  setActiveLoginModal,
  signupData,
  setSignupData,
  submiting,
  setSubmiting,
  setFeedbackSuccessful,
  setFeedbackMessage,
  setHasFeedback,
}) {
  function navigateOtp() {
    setActiveLoginModal("otpStep");
  }
  async function sendCheckExistingEmail() {
    const res = JSON.stringify({
      success: true,
      message: "Valid Email",
    });
    return JSON.parse(res);
  }
  function checkExistingEmail(e) {
    e.preventDefault();
    setSubmiting(true);

    setTimeout(async () => {
      const response = await sendCheckExistingEmail();

      setSubmiting(false);

      if (response.success) {
        navigateOtp();
      } else {
        setHasFeedback(true);
        setFeedbackMessage(response.message);
        setFeedbackSuccessful(false);
        setTimeout(() => {
          setHasFeedback(false);
          setFeedbackMessage("");
        }, 2000);
      }
    }, 1000);
  }
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  return (
    <section
      className={`step ${activeLoginModal === "emailStep" ? "active" : ""}`}
      aria-labelledby="email-step-header"
    >
      <header id="email-step-header" className="text-center">
        <h2 className="subtitle">What&apos;s your email?</h2>
        <p className="description">
          This helps us keep your account secure and assists with account
          recovery
        </p>
      </header>
      <form aria-label="Email input form">
        <div className="input-container">
          <i className="fa-regular fa-envelope left"></i>
          <input
            onChange={(e) =>
              setSignupData((prev) => ({ ...prev, email: e.target.value }))
            }
            value={signupData.email}
            type="email"
            id="emailInput"
            placeholder="Enter your email address"
            aria-label="Email input"
          />
        </div>
        <button
          onClick={checkExistingEmail}
          className="primary-button"
          id="emailNextButton"
          disabled={!isValidEmail(signupData.email)}
          aria-label="Next button"
        >
          {submiting ? "verifying Email..." : "Next"}
        </button>
      </form>
    </section>
  );
}

LoginEmail.propTypes = {
  activeLoginModal: PropTypes.string.isRequired,
  setActiveLoginModal: PropTypes.func.isRequired,
  signupData: PropTypes.shape({
    email: PropTypes.string.isRequired,
    password: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  setSignupData: PropTypes.func.isRequired,
  submiting: PropTypes.bool.isRequired,
  setSubmiting: PropTypes.func.isRequired,
  feedbackSuccessful: PropTypes.bool.isRequired,
  setFeedbackSuccessful: PropTypes.func.isRequired,
  feedbackMessage: PropTypes.string.isRequired,
  setFeedbackMessage: PropTypes.func.isRequired,
  hasFeedback: PropTypes.bool.isRequired,
  setHasFeedback: PropTypes.func.isRequired,
};
