import { X, UserX, Heart, BookOpen, LogOut, ArrowLeft } from "lucide-react";
import Ingredients from "./Ingredients";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import "./components-styles/modal.css";
import FeedBack from "./feedback";
import { useState, useEffect, useRef } from "react";
import otp from "./useOtp";
import { API_URL } from "../config";

import MyrecipesModal from "./navigationItemsComponents/MyrecipesModal";

export default function Modal({
  activeModal,
  setActiveModal,
  showOverlay,
  setShowOverlay,
  submiting,
  setSubmiting,
  feedbackSuccessful,
  setFeedbackSuccessful,
  feedbackMessage,
  setFeedbackMessage,
  hasFeedback,
  setHasFeedback,
  setShowLoginModal,
  setActiveLoginModal,
  setIsAuthenticated,
  userProfile,
  setUserProfile,
  recipes,
  setRecipes,
}) {
  const dietaryPreferencesRef = useRef([]);
  const allergiesRef = useRef([]);
  useEffect(() => {
    if (activeModal === "dietarypreferences") {
      dietaryPreferencesRef.current = [...userProfile.dietaryPreferences];
      allergiesRef.current = [...userProfile.allergies];
    }
  }, [activeModal]);

  const favoriteCount = recipes.filter((recipe) => recipe.isFavorite).length;


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
  const closeIconRef = useRef(null);
  const [localDetails, setLocalDetails] = useState({
    name: userProfile?.name || "",
    email: userProfile?.email || "",
  });

  useEffect(() => {
    setLocalDetails({
      name: userProfile?.name || "",
      email: userProfile?.email || "",
    });
  }, [userProfile]);

  function hanleUserCancellation() {
    setLocalDetails({
      name: userProfile?.name || "",
      email: userProfile?.email || "",
    });
  }
  function handleBackToAccount(e) {
    e.preventDefault();
    setOtpValue("");
    if (otpInputRef.current) {
      otpInputRef.current.value = "";
    }
    setActiveModal("myaccount");
  }
  // Compute a boolean to indicate if the form has changed
  const isFormChanged =
    userProfile.name !== localDetails.name ||
    userProfile.email !== localDetails.email;
  const nameChanged = userProfile.name !== localDetails.name;
  const emailChanged = userProfile.email !== localDetails.email;

  async function handleLogout(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        console.log(data);
        handleCloseModal(e);
        setShowLoginModal(true);
        setIsAuthenticated(false);
        setActiveLoginModal("signinStep");
      } else {
        console.error("Failed to log out:", data.message);
        handleErrorFeedback(data.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
      handleErrorFeedback("Internal Server Error");
    }
  }

  async function handleDeleteAccount(e) {
    e.preventDefault();
    setSubmiting(true);
    try {
      const response = await fetch(`${API_URL}/api/delete-account`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        setHasFeedback(true);
        setFeedbackMessage(data.message);
        setFeedbackSuccessful(true);
        setTimeout(() => {
          setHasFeedback(false);
          setFeedbackMessage("");
          setFeedbackSuccessful(false);

          handleCloseModal(e);

          setShowLoginModal(true);
          setIsAuthenticated(false);
          setActiveLoginModal("welcomeStep");
        }, 2000);
      } else {
        console.error("Failed to delete:", data.message);
        handleErrorFeedback(data.message);
      }
    } catch (error) {
      console.error("Error during deletion:", error);
      handleErrorFeedback("Internal Server Error");
    } finally {
      setSubmiting(false);
    }
  }

  function handleCloseModal(e) {
    const clickedElement = e.target;
    if (!clickedElement) {
      console.error("Event target is null");
      return;
    }

    const isCloseIcon = clickedElement.closest(".menu-modal-cross");
    if (isCloseIcon) {
      setUserProfile((prev) => ({
        ...prev,
        dietaryPreferences: dietaryPreferencesRef.current,
        allergies: allergiesRef.current,
      }));
    }
    if (isCloseIcon && isCloseIcon.closest(".menu-modal-myaccount")) {
      hanleUserCancellation();
    }

    if (e.target === closeIconRef.current) {
      console.log("X icon was clicked - resetting to default values");
      hanleUserCancellation();
    }

    if (isCloseIcon) {
      const closestForm = isCloseIcon.parentElement.nextElementSibling;
      if (closestForm && closestForm.tagName.toLowerCase() === "form") {
        closestForm.reset();
      }
    }

    setOtpValue("");
    setRecievedOtp(true);
    setResendingOtp(false);
    setTimeLeft(30);

    setActiveModal(null);
    setShowOverlay(false);
    setHasFeedback(false);
    setFeedbackMessage("");
    setFeedbackSuccessful(false);
  }

  function handleSuccessFeedback(responseMessage, e, form = null) {
    setSubmiting(false);
    setHasFeedback(true);
    setFeedbackSuccessful(true);
    setFeedbackMessage(responseMessage);

    setTimeout(() => {
      handleCloseModal(e);
      if (form) {
        form.reset();
      }
      setHasFeedback(false);
    }, 2000);
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

  async function handleDietaryUpdate(e) {
    e.preventDefault();
    const dietaryPreferencesData = [];
    const allergiesData = [];
    const dietaryPreferences = document.querySelectorAll(
      'input[name="dietaryPreference"]:checked'
    );
    dietaryPreferences.forEach((checkbox) => {
      dietaryPreferencesData.push(checkbox.value);
    });

    const allergies = document.querySelectorAll(
      'input[name="allergy"]:checked'
    );
    allergies.forEach((checkbox) => {
      allergiesData.push(checkbox.value);
    });

    setSubmiting(true);

    try {
      const response = await fetch(`${API_URL}/api/update-dietary`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json", // Add this header
        },
        body: JSON.stringify({
          dietaryPreferences: dietaryPreferencesData,
          allergies: allergiesData,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setHasFeedback(true);
        setFeedbackMessage(data.message);
        setFeedbackSuccessful(true);
        setTimeout(() => {
          setHasFeedback(false);
          setUserProfile((prev) => ({
            ...prev,
            dietaryPreferences: dietaryPreferencesData,
            allergies: allergiesData,
          }));
          setFeedbackMessage("");
          setFeedbackSuccessful(false);
          handleCloseModal(e);
        }, 2000);
      } else {
        console.error("Failed to update prefereces:", data.message);
        handleErrorFeedback(data.message);
      }
    } catch (error) {
      console.error("Error during deletion:", error);
      handleErrorFeedback("Internal Server Error");
    } finally {
      setSubmiting(false);
    }
  }
  async function handleUpdatePassword(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const dataObject = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [key, value.trim()])
    );

    const { newPassword, confirmPassword, currentPassword } = dataObject;

    if (newPassword !== confirmPassword) {
      setHasFeedback(true);
      setFeedbackSuccessful(false);
      setFeedbackMessage("Passwords do not match.");
      setTimeout(() => {
        setHasFeedback(false);
      }, 2000);
      return;
    }

    setSubmiting(true);

    try {
      const response = await fetch(`${API_URL}/api/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensures cookies (tokens) are sent
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        handleErrorFeedback(
          data.message || "Something happened, try again later."
        );
        return; // ✅ Stops execution if there's an error
      }

      if (data.success) {
        handleSuccessFeedback(data.message, e, form);
      } else {
        handleErrorFeedback(data.message);
      }
    } catch (error) {
      console.error(error.message);
      handleErrorFeedback("Something happened, try again later.");
    }
  }

  async function handleUpdateDetails(e) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const dataObject = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [key, value.trim()])
    );
    const { name, email } = dataObject;

    // Validate inputs
    if (!name) {
      handleErrorFeedback("Name is required");
      return;
    } else if (!email) {
      handleErrorFeedback("Email is required");
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      handleErrorFeedback("Please enter a valid email address");
      return;
    }

    setSubmiting(true);

    try {
      // Prepare the payload
      const payload = {};
      if (nameChanged) payload.name = localDetails.name;
      if (emailChanged) payload.email = localDetails.email;

      // Send the request to the backend
      const response = await fetch(`${API_URL}/api/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // Handle errors from the backend
      if (!response.ok) {
        handleErrorFeedback(
          data.message || "Something went wrong. Try again later."
        );
        return;
      }

      // Handle pending verification (OTP)
      if (data.pendingVerification) {
        setActiveModal("otpConfirmation"); // Show OTP modal
        if (nameChanged) {
          setUserProfile((prev) => ({
            ...prev,
            name: localDetails.name,
          }));
        }
      } else {
        // Handle successful update
        handleSuccessFeedback(data.message, e);
        setUserProfile((prev) => ({
          ...prev,
          name: localDetails.name,
        }));
      }
      if (!data.success) {
        handleErrorFeedback(data.message);
      }
    } catch (error) {
      console.error("Error while updating:", error);
      handleErrorFeedback("Something went wrong. Try again later.");
    } finally {
      setSubmiting(false);
    }
  }

  return (
    <>
      {createPortal(
        <div className={`modal-overlay ${showOverlay ? "show" : ""}`}></div>,
        document.body
      )}

      {activeModal === "myrecipes" && (
        <MyrecipesModal
          recipes={recipes}
          setActiveModal={setActiveModal}
          setRecipes={setRecipes}
        />
      )}

      <div
        className={`menu-modal otp-modal ${
          activeModal === "otpConfirmation" ? "show-modal" : ""
        }`}
        aria-labelledby="otp-step-header"
      >
        <div className="modal-header">
          <ArrowLeft
            className="back-icon"
            onClick={handleBackToAccount}
            aria-label="Go back to account"
          />{" "}
        </div>

        <X
          className="menu-modal-cross otp-verification"
          onClick={handleCloseModal}
          ref={closeIconRef}
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
            <strong>{localDetails.email}</strong>
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
                setSubmiting,
                localDetails,
                handleCloseModal,
                setOtpValue,
                otpInputRef,
                setHasFeedback,
                setFeedbackSuccessful,
                setFeedbackMessage,
                setUserProfile
              )
            }
            className="primary-button"
            disabled={otpValue.length < 4}
            aria-label="Verify button"
          >
            {submiting ? "Verifying..." : "verify"}
          </button>
        </form>
      </div>

      <div
        id="dietaryPreferences"
        className={`menu-modal dietary-preferences ${
          activeModal === "dietarypreferences" ? "show-modal" : ""
        }`}
      >
        <FeedBack
          message={feedbackMessage}
          isSuccessful={feedbackSuccessful}
          hasFeedback={hasFeedback}
        />
        <h3 className="menu-modal-title">
          Dietary Preferences & Allergies
          <X
            className="menu-modal-cross"
            onClick={(e) => handleCloseModal(e)}
          />
        </h3>
        <Ingredients
          userAllergies={userProfile.allergies}
          userDietaryPreferences={userProfile.dietaryPreferences}
        />
        <button
          onClick={handleDietaryUpdate}
          className="save-changes menu-modal-btn"
        >
          {submiting ? "Saving..." : "Save Preferences"}
        </button>
      </div>

      <div
        className={`menu-modal menu-modal-myaccount ${
          activeModal === "myaccount" ? "show-modal" : ""
        }`}
      >
        <FeedBack
          message={feedbackMessage}
          isSuccessful={feedbackSuccessful}
          hasFeedback={hasFeedback}
        />
        <h3 className="menu-modal-title">
          My Account
          <X className="menu-modal-cross" onClick={handleCloseModal} />
        </h3>
        <form onSubmit={handleUpdateDetails} className="menu-modal-form">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={localDetails.name}
            name="name"
            onChange={(e) =>
              setLocalDetails((prev) => ({
                ...prev,
                name: e.target.value.trim(),
              }))
            }
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={localDetails.email}
            name="email"
            onChange={(e) =>
              setLocalDetails((prev) => ({
                ...prev,
                email: e.target.value.trim(),
              }))
            }
          />
          <section className="stats">
            <div className="saved-recipes">
              <div className="stats-number">
                <BookOpen className="w-3 h-3" />
                <span className="total-saved">{recipes.length}</span>
              </div>
              <span>Recipes Saved</span>
            </div>
            <div className="favourite-recipes">
              <div className="stats-number">
                <Heart className="w-3 h3" />
                <span className="total-favorites">{favoriteCount}</span>
              </div>
              <span>Favorites</span>
            </div>
          </section>
          <div title={!isFormChanged ? "You haven't made any changes" : ""}>
            <button
              type="submit"
              className="menu-modal-btn"
              disabled={!isFormChanged || submiting}
            >
              {submiting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      <div
        className={`menu-modal ${
          activeModal === "changepassword" ? "show-modal" : ""
        }`}
      >
        <FeedBack
          message={feedbackMessage}
          isSuccessful={feedbackSuccessful}
          hasFeedback={hasFeedback}
        />
        <h3 className="menu-modal-title">
          Change Password
          <X className="menu-modal-cross" onClick={handleCloseModal} />
        </h3>
        <form onSubmit={handleUpdatePassword} className="menu-modal-form">
          <label htmlFor="current-password">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            minLength={8}
            required
          />
          <label htmlFor="new-password">New Password</label>
          <input
            type="password"
            id="new-password"
            name="newPassword"
            minLength={8}
            required
          />
          <label htmlFor="confirm-new-password">Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            minLength={8}
            required
          />
          <button className="menu-modal-btn">
            {submiting ? "Checking..." : "Update Password"}
          </button>
        </form>
      </div>

      <div
        className={`menu-modal ${
          activeModal === "deleteaccount" ? "show-modal" : ""
        }`}
      >
        <FeedBack
          message={feedbackMessage}
          isSuccessful={feedbackSuccessful}
          hasFeedback={hasFeedback}
        />
        <h3 className="menu-modal-title">
          Delete Account
          <X
            className="menu-modal-cross"
            onClick={(e) => handleCloseModal(e)}
          />
        </h3>
        <p className="menu-modal-delete">
          <UserX />
        </p>
        <div className="delete-account">
          <p className="delete-account-description">
           This action cannot be undone and you will lose:
          </p>
          <span>All your saved recipes</span>
          <span>Your favorite recipes collection</span>
          <span>Your personal settings and preferences</span>
          <span>Your account history and data</span>
        </div>

        <div className="delete-account-buttons">
          <button
            onClick={(e) => handleCloseModal(e)}
            className="delete-acc-btn"
          >
            Cancel
          </button>
          <button
            onClick={(e) => handleDeleteAccount(e)}
            className="delete-acc-btn"
          >
            {submiting ? "submiting" : "Delete Account"}
          </button>
        </div>
      </div>

      <div
        className={`menu-modal ${activeModal === "logout" ? "show-modal" : ""}`}
      >
        <FeedBack
          message={feedbackMessage}
          isSuccessful={feedbackSuccessful}
          hasFeedback={hasFeedback}
        />

        <h3 className="menu-modal-title">
          Logout
          <X
            className="menu-modal-cross"
            onClick={(e) => handleCloseModal(e)}
          />
        </h3>
        <p className="menu-modal-delete">
          <LogOut />
        </p>
        <p className="delete-account-description">
          Are you sure you want to Logout?
        </p>

        <div className="delete-account-buttons">
          <button
            className="delete-acc-btn"
            onClick={(e) => handleCloseModal(e)}
          >
            Cancel
          </button>
          <button className="delete-acc-btn" onClick={(e) => handleLogout(e)}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
const recipePropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  prepTime: PropTypes.string.isRequired,
  cookTime: PropTypes.string.isRequired,
  servings: PropTypes.number.isRequired,
  ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
  instructions: PropTypes.arrayOf(PropTypes.string).isRequired,
  message: PropTypes.string.isRequired,
  isFavorite: PropTypes.bool.isRequired,
});

