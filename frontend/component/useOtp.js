import { API_URL } from "../config";
function handleOtpInput(e, setOtp) {
  setOtp(e.target.value);
}

function startOtpTimer(setRecievedOtp, setResendingOtp, setTimeLeft) {
  setRecievedOtp(false);
  setResendingOtp(true);
  setTimeLeft(30);
  const countdownInterval = setInterval(() => {
    setTimeLeft((prevTime) => {
      if (prevTime <= 1) {
        clearInterval(countdownInterval);
        setRecievedOtp(true);
        setResendingOtp(false);
      }
      return prevTime - 1;
    });
  }, 1000);
}

async function handleResendOtp(
  startOtpTimer,
  setRecievedOtp,
  setResendingOtp,
  setTimeLeft,
  localDetails,
  setHasFeedback,
  setFeedbackSuccessful,
  setFeedbackMessage
) {
  startOtpTimer(setRecievedOtp, setResendingOtp, setTimeLeft);

  try {
    const response = await fetch(`${API_URL}/api/resendOtp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: localDetails.email,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      setHasFeedback(true);
      setFeedbackMessage("New OTP sent successfully");
      setFeedbackSuccessful(true);

      setTimeout(() => {
        setHasFeedback(false);
        setFeedbackMessage("");
      }, 2000);
    } else {
      setRecievedOtp(true);
      setResendingOtp(false);
      setTimeLeft(30);
      setHasFeedback(true);
      setFeedbackMessage(data.message || "Failed to resend OTP");
      setFeedbackSuccessful(false);

      setTimeout(() => {
        setHasFeedback(false);
        setFeedbackMessage("");
      }, 2000);
    }
  } catch (error) {
    console.error("Resend OTP Error:", error);
    setRecievedOtp(true);
    setResendingOtp(false);
    setTimeLeft(0);
    setHasFeedback(true);
    setFeedbackMessage("Server error occurred");
    setFeedbackSuccessful(false);

    setTimeout(() => {
      setHasFeedback(false);
      setFeedbackMessage("");
    }, 2000);
  }
}
async function handleOtpValidation(
  e,
  otpValue,
  setSubmiting,
  localDetails,
  handleCloseModal,
  setOtpValue,
  otpInputRef,
  setHasFeedback,
  setFeedbackSuccessful,
  setFeedbackMessage,
  setUserProfile
) {
  e.preventDefault();

  if (!otpValue || !localDetails.email) {
    setHasFeedback(true);
    setFeedbackMessage("OTP and email are required");
    setFeedbackSuccessful(false);
    setTimeout(() => {
      setHasFeedback(false);
      setFeedbackMessage("");
    }, 2000);
    return;
  }

  setSubmiting(true);

  try {
    const response = await fetch(`${API_URL}/api/update-email`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Add this if you're using cookies
      body: JSON.stringify({
        email: localDetails.email,
        otp: otpValue,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Extract feedback display logic into a function
    const showFeedback = (message, isSuccessful, shouldClose = false) => {
      setHasFeedback(true);
      setFeedbackMessage(message);
      setFeedbackSuccessful(isSuccessful);

      setTimeout(() => {
        setHasFeedback(false);
        setFeedbackMessage("");
        if (shouldClose) {
          handleCloseModal(e);
        }
      }, 2000);
    };

    if (data.success) {
      console.log(localDetails);
      setUserProfile((prev) => ({
        ...prev,
        email: localDetails.email,
      }));
      // Reset OTP input
      setOtpValue("");
      if (otpInputRef.current) {
        otpInputRef.current.value = "";
      }
      showFeedback("Details updated successfully", true, true);
    } else {
      showFeedback(data.message || "Invalid OTP", false);
    }
  } catch (error) {
    console.error("OTP Verification Error:", error);
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
const otp = {
  handleOtpInput,
  startOtpTimer,
  handleResendOtp,
  handleOtpValidation,
};

export default otp;
