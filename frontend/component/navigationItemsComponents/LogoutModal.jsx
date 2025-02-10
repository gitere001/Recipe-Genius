import { X, LogOut } from "lucide-react";
import FeedBack from "../feedback";
import PropTypes from "prop-types";

export default function LogoutModal({
  handleCloseModal,
  feedbackMessage,
  feedbackSuccessful,
  hasFeedback,
  handleLogout,
}) {
  return (
    <div className="menu-modal show-modal">
      <FeedBack message={feedbackMessage} isSuccessful={feedbackSuccessful} hasFeedback={hasFeedback} />
      <h3 className="menu-modal-title">
        Logout
        <X className="menu-modal-cross" onClick={handleCloseModal} />
      </h3>
      <p className="menu-modal-delete">
        <LogOut />
      </p>
      <p className="delete-account-description">Are you sure you want to Logout?</p>
      <div className="delete-account-buttons">
        <button className="delete-acc-btn" onClick={handleCloseModal}>
          Cancel
        </button>
        <button className="delete-acc-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

LogoutModal.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
  feedbackMessage: PropTypes.string.isRequired,
  feedbackSuccessful: PropTypes.bool.isRequired,
  hasFeedback: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
};