import {
  ChefHat,
  X,
  BookOpen,
  Menu,
  User,
  Key,
  LogOut,
  UserX,
  Heart,
  UtensilsCrossed,
} from "lucide-react";
import CustomPreference from "./customPreferences";
import { useState, useEffect } from "react";
import { useWindowWidth } from "./responsive";
import { createPortal } from "react-dom";
import { dietaryPreferences, allergiesData } from "./dietaryAllegiesData";
export default function Header() {
  const dietariesElements = dietaryPreferences.map((diet) => {
    return (
      <label key={diet.id} htmlFor={diet.label} className="dietary-choice">
        <input
          type="checkbox"
          name="dietaryPreference"
          id={diet.label}
          value={diet.value}
        />
        <span>{diet.label}</span>
      </label>
    );
  });
  const allergiesElements = allergiesData.map((allergy) => {
    return (
      <label
        key={allergy.id}
        htmlFor={allergy.label}
        className="dietary-choice"
      >
        <input
          type="checkbox"
          name="dietaryPreference"
          id={allergy.label}
          value={allergy.value}
        />
        <span>{allergy.label}</span>
      </label>
    );
  });

  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= 768;
  useEffect(() => {
    if (!isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile, isOpen]);

  function handleToggle() {
    setIsOpen(!isOpen);
  }
  function handleMenuItemClick(modalType) {
    setIsOpen(false);
    setActiveModal(modalType);
    setShowOverlay(true);
  }
  function handleCloseModal() {
    setActiveModal(null);
    setShowOverlay(false);
  }

  return (
    <>
      <header className="home-header">
        <div
          className={isMobile && isOpen ? "mobile-menu show" : "mobile-menu"}
        >
          <>
            <a
              onClick={() => handleMenuItemClick("dietarypreferences")}
              className="mobile"
            >
              <UtensilsCrossed className="w-5 h-5" />
              Dietary Preferences
            </a>
            <a onClick={() => handleMenuItemClick()} className="mobile">
              <BookOpen className="w-5 h-5" />
              My Recipes
            </a>
            <hr />
            <a
              onClick={() => handleMenuItemClick("myaccount")}
              className="mobile"
            >
              <User className="w-5 h-5" />
              My Account
            </a>
            <a
              onClick={() => handleMenuItemClick("changepassword")}
              className="mobile"
            >
              <Key className="w-5 h-5" />
              Change Password
            </a>
            <a
              onClick={() => handleMenuItemClick("logout")}
              className="mobile logout"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </a>
            <hr />
            <a
              onClick={() => handleMenuItemClick("deleteaccount")}
              className="mobile logout"
            >
              <UserX className="w-5 h-5" />
              DELETE MY ACCOUNT
            </a>
          </>
        </div>
        <div className="home-logo">
          <ChefHat className="chef-hat" />
          <h3>Chef James</h3>
        </div>
        {!isMobile && (
          <>
            <a className="home-nav nav-item">
              <UtensilsCrossed className="w-5 h-5" />
              Dietary Preferences
            </a>
            <a className="home-my-recipes nav-item">
              <BookOpen className="w-5 h-5" />
              My Recipes
            </a>
            <span className="profiles">J</span>
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
      {createPortal(
        <div className={`modal-overlay ${showOverlay ? "show" : ""}`}></div>,
        document.body
      )}

      <div
        className={`menu-modal dietary-preferences ${
          activeModal === "dietarypreferences" ? "show-modal" : ""
        }`}
      >
        <h3 className="menu-modal-title">
          Dietary Preferences & Allergies
          <X className="menu-modal-cross" onClick={handleCloseModal} />
        </h3>
        <section className="dietary-allergy">
          <form action="" className="menu-modal-form">
            <h4>Dietary Preferences</h4>
            {dietariesElements}
            <CustomPreference
            placeholder="Add custom preference..."
            name="customDietary"
            />

          </form>
          <form className="menu-modal-form">
            <h4>Allergies</h4>
            {allergiesElements}
            <CustomPreference
            placeholder="Add custom allergy..."
            name="customAllergy"
            />

          </form>
        </section>
        <button className="save-changes menu-modal-btn">
          Save Preferences
        </button>
      </div>

      <div
        className={`menu-modal menu-modal-myaccount ${
          activeModal === "myaccount" ? "show-modal" : ""
        }`}
      >
        <h3 className="menu-modal-title">
          My Account
          <X className="menu-modal-cross" onClick={handleCloseModal} />
        </h3>
        <form action="" className="menu-modal-form">
          <label htmlFor="name">Name</label>
          <input type="text" defaultValue="James Gitere" />
          <label htmlFor="email">Email</label>
          <input type="email" defaultValue="giterejames10@gmail.com" />

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
          <button className="menu-modal-btn">Save Changes</button>
        </form>
      </div>
      <div
        className={`menu-modal ${
          activeModal === "changepassword" ? "show-modal" : ""
        }`}
      >
        <h3 className="menu-modal-title">
          Change Password
          <X className="menu-modal-cross" onClick={handleCloseModal} />
        </h3>
        <form action="" className="menu-modal-form">
          <label htmlFor="current-password">Current Password</label>
          <input type="text" id="current-password" name="currentPassword" />
          <label htmlFor="new-password">New Password</label>
          <input type="email" id="new-password" name="newPassword" />
          <label htmlFor="confirm-new-password">Confirm New Password</label>
          <input
            type="email"
            id="confirm-new-password"
            name="confirmNewPassword"
          />
          <button className="menu-modal-btn">Update Password</button>
        </form>
      </div>
      <div
        className={`menu-modal ${
          activeModal === "deleteaccount" ? "show-modal" : ""
        }`}
      >
        <h3 className="menu-modal-title">
          Delete Account
          <X className="menu-modal-cross" onClick={handleCloseModal} />
        </h3>
        <p className="menu-modal-delete">
          <UserX />
        </p>
        <div className="delete-account">
          <p className="delete-account-description">
            Are you sure you want to delete your account? This action cannot be
            undone and you will lose:
          </p>
          <span>All your saved recipes</span>
          <span>Your favorite recipes collection</span>
          <span>Your personal settings and preferences</span>
          <span>Your account history and data</span>
        </div>

        <div className="delete-account-buttons">
          <button className="delete-acc-btn">Cancel</button>
          <button className="delete-acc-btn">Delete Account</button>
        </div>
      </div>
      <div
        className={`menu-modal ${activeModal === "logout" ? "show-modal" : ""}`}
      >
        <h3 className="menu-modal-title">
          Logout
          <X className="menu-modal-cross" onClick={handleCloseModal} />
        </h3>
        <p className="menu-modal-delete">
          <LogOut />
        </p>
        <p className="delete-account-description">
          Are you sure you want to Logout?
        </p>

        <div className="delete-account-buttons">
          <button className="delete-acc-btn">Cancel</button>
          <button className="delete-acc-btn">Logout</button>
        </div>
      </div>
    </>
  );
}
