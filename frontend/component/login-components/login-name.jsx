import PropTypes from "prop-types";
import { useEffect } from "react";
export default function LoginName({
  activeLoginModal,
  setActiveLoginModal,
  signupData,
  setSignupData,
  setSubmiting,
  setFeedbackSuccessful,
  setFeedbackMessage,
  setHasFeedback,
  submiting,
}) {
  function navigateSuccess() {

    setSignupData((prev) => ({
      ...prev,
      email: "",
      password: "",
    }));
    setActiveLoginModal("signUpSuccessStep");
  }

  async function registerNewUser(e) {
    e.preventDefault()
    setSubmiting(true);
    try {
      const response = await fetch("http://localhost:5000/api/registeruser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmiting(false);

        navigateSuccess();
      } else {
        setSubmiting(false);
        setHasFeedback(true);
        setFeedbackMessage(data.message);
        setFeedbackSuccessful(false);
        setTimeout(() => {
          setHasFeedback(false);
          setFeedbackMessage("");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setSubmiting(false);
      setHasFeedback(true);
      setFeedbackMessage("Internal Server Error");
      setFeedbackSuccessful(false);
      setTimeout(() => {
        setHasFeedback(false);
        setFeedbackMessage("");
      }, 2000);
    }
  }

  return (
    <section
      className={`step ${activeLoginModal === "nameStep" ? "active" : ""}`}
      aria-labelledby="name-step-header"
    >
      <header id="name-step-header" className="text-center">
        <h2 className="subtitle">What&apos;s your name?</h2>
        <p className="description">
          We&apos;ll use this to personalize your experience and refer to you as
          (Chef [Your Name]);
          <br />
          <span className="hint">
            (Tip: You can always change your name later)
          </span>
        </p>
      </header>

      <form aria-label="Name input form">
        <div className="input-container">
          <i className="fa-regular fa-user left"></i>
          <input
            onChange={(e) =>
              setSignupData((prev) => ({
                ...prev,
                name: e.target.value.trim(),
              }))
            }
            value={signupData.name}
            type="text"
            id="nameInput"
            placeholder="Enter your name"
            maxLength={15}
            aria-label="Name input"
          />
        </div>
        <button
          onClick={(e) => registerNewUser(e)}
          className="primary-button"
          id="nameNextButton"
          disabled={signupData.name.length < 1}
          aria-label="Next button"
        >
          {submiting ? "submiting..." : "Finish"}
        </button>
      </form>
    </section>
  );
}

LoginName.propTypes = {
  activeLoginModal: PropTypes.string.isRequired,
  setActiveLoginModal: PropTypes.func.isRequired,
  signupData: PropTypes.shape({
    email: PropTypes.string.isRequired,
    password: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  setSignupData: PropTypes.func.isRequired,
};
