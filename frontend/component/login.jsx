import LoginWelcome from "./login-components/login-welcome";
import LoginName from "./login-components/login-name";
import LoginNav from "./login-components/login-nav";
import LoginEmail from "./login-components/login-email";
import LoginOtp from "./login-components/login-otp";
import LoginPassword from "./login-components/login-password";
import LoginSuccess from "./login-components/login-success";
import LoginSignIN from "./login-components/login-signin";
import LoginForgetPassword from "./login-components/login-forget-password";
import LoginReset from "./login-components/login-reset";
import "./components-styles/login.css";
import PropTypes from "prop-types";
import { useState } from "react";
import FeedBack from "./feedback";
import SignupSuccess from "./login-components/signup-success";

export default function LoginModal({
  setShowLoginModal,
  submiting,
  setSubmiting,
  feedbackSuccessful,
  setFeedbackSuccessful,
  feedbackMessage,
  setFeedbackMessage,
  hasFeedback,
  setHasFeedback,
  activeLoginModal,
  setActiveLoginModal,
  fetchUserProfile,
  setIsAuthenticated,
  fetchRecipes,
}) {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  return (
    <section className="form">
      <FeedBack
        message={feedbackMessage}
        isSuccessful={feedbackSuccessful}
        hasFeedback={hasFeedback}
      />
      {activeLoginModal !== "welcomeStep" &&
        activeLoginModal !== "signUpSuccessStep" &&
        activeLoginModal !== "successStep" && (
          <LoginNav
            activeLoginModal={activeLoginModal}
            setActiveLoginModal={setActiveLoginModal}
          />
        )}

      <LoginWelcome
        activeLoginModal={activeLoginModal}
        setActiveLoginModal={setActiveLoginModal}
      />
      <LoginName
        activeLoginModal={activeLoginModal}
        setActiveLoginModal={setActiveLoginModal}
        signupData={signupData}
        setSignupData={setSignupData}
        submiting={submiting}
        setSubmiting={setSubmiting}
        setFeedbackSuccessful={setFeedbackSuccessful}
        setFeedbackMessage={setFeedbackMessage}
        setHasFeedback={setHasFeedback}
      />
      <LoginEmail
        activeLoginModal={activeLoginModal}
        setActiveLoginModal={setActiveLoginModal}
        signupData={signupData}
        setSignupData={setSignupData}
        submiting={submiting}
        setSubmiting={setSubmiting}
        feedbackSuccessful={feedbackSuccessful}
        setFeedbackSuccessful={setFeedbackSuccessful}
        feedbackMessage={feedbackMessage}
        setFeedbackMessage={setFeedbackMessage}
        hasFeedback={hasFeedback}
        setHasFeedback={setHasFeedback}
      />
      <LoginOtp
        activeLoginModal={activeLoginModal}
        setActiveLoginModal={setActiveLoginModal}
        submiting={submiting}
        setSubmiting={setSubmiting}
        feedbackSuccessful={feedbackSuccessful}
        setFeedbackSuccessful={setFeedbackSuccessful}
        feedbackMessage={feedbackMessage}
        setFeedbackMessage={setFeedbackMessage}
        hasFeedback={hasFeedback}
        setHasFeedback={setHasFeedback}
        signupData={signupData}
      />
      <LoginPassword
        activeLoginModal={activeLoginModal}
        setActiveLoginModal={setActiveLoginModal}
        submiting={submiting}
        setSubmiting={setSubmiting}
        feedbackSuccessful={feedbackSuccessful}
        setFeedbackSuccessful={setFeedbackSuccessful}
        feedbackMessage={feedbackMessage}
        setFeedbackMessage={setFeedbackMessage}
        hasFeedback={hasFeedback}
        setHasFeedback={setHasFeedback}
        signupData={signupData}
        setSignupData={setSignupData}
      />
      <LoginSuccess
        activeLoginModal={activeLoginModal}
        setShowLoginModal={setShowLoginModal}
        setActiveLoginModal={setActiveLoginModal}
      />
      <LoginSignIN
        activeLoginModal={activeLoginModal}
        setActiveLoginModal={setActiveLoginModal}
        submiting={submiting}
        setSubmiting={setSubmiting}
        setFeedbackSuccessful={setFeedbackSuccessful}
        setFeedbackMessage={setFeedbackMessage}
        setHasFeedback={setHasFeedback}
        loginData={loginData}
        setLoginData={setLoginData}
        fetchUserProfile={fetchUserProfile}
        setIsAuthenticated={setIsAuthenticated}
        fetchRecipes={fetchRecipes}
      />
      <LoginForgetPassword
        activeLoginModal={activeLoginModal}
        setActiveLoginModal={setActiveLoginModal}
        submiting={submiting}
        setSubmiting={setSubmiting}
        setHasFeedback={setHasFeedback}
        setFeedbackMessage={setFeedbackMessage}
        setFeedbackSuccessful={setFeedbackSuccessful}
        loginData={loginData}
        setLoginData={setLoginData}
      />
      <LoginReset
        activeLoginModal={activeLoginModal}
        setActiveLoginModal={setActiveLoginModal}
        loginData={loginData}
        setLoginData={setLoginData}
      />
      <SignupSuccess
        setActiveLoginModal={setActiveLoginModal}
        signupData={signupData}
        activeLoginModal={activeLoginModal}
        setSignupData={setSignupData}
      />
    </section>
  );
}

LoginModal.propTypes = {
  submiting: PropTypes.bool.isRequired,
  setSubmiting: PropTypes.func.isRequired,
  feedbackSuccessful: PropTypes.bool.isRequired,
  setFeedbackSuccessful: PropTypes.func.isRequired,
  feedbackMessage: PropTypes.string.isRequired,
  setFeedbackMessage: PropTypes.func.isRequired,
  hasFeedback: PropTypes.bool.isRequired,
  setHasFeedback: PropTypes.func.isRequired,
  activeLoginModal: PropTypes.string.isRequired,
  setActiveLoginModal: PropTypes.func.isRequired,
  fetchUserProfile: PropTypes.func.isRequired,
  setIsAuthenticated: PropTypes.func.isRequired,
  fetchRecipes: PropTypes.func.isRequired,
  setShowLoginModal: PropTypes.func.isRequired,
};
