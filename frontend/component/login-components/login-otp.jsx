import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import { API_URL } from "../../config";

export default function LoginOtp({
  activeLoginModal,
  setActiveLoginModal,
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
  const otpInputRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

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
    countdownIntervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdownIntervalRef.current);
          setRecievedOtp(true);
          setResendingOtp(false);
        }
        return prevTime - 1;
      });
    }, 1000);
  }
  async function handleResendOtp() {
    startOtpTimer();
    try {
      const response = await fetch(`${API_URL}/api/resendOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signupData.email,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        // OTP resend failed
        setHasFeedback(true);
        setFeedbackMessage(data.message || "Resend failed");
        setFeedbackSuccessful(false);

        setTimeout(() => {
          setHasFeedback(false);
          setFeedbackMessage("");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setHasFeedback(true);
      setFeedbackMessage("Internal server error");
      setFeedbackSuccessful(false);

      setTimeout(() => {
        setHasFeedback(false);
        setFeedbackMessage("");
      }, 2000);
    }
  }
  async function handleOtpValidation(e) {
    e.preventDefault();
    setSubmiting(true);

    try {
      // Send request to verify OTP
      const response = await fetch(`${API_URL}/api/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signupData.email,
          otp: otp,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // OTP verified successfully
        setOtp("");
        otpInputRef.current.value = "";
        navigatePassword(e); // Proceed to the next step
      } else {
        // OTP verification failed
        setHasFeedback(true);
        setFeedbackMessage(data.message || "Invalid OTP");
        setFeedbackSuccessful(false);

        setTimeout(() => {
          setHasFeedback(false);
          setFeedbackMessage("");
        }, 2000);
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);

      // Handle server or network errors
      setHasFeedback(true);
      setFeedbackMessage("Server error occurred");
      setFeedbackSuccessful(false);

      setTimeout(() => {
        setHasFeedback(false);
        setFeedbackMessage("");
      }, 2000);
    } finally {
      setSubmiting(false);
    }
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
            ref={otpInputRef}
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
