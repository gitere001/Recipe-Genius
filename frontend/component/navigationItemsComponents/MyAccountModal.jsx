import { X, BookOpen, Heart } from "lucide-react";
import FeedBack from "../feedback";
import PropTypes from "prop-types";

export default function MyAccountModal({
  handleCloseModal,
  feedbackMessage,
  feedbackSuccessful,
  hasFeedback,
  localDetails,
  setLocalDetails,
  isFormChanged,
  handleUpdateDetails,
  submiting,
}) {
  return (
    <div className="menu-modal menu-modal-myaccount show-modal">
      <FeedBack message={feedbackMessage} isSuccessful={feedbackSuccessful} hasFeedback={hasFeedback} />
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
        <div title={!isFormChanged ? "You haven't made any changes" : ""}>
          <button type="submit" className="menu-modal-btn" disabled={!isFormChanged || submiting}>
            {submiting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

MyAccountModal.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
  feedbackMessage: PropTypes.string.isRequired,
  feedbackSuccessful: PropTypes.bool.isRequired,
  hasFeedback: PropTypes.bool.isRequired,
  localDetails: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  setLocalDetails: PropTypes.func.isRequired,
  isFormChanged: PropTypes.bool.isRequired,
  handleUpdateDetails: PropTypes.func.isRequired,
  submiting: PropTypes.bool.isRequired,
};