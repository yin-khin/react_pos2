import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>Dashboard</h2>
        </div>
    <div className="profile-wrapper" ref={profileRef}>
      <button
        type="button"
        className="profile-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="profile-avatar">U</span>
        <span className="profile-label">Profile</span>
      </button>

      {isOpen && (
        <div className="profile-dropdown">
          <button type="button" className="dropdown-item" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
      </div>
    </nav>
  );
};

export default Navbar;
