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
}) {
  const [activeLoginModal, setActiveLoginModal] = useState("welcomeStep");
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [emailConfirmed, setEmailConfirmed] = useState(false);

  return (
    <section className="form">
      <FeedBack
        message={feedbackMessage}
        isSuccessful={feedbackSuccessful}
        hasFeedback={hasFeedback}
      />
      <LoginNav />
      <LoginWelcome
        activeLoginModal={activeLoginModal}
        setActiveLoginModal={setActiveLoginModal}
      />
      <LoginName
        activeLoginModal={activeLoginModal}
        setActiveLoginModal={setActiveLoginModal}
        signupData={signupData}
        setSignupData={setSignupData}
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
        emailConfirmed={emailConfirmed}
        setEmailConfirmed={setEmailConfirmed}
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
        signupData={signupData}
        setSignupData={setSignupData}
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
    </section>
  );
}
LoginModal.propTypes = {
  showLoginModal: PropTypes.bool.isRequired,
  setShowLoginModal: PropTypes.func.isRequired,
  submiting: PropTypes.bool.isRequired,
  setSubmiting: PropTypes.func.isRequired,
  feedbackSuccessful: PropTypes.bool.isRequired,
  setFeedbackSuccessful: PropTypes.func.isRequired,
  feedbackMessage: PropTypes.string.isRequired,
  setFeedbackMessage: PropTypes.func.isRequired,
  hasFeedback: PropTypes.bool.isRequired,
  setHasFeedback: PropTypes.func.isRequired,
};


