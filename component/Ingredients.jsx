import { dietaryPreferences, allergiesData } from "./dietaryAllegiesData";
import CustomPreference from "./customPreferences";
import './components-styles/ingridients.css'

export default function Ingredients() {
  const dietariesElements = dietaryPreferences.map((diet) => (
    <label key={diet.id} htmlFor={diet.label} className="dietary-choice">
      <input type="checkbox" name="dietaryPreference" id={diet.label} value={diet.value} />
      <span>{diet.label}</span>
    </label>
  ));

  const allergiesElements = allergiesData.map((allergy) => (
    <label key={allergy.id} htmlFor={allergy.label} className="dietary-choice">
      <input type="checkbox" name="allergy" id={allergy.label} value={allergy.value} />
      <span>{allergy.label}</span>
    </label>
  ));

  return (
    <section className="dietary-allergy">
      <form action="" className="menu-modal-form">
        <h4>Dietary Preferences</h4>
        {dietariesElements}
        <CustomPreference placeholder="Add custom preference..." name="customDietary" />
      </form>
      <hr />
      <form className="menu-modal-form">
        <h4>Allergies</h4>
        {allergiesElements}
        <CustomPreference placeholder="Add custom allergy..." name="customAllergy" />
      </form>
    </section>
  );
}
