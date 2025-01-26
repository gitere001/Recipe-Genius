import { ChefHat, Menu, X, BookOpen, UtensilsCrossed } from "lucide-react";
import { useState, useEffect } from "react";
import { useWindowWidth } from "./responsive";
import MobileMenu from "./mobileMenu";
import DesktopMenu from "./desktopMenu";
import "./components-styles/header.css";
import PropTypes from "prop-types";
// import "./components-styles/menu.css";

export default function Header(props) {
  const [isOpen, setIsOpen] = useState(false);
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= 768;


  useEffect(() => {
    if (!isMobile && isOpen) {
      // Prevent resetting `isOpen` for desktop on resize
      setIsOpen(false);
    }
  }, [isMobile]);

  function handleToggle() {
    setIsOpen((prevState) => !prevState);
  }


  function onItemClick(item) {
    setIsOpen(false)
    props.setActiveModal(item)
    props.setShowOverlay(true)
  }
  function hideMenu() {
    setIsOpen(false)
  }

  return (
    <header className="home-header">
      {isOpen && isMobile && (
        <MobileMenu isOpen={isOpen} onItemClick={onItemClick} />
      )}
      {isOpen && !isMobile && (
        <DesktopMenu isOpen={isOpen} onItemClick={onItemClick} hideMenu={hideMenu}/>
      )}
      <div className="home-logo">
        <ChefHat className="chef-hat" />
        <h3>Chef James</h3>
      </div>
      {!isMobile && (
        <>
          <a onClick={() => onItemClick("dietarypreferences")} className="dietary-nav nav-item">
            <UtensilsCrossed className="w-5 h-5" />
            Dietary Preferences
          </a>
          <a className="home-my-recipes nav-item">
            <BookOpen className="w-5 h-5" />
            My Recipes
          </a>
          <span onClick={handleToggle} className="profiles">
            J
          </span>
        </>
      )}
      {isMobile && (
        <div className="menu-toggle" onClick={handleToggle}>
          {isOpen ? (
            <X className={`menu-icon x ${isOpen ? "visible" : ""}`} />
          ) : (
            <Menu className={`menu-icon menu ${isOpen ? "hidden" : ""}`} />
          )}
        </div>
      )}
    </header>
  );
}

Header.propTypes = {
  setActiveModal: PropTypes.func.isRequired,
  setShowOverlay: PropTypes.func.isRequired
};
