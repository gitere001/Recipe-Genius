import { useState } from "react";
import PropTypes from "prop-types";
import { API_URL } from "../../config";

export default function LoginSignIN({
  activeLoginModal,
  setActiveLoginModal,
  setSubmiting,
  setFeedbackSuccessful,
  setFeedbackMessage,
  setHasFeedback,
  submiting,
  loginData,
  setLoginData,
  fetchUserProfile,
  setIsAuthenticated,
  fetchRecipes
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  function navigateSuccess() {
    setActiveLoginModal("successStep");
  }

  function togglePasswordVisibility() {
    setPasswordVisible((prev) => !prev);
  }

  function navigateForgetPassword() {
    setActiveLoginModal("forgetPasswordStep");
    setLoginData((prev) => ({ ...prev, password: "" }));
  }

  function handleInputChange(e, fieldName) {
    const value = e.target.value.trim();
    setLoginData((prev) => {
      return { ...prev, [fieldName]: value };
    });
  }

  function showFeedbackMessage(message, success = false) {
    setHasFeedback(true);
    setFeedbackSuccessful(success);
    setFeedbackMessage(message);
    setTimeout(() => {
      setHasFeedback(false);
      setFeedbackMessage("");
    }, 2000);
  }

  async function handleLoginUser(e) {
    e.preventDefault();
    setSubmiting(true);
    try {
      const response = await fetch(`${API_URL}/api/loginuser`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSubmiting(false);
        setLoginData({
          email: "",
          password: "",
        });
        setIsAuthenticated(true);
        await fetchUserProfile();
        await fetchRecipes();
        navigateSuccess();
      } else {
        setSubmiting(false);
        showFeedbackMessage(data.message, false);
      }
    } catch (error) {
      console.log("error while logging in", error);
      setSubmiting(false);
      showFeedbackMessage("Internal server Error", false);
    }
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  return (
    <section
      className={`step ${activeLoginModal === "signinStep" ? "active" : ""}`}
      aria-labelledby="login-step-header"
    >
      <header id="login-step-header" className="text-center">
        <h2 className="subtitle">Welcome Back!</h2>
        <p className="description">
          Let&apos;s get you back to creating delicious recipes
        </p>
      </header>
      <form id="loginForm" aria-label="Login form">
        <div className="input-container">
          <i className="fa-regular fa-envelope left"></i>
          <input
            onChange={(e) => handleInputChange(e, "email")}
            type="email"
            placeholder="Enter your email"
            aria-label="Login email input"
            value={loginData.email}
          />
        </div>
        <div className="input-container">
          <i className="fa-solid fa-lock left"></i>
          <input
            onChange={(e) => handleInputChange(e, "password")}
            type={passwordVisible ? "text" : "password"}
            placeholder="Enter your password"
            aria-label="Login password input"
            value={loginData.password}
          />
          <i
            onClick={togglePasswordVisibility}
            className={`fa-regular ${
              passwordVisible ? "fa-eye-slash" : "fa-eye"
            } right`}
            id="loginPasswordToggleIcon"
            aria-label="Toggle login password visibility"
          ></i>
        </div>
        <p className="helper-text forgot-password">
          <a
            href="#"
            onClick={navigateForgetPassword}
            className="text-button"
            aria-label="Forgot Password link"
          >
            Forgot Password?
          </a>
        </p>
        <button
          onClick={handleLoginUser}
          className="primary-button"
          id="loginSubmitButton"
          disabled={
            !isValidEmail(loginData.email) || loginData.password.length < 8
          }
          aria-label="Log In button"
        >
          {submiting ? "Logging in..." : "Log In"}
        </button>
      </form>
    </section>
  );
}

LoginSignIN.propTypes = {
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
  fetchUserProfile: PropTypes.func.isRequired,
  setIsAuthenticated: PropTypes.func.isRequired,
  fetchRecipes: PropTypes.func.isRequired,
};
