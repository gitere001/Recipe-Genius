import "./components-styles/introduction.css";
import PropTypes from "prop-types";
export default function Introduction(props) {
  return (
    <section
      className={`home-introduction ${props.showAnimation ? "hidden" : ""}`}
    >
      <h1>Welcome to Recipe Genius</h1>
      <p>
        Add your ingredients, and let our AI chef create delicious meals! <br />
        <span className="hint">
          (Add at least 4 ingredients to proceed)
        </span>
      </p>
    </section>
  );
}
Introduction.propTypes = {
  showAnimation: PropTypes.bool.isRequired,
};
