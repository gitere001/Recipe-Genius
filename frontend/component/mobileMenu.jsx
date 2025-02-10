import {
	UtensilsCrossed,
	BookOpen,
	User,
	Key,
	LogOut,
	UserX,
  } from "lucide-react";
  import "./components-styles/mobile-menu.css";
  import PropTypes from "prop-types";

  export default function MobileMenu({ isOpen, onItemClick }) {
	return (
	  <div className={`mobile-menu ${isOpen ? 'show' : ''}`}>
		<a
		  onClick={() => onItemClick("dietarypreferences")}
		  className="menu-item mobile"
		>
		  <UtensilsCrossed className="w-5 h-5" />
		  Dietary Preferences
		</a>
		<a
		  onClick={() => onItemClick("myrecipes")}
		  className="menu-item mobile"
		>
		  <BookOpen className="w-5 h-5" />
		  My Recipes
		</a>
		<hr />
		<a
		  onClick={() => onItemClick("myaccount")}
		  className="menu-item mobile"
		>
		  <User className="w-5 h-5" />
		  My Account
		</a>
		<a
		  onClick={() => onItemClick("changepassword")}
		  className="menu-item mobile"
		>
		  <Key className="w-5 h-5" />
		  Change Password
		</a>
		<a
		  onClick={() => onItemClick("logout")}
		  className="menu-item logout mobile"
		>
		  <LogOut className="w-5 h-5" />
		  Logout
		</a>
		<hr />
		<a
		  onClick={() => onItemClick("deleteaccount")}
		  className="menu-item logout mobile"
		>
		  <UserX className="w-5 h-5" />
		  DELETE MY ACCOUNT
		</a>
	  </div>
	);
  }

  MobileMenu.propTypes = {

	isOpen: PropTypes.bool.isRequired,
	onItemClick: PropTypes.func.isRequired,
	
  };