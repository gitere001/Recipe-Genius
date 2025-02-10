import { X, UserX } from "lucide-react";
import FeedBack from "../feedback";
import PropTypes from "prop-types";

export default function DeleteAccountModal({
  handleCloseModal,
  feedbackMessage,
  feedbackSuccessful,
  hasFeedback,
  handleDeleteAccount,
  submiting,
}) {
  return (
    <div className="menu-modal show-modal">
      <FeedBack message={feedbackMessage} isSuccessful={feedbackSuccessful} hasFeedback={hasFeedback} />
      <h3 className="menu-modal-title">
        Delete Account
        <X className="menu-modal-cross" onClick={handleCloseModal} />
      </h3>
      <p className="menu-modal-delete">
        <UserX />
      </p>
      <div className="delete-account">
        <p className="delete-account-description">undone and you will lose:</p>
        <span>All your saved recipes</span>
        <span>Your favorite recipes collection</span>
        <span>Your personal settings and preferences</span>
        <span>Your account history and data</span>
      </div>
      <div className="delete-account-buttons">
        <button onClick={handleCloseModal} className="delete-acc-btn">
          Cancel
        </button>
        <button onClick={handleDeleteAccount} className="delete-acc-btn">
          {submiting ? "submiting" : "Delete Account"}
        </button>
      </div>
    </div>
  );
}

DeleteAccountModal.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
  feedbackMessage: PropTypes.string.isRequired,
  feedbackSuccessful: PropTypes.bool.isRequired,
  hasFeedback: PropTypes.bool.isRequired,
  handleDeleteAccount: PropTypes.func.isRequired,
  submiting: PropTypes.bool.isRequired,
};