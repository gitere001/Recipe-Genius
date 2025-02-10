import { X } from "lucide-react";
import FeedBack from "../feedback";
import Ingredients from "../Ingredients";
import PropTypes from "prop-types";

export default function DietaryPreferencesModal({
  handleCloseModal,
  feedbackMessage,
  feedbackSuccessful,
  hasFeedback,
  handleDietaryUpdate,
  submiting,
}) {
  return (
    <div id="dietaryPreferences" className="menu-modal dietary-preferences show-modal">
      <FeedBack message={feedbackMessage} isSuccessful={feedbackSuccessful} hasFeedback={hasFeedback} />
      <h3 className="menu-modal-title">
        Dietary Preferences & Allergies
        <X className="menu-modal-cross" onClick={handleCloseModal} />
      </h3>
      <Ingredients />
      <button onClick={handleDietaryUpdate} className="save-changes menu-modal-btn">
        {submiting ? "Saving..." : "Save Preferences"}
      </button>
    </div>
  );
}

DietaryPreferencesModal.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
  feedbackMessage: PropTypes.string.isRequired,
  feedbackSuccessful: PropTypes.bool.isRequired,
  hasFeedback: PropTypes.bool.isRequired,
  handleDietaryUpdate: PropTypes.func.isRequired,
  submiting: PropTypes.bool.isRequired,
};