import PropTypes from "prop-types";
import { useState } from "react";

export default function LoginOtp({
  activeLoginModal,
  setActiveLoginModal,
  setEmailConfirmed,
  submiting,
  setSubmiting,
  setFeedbackSuccessful,
  setFeedbackMessage,
  setHasFeedback,
  signupData,
}) {
  const [otp, setOtp] = useState("");
  const [recieveOtp, setRecievedOtp] = useState(true);
  const [resendingOtp, setResendingOtp] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  let countdownInterval = null;
  function navigatePassword(e) {
    e.preventDefault();
    setActiveLoginModal("passwordStep");
  }
  function handleOtpInput(e) {
    setOtp(e.target.value);
  }
  function startOtpTimer() {
    setRecievedOtp(false);
    setResendingOtp(true);
    setTimeLeft(30);
    countdownInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdownInterval);
          setRecievedOtp(true);
          setResendingOtp(false)
        }
        return prevTime - 1;
      });
    }, 1000);
  }
  function handleResendOtp() {
    startOtpTimer()
  }
  function handleOtpValidation(e) {
    e.preventDefault();
    setSubmiting(true);
    setTimeout(() => {
      setSubmiting(false);
      if (validOtp(otp)) {
        setEmailConfirmed(true);
        setOtp("");
        navigatePassword(e);
      } else {
        setHasFeedback(true);
        setFeedbackMessage("Invalid otp");
        setFeedbackSuccessful(false);
        setTimeout(() => {
          setHasFeedback(false);
          setFeedbackMessage("");
        }, 2000);
      }
    }, 1000);
  }
  function validOtp(otp) {
    return otp === "0000";
  }
  return (
    <section
      className={`step ${activeLoginModal === "otpStep" ? "active" : ""}`}
      aria-labelledby="otp-step-header"
    >
      <header id="otp-step-header" className="text-center">
        <h2 className="subtitle">Verify Your Email</h2>
        <p className="description">
          Enter the verification code sent to{" "}
          <strong>{signupData.email}</strong>
        </p>
      </header>
      <form aria-label="OTP input form">
        <div className="input-container">
          <i className="fa-solid fa-shield-halved left"></i>
          <input
            onChange={handleOtpInput}
            type="text"
            placeholder="Enter 4-digit code"
            maxLength="4"
            pattern="[0-9]*"
            inputMode="numeric"
            aria-label="OTP input"
          />
        </div>
        <p className="helper-text resend-text">
          Didn&apos;t receive the code?{" "}
          <button
            onClick={handleResendOtp}
            type="button"
            className="text-button"
            aria-label="Resend OTP"
            disabled={resendingOtp}
          >
            Resend Code
          </button>
          <span className={recieveOtp ? "hidden" : ""}>
            (<span>{timeLeft}</span>s)
          </span>
        </p>
        <button
          onClick={handleOtpValidation}
          className="primary-button"
          disabled={otp.length < 4}
          aria-label="Verify button"
        >
          {submiting ? "Verifying..." : "verify"}
        </button>
      </form>
    </section>
  );
}

LoginOtp.propTypes = {
  activeLoginModal: PropTypes.string.isRequired,
  setActiveLoginModal: PropTypes.func.isRequired,
  emailConfirmed: PropTypes.bool.isRequired,
  setEmailConfirmed: PropTypes.func.isRequired,
  submiting: PropTypes.bool.isRequired,
  setSubmiting: PropTypes.func.isRequired,
  setFeedbackSuccessful: PropTypes.func.isRequired,
  setFeedbackMessage: PropTypes.func.isRequired,
  setHasFeedback: PropTypes.func.isRequired,
  signupData: PropTypes.shape({
    email: PropTypes.string.isRequired,
    password: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};