Modal.propTypes = {
  activeModal: PropTypes.oneOf([
    "dietarypreferences",
    "myaccount",
    "changepassword",
    "deleteaccount",
    "logout",
    "otpConfirmation",
    "myrecipes",
  ]),
  showOverlay: PropTypes.bool.isRequired,
  setActiveModal: PropTypes.func.isRequired,
  setShowOverlay: PropTypes.func.isRequired,
  submiting: PropTypes.bool.isRequired,
  setSubmiting: PropTypes.func.isRequired,

  feedbackSuccessful: PropTypes.bool.isRequired,
  setFeedbackSuccessful: PropTypes.func.isRequired,

  feedbackMessage: PropTypes.string.isRequired,
  setFeedbackMessage: PropTypes.func.isRequired,

  hasFeedback: PropTypes.bool.isRequired,
  setHasFeedback: PropTypes.func.isRequired,
  setShowLoginModal: PropTypes.func.isRequired,
  setActiveLoginModal: PropTypes.func.isRequired,
  setIsAuthenticated: PropTypes.func.isRequired,
  userProfile: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    dietaryPreferences: PropTypes.arrayOf(PropTypes.string),
    allergies: PropTypes.arrayOf(PropTypes.string),
  }),

  setUserProfile: PropTypes.func.isRequired,
  recipes: PropTypes.arrayOf(recipePropType).isRequired,
  setRecipes: PropTypes.func.isRequired,
};
