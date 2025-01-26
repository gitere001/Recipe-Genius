import { Plus, Trash2 } from "lucide-react";
import { useWindowWidth } from "./responsive";
import "./components-styles/form.css";
import PropTypes from "prop-types";
export default function AddIngriForm(props) {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= 768;

  const ingridientElements = props.ingridients.map((ingridient, index) => {
    return (
      <span className="ingridient" key={index}>
        {ingridient}{" "}
        <i
          onClick={() => removeIngridient(index)}
          className="fa-solid fa-x remove"
        ></i>
      </span>
    );
  });

  function handleAddItem(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newIngridient = formData.get("ingridient");
    if (newIngridient.trim()) {
      props.setIngridients((prevIngridients) => {
        return [...prevIngridients, formData.get("ingridient")];
      });
      form.reset();
    }
  }
  function removeIngridient(indexToRemove) {
    props.setIngridients((prevIngridient) => {
      return prevIngridient.filter((_, index) => index !== indexToRemove);
    });
  }
  function clearAll() {
    props.setIngridients([]);
  }

  return (
    <>
      <section
        className={`add-ingridients-container ${
          props.showAnimation ? "hidden" : ""
        }`}
      >
        <form className="add-ingridients" onSubmit={handleAddItem}>
          <input
            type="text"
            placeholder="e.g. Oregano"
            name="ingridient"
            maxLength={40}
          />
          <button>
            <Plus className="w-5 h-5 mr-2" />
            {isMobile ? "" : "Add Ingridients"}
          </button>
        </form>
        <section className="ingridients-container">
          {props.ingridients.length > 0 ? (
            <h2>
              Ingridients At Hand{" "}
              <span onClick={clearAll} className="clear-all">
                <Trash2 className="w-3 h-3" />{" "}
                {isMobile ? "clear" : "Clear All"}
              </span>
            </h2>
          ) : null}
          <div className="ingridient-card">{ingridientElements}</div>
        </section>
      </section>
      {props.ingridients.length > 0 && !props.showAnimation ? (
        <section className="get-recipe-container">
          <p>
            Ready to discover a delicious recipe with your{" "}
            {props.ingridients.length} ingredient
            {props.ingridients.length === 1 ? "" : "s"}?
          </p>
          <button
            onClick={props.handleShowAnimation}
            className={`get-recipe-btn ${
              props.ingridients.length < 4 ? "disabled" : ""
            }`}
          >
            Generate Recipe
          </button>
        </section>
      ) : null}
    </>
  );
}

AddIngriForm.propTypes = {
  showAnimation: PropTypes.bool.isRequired,
  handleShowAnimation: PropTypes.func.isRequired,
  ingridients: PropTypes.arrayOf(PropTypes.string).isRequired,
  setIngridients: PropTypes.func.isRequired,
};
