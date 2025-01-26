import { X, UserX, Heart, BookOpen, LogOut } from "lucide-react";
import Ingredients from "./Ingredients";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import "./components-styles/modal.css";
import FeedBack from "./feedback";
import { useState } from "react";


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
}) {

  const [savedDetails, setSavedDetails] = useState({
    name: "James Gitere",
    email: "giterejames10@gmail.com",
  });


  function handleCloseModal(e) {
    const clickedElement = e.target;

    const isCloseIcon = clickedElement.closest(".menu-modal-cross");

    if (isCloseIcon) {
      const closestForm = isCloseIcon.parentElement.nextElementSibling;
      if (closestForm && closestForm.tagName.toLowerCase() === "form") {
        closestForm.reset();
      }
    }

    setActiveModal(null);
    setShowOverlay(false);
    setHasFeedback(false);
  }

  async function sendUpdatePasswordRequest() {
    const res = JSON.stringify({
      success: false,
      message: "Current password Wrong",
    });
    return JSON.parse(res);
  }
  async function sendUpdateDietaryPreference() {
    const res = JSON.stringify({
      success: false,
      message: "An error occurred! Try Again",
    });
    return JSON.parse(res);
  }
  async function sendUpdateDetails() {
    const res = JSON.stringify({
      success: true,
      message: "Successfully Updated Details",
    });
    return JSON.parse(res);
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
    }, 2000);
  }

  function handleDietaryUpdate(e) {
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
    setTimeout(() => {
      (async () => {
        const response = await sendUpdateDietaryPreference(); // Call the async password update request
        if (response.success) {
          handleSuccessFeedback(response.message, e);
        } else {
          handleErrorFeedback(response.message);
        }
        setSubmiting(false)
      })();
    }, 2000);
  }
  function handleUpdatePassword(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const dataObject = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [key, value.trim()])
    );

    const { newPassword, confirmNewPassword } = dataObject;

    if (newPassword !== confirmNewPassword) {
      setHasFeedback(true);
      setFeedbackSuccessful(false);
      setFeedbackMessage("Passwords do not match.");
      setTimeout(() => {
        setHasFeedback(false);
      }, 2000);
      return;
    }

    setSubmiting(true);

    setTimeout(() => {
      (async () => {
        const response = await sendUpdatePasswordRequest(); // Call the async password update request
        if (response.success) {
          handleSuccessFeedback(response.message, e, form);
        } else {
          handleErrorFeedback(response.message);
        }
      })();
    }, 1000);
  }
  function handleUpdateDetails(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const dataObject = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [key, value.trim()])
    );
    const { name, email } = dataObject;
    if (!name) {
      setHasFeedback(true);
      setFeedbackSuccessful(false);
      setFeedbackMessage("Name is required");
      setTimeout(() => {
        setHasFeedback(false);
      }, 2000);
      return;
    } else if (!email) {
      setHasFeedback(true);
      setFeedbackSuccessful(false);
      setFeedbackMessage("Email is required");
      setTimeout(() => {
        setHasFeedback(false);
      }, 2000);
      return;
    }
    setSubmiting(true);
    setTimeout(() => {
      (async () => {
        const response = await sendUpdateDetails(); // Call the async password update request
        if (response.success) {
          handleSuccessFeedback(response.message, e, form);
        } else {
          handleErrorFeedback(response.message);
        }
      })();
    }, 2000);
  }

  return (
    <>
      {createPortal(
        <div className={`modal-overlay ${showOverlay ? "show" : ""}`}></div>,
        document.body
      )}

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
          <X className="menu-modal-cross" onClick={handleCloseModal} />
        </h3>
        <Ingredients />
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
            value={savedDetails.name}
            name="name"
            onChange={(e) =>
              setSavedDetails((prev) => ({ ...prev, name: e.target.value }))
            }
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={savedDetails.email}
            name="email"
            onChange={(e) =>
              setSavedDetails((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <section className="stats">
            <div className="saved-recipes">
              <div className="stats-number">
                <BookOpen className="w-3 h-3" />
                <span className="total-saved">12</span>
              </div>
              <span>Recipes Saved</span>
            </div>
            <div className="favourite-recipes">
              <div className="stats-number">
                <Heart className="w-3 h3" />
                <span className="total-favorites">5</span>
              </div>
              <span>Favorites</span>
            </div>
          </section>
          <button type="submit" className="menu-modal-btn">
            {submiting ? "Saving..." : "Save Changes"}
          </button>
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
            name="confirmNewPassword"
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
        <FeedBack />
        <h3 className="menu-modal-title">
          Delete Account
          <X className="menu-modal-cross" onClick={handleCloseModal} />
        </h3>
        <p className="menu-modal-delete">
          <UserX />
        </p>
        <div className="delete-account">
          <p className="delete-account-description">
            undone and you will lose:
          </p>
          <span>All your saved recipes</span>
          <span>Your favorite recipes collection</span>
          <span>Your personal settings and preferences</span>
          <span>Your account history and data</span>
        </div>

        <div className="delete-account-buttons">
          <button onClick={handleCloseModal} className="delete-acc-btn">
            Cancel
          </button>
          <button onClick={handleCloseModal} className="delete-acc-btn">
            Delete Account
          </button>
        </div>
      </div>

      <div
        className={`menu-modal ${activeModal === "logout" ? "show-modal" : ""}`}
      >
        <FeedBack />
        <h3 className="menu-modal-title">
          Logout
          <X className="menu-modal-cross" onClick={handleCloseModal} />
        </h3>
        <p className="menu-modal-delete">
          <LogOut />
        </p>
        <p className="delete-account-description">
          Are you sure you want to Logout?
        </p>

        <div className="delete-account-buttons">
          <button className="delete-acc-btn" onClick={handleCloseModal}>
            Cancel
          </button>
          <button className="delete-acc-btn" onClick={handleCloseModal}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

Modal.propTypes = {
  activeModal: PropTypes.oneOf([
    "dietarypreferences",
    "myaccount",
    "changepassword",
    "deleteaccount",
    "logout",
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
};
