import { X } from "lucide-react";
import FeedBack from "../feedback";
import PropTypes from "prop-types";

export default function ChangePasswordModal({
  handleCloseModal,
  feedbackMessage,
  feedbackSuccessful,
  hasFeedback,
  handleUpdatePassword,
  submiting,
}) {
  return (
    <div className="menu-modal show-modal">
      <FeedBack message={feedbackMessage} isSuccessful={feedbackSuccessful} hasFeedback={hasFeedback} />
      <h3 className="menu-modal-title">
        Change Password
        <X className="menu-modal-cross" onClick={handleCloseModal} />
      </h3>
      <form onSubmit={handleUpdatePassword} className="menu-modal-form">
        <label htmlFor="current-password">Current Password</label>
        <input type="password" name="currentPassword" minLength={8} required />
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" name="newPassword" minLength={8} required />
        <label htmlFor="confirm-new-password">Confirm New Password</label>
        <input type="password" name="confirmPassword" minLength={8} required />
        <button className="menu-modal-btn">{submiting ? "Checking..." : "Update Password"}</button>
      </form>
    </div>
  );
}

ChangePasswordModal.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
  feedbackMessage: PropTypes.string.isRequired,
  feedbackSuccessful: PropTypes.bool.isRequired,
  hasFeedback: PropTypes.bool.isRequired,
  handleUpdatePassword: PropTypes.func.isRequired,
  submiting: PropTypes.bool.isRequired,
};