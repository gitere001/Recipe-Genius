import { ArrowLeft, X } from "lucide-react";
import FeedBack from "../feedback";
import PropTypes from "prop-types";
import otp from "../useOtp";
import { useState, useRef } from "react";

export default function OtpConfirmationModal({
  handleCloseModal,
  feedbackMessage,
  feedbackSuccessful,
  hasFeedback,
  localDetails,
  submiting,
  setActiveModal,
  setHasFeedback,
  setFeedbackSuccessful,
  setFeedbackMessage,
}) {
  const {
    handleOtpInput,
    startOtpTimer,
    handleResendOtp,
    handleOtpValidation,
  } = otp;

  const [otpValue, setOtpValue] = useState("");
  const [recievedOtp, setRecievedOtp] = useState(true);
  const [resendingOtp, setResendingOtp] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const otpInputRef = useRef(null);

  function handleBackToAccount(e) {
    e.preventDefault();
    setOtpValue("");
    if (otpInputRef.current) {
      otpInputRef.current.value = "";
    }
    setActiveModal("myaccount");
  }

  return (
    <div
      className="menu-modal otp-modal show-modal"
      aria-labelledby="otp-step-header"
    >
      <div className="modal-header">
        <ArrowLeft
          className="back-icon"
          onClick={handleBackToAccount}
          aria-label="Go back to account"
        />
      </div>

      <X
        className="menu-modal-cross otp-verification"
        onClick={handleCloseModal}
      />

      <FeedBack
        message={feedbackMessage}
        isSuccessful={feedbackSuccessful}
        hasFeedback={hasFeedback}
      />

      <header id="otp-step-header" className="text-center">
        <h2 className="subtitle">Verify Your Email</h2>
        <p className="description">
          Enter the verification code sent to{" "}
          <strong>{localDetails?.email || "your email"}</strong>
        </p>
      </header>

      <form aria-label="OTP input form">
        <div className="input-container">
          <i className="fa-solid fa-shield-halved left"></i>
          <input
             onChange={(e) => handleOtpInput(e, setOtpValue)}
            ref={otpInputRef}
            type="text"
            placeholder="Enter 4-digit code"
            maxLength="4"
            pattern="[0-9]*"
            inputMode="numeric"
            aria-label="OTP input"
            value={otpValue}
          />
        </div>

        <p className="helper-text resend-text">
          Didn&apos;t receive the code?{" "}
          <button
            onClick={() =>
              handleResendOtp(
                startOtpTimer,
                setRecievedOtp,
                setResendingOtp,
                setTimeLeft,
                localDetails,
                setHasFeedback,
                setFeedbackSuccessful,
                setFeedbackMessage
              )
            }
            type="button"
            className="text-button"
            aria-label="Resend OTP"
            disabled={resendingOtp}
          >
            Resend Code
          </button>
          <span className={recievedOtp ? "hidden" : ""}>
            (<span>{timeLeft}</span>s)
          </span>
        </p>

        <button
          onClick={(e) =>
            handleOtpValidation(
              e,
              otpValue,
              setActiveModal,
              localDetails,
              handleCloseModal,
              setOtpValue,
              otpInputRef,
              setHasFeedback,
              setFeedbackSuccessful,
              setFeedbackMessage
            )
          }
          className="primary-button"
          disabled={otpValue.length < 4}
          aria-label="Verify button"
        >
          {submiting ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}

OtpConfirmationModal.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
  feedbackMessage: PropTypes.string.isRequired,
  feedbackSuccessful: PropTypes.bool.isRequired,
  hasFeedback: PropTypes.bool.isRequired,
  localDetails: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  submiting: PropTypes.bool.isRequired,
  setActiveModal: PropTypes.func.isRequired,
};
