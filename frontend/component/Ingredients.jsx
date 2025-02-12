import { dietaryPreferences, allergiesData } from "./dietaryAllegiesData";
import "./components-styles/ingridients.css";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function Ingredients({
  userAllergies = [],
  userDietaryPreferences = [],
}) {
  const [dietaryPreferencesState, setDietaryPreferencesState] = useState(
    userDietaryPreferences
  );
  const [allergiesState, setAllergiesState] = useState(userAllergies);

  useEffect(() => {
    setDietaryPreferencesState(userDietaryPreferences);
    setAllergiesState(userAllergies);
  }, [userDietaryPreferences, userAllergies]);

  const handleCheckboxChange = (e, type) => {
    const value = e.target.value;
    if (type === "dietary") {
      setDietaryPreferencesState((prevState) =>
        e.target.checked
          ? [...prevState, value]
          : prevState.filter((item) => item !== value)
      );
    } else if (type === "allergy") {
      setAllergiesState((prevState) =>
        e.target.checked
          ? [...prevState, value]
          : prevState.filter((item) => item !== value)
      );
    }
  };

  const dietariesElements = dietaryPreferences.map((diet) => (
    <label key={diet.id} htmlFor={diet.label} className="dietary-choice">
      <input
        type="checkbox"
        name="dietaryPreference"
        id={diet.label}
        value={diet.value}
        checked={dietaryPreferencesState.includes(diet.value)}
        onChange={(e) => handleCheckboxChange(e, "dietary")}
      />
      <span>{diet.label}</span>
    </label>
  ));

  const allergiesElements = allergiesData.map((allergy) => (
    <label key={allergy.id} htmlFor={allergy.label} className="dietary-choice">
      <input
        type="checkbox"
        name="allergy"
        id={allergy.label}
        value={allergy.value}
        checked={allergiesState.includes(allergy.value)}
        onChange={(e) => handleCheckboxChange(e, "allergy")}
      />
      <span>{allergy.label}</span>
    </label>
  ));

  return (
    <section className="dietary-allergy">
      <form action="" className="menu-modal-form">
        <h4>Dietary Preferences</h4>
        {dietariesElements}
      </form>
      <hr />
      <form className="menu-modal-form">
        <h4>Allergies</h4>
        {allergiesElements}
      </form>
    </section>
  );
}

Ingredients.propTypes = {
  userAllergies: PropTypes.arrayOf(PropTypes.string),
  userDietaryPreferences: PropTypes.arrayOf(PropTypes.string),
};
