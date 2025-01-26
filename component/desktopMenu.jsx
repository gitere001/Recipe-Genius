import { User, Key, LogOut, UserX, X } from "lucide-react";
import "./components-styles/desktop-menu.css";
import PropTypes from "prop-types";

export default function DesktopMenu({ isOpen, onItemClick, hideMenu }) {
  return (
    <div className={`desktop-menu ${isOpen ? "show" : ""}`}>
      <div onClick={hideMenu} className="cross-desktop-menu">
        <X className="cross-menu" />
      </div>
      <a onClick={() => onItemClick("myaccount")} className="menu-item desktop">
        <User className="w-5 h-5" />
        My Account
      </a>
      <a
        onClick={() => onItemClick("changepassword")}
        className="menu-item desktop"
      >
        <Key className="w-5 h-5" />
        Change Password
      </a>
      <a
        onClick={() => onItemClick("logout")}
        className="menu-item logout desktop"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </a>
      <hr />
      <a
        onClick={() => onItemClick("deleteaccount")}
        className="menu-item logout desktop"
      >
        <UserX className="w-5 h-5" />
        DELETE MY ACCOUNT
      </a>
    </div>
  );
}

DesktopMenu.propTypes = {

  isOpen: PropTypes.bool.isRequired,
  onItemClick: PropTypes.func.isRequired,
  hideMenu: PropTypes.func.isRequired

  };