import PropTypes from "prop-types";
export default function LoginNav({ activeLoginModal, setActiveLoginModal }) {
  function handleBackNavigation() {
    if (activeLoginModal === "emailStep") {
      setActiveLoginModal("welcomeStep");
    } else if (activeLoginModal === "nameStep") {
      setActiveLoginModal("passwordStep");
    } else if (activeLoginModal === "passwordStep") {
      setActiveLoginModal("emailStep");
    } else if (activeLoginModal === "signinStep") {
      setActiveLoginModal("welcomeStep");
    } else if (activeLoginModal === "forgetPasswordStep") {
      setActiveLoginModal("signinStep");
    } else if (activeLoginModal === "resetPasswordStep") {
      setActiveLoginModal("signinStep");
    }
  }
  return (
    <nav
      onClick={handleBackNavigation}
      className="back-button"
      aria-label="Back button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </nav>
  );

}
LoginNav.propTypes = {
  activeLoginModal: PropTypes.string.isRequired,
  setActiveLoginModal: PropTypes.func.isRequired
}
