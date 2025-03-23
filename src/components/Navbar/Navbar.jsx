import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ setShowLogin, refreshTrigger, setIsSignUp }) => {
  const { getTotalQuantity } = useContext(StoreContext);
  const totalQuantity = getTotalQuantity();
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [menu, setMenu] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if the user is logged in
  const checkLoggedIn = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
      setUser({});
    }
  };

  useEffect(() => {
    checkLoggedIn();
  }, [refreshTrigger]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.navbar')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setLoggedIn(false);
    setUser({});
    setMobileMenuOpen(false);
    navigate("/");
  };

  // Handle cart click for unauthenticated users
  const handleCartClick = () => {
    if (!loggedIn) {
      setShowLogin(true); // Show login popup
      setIsSignUp(false); // Default to Sign In form
      setMobileMenuOpen(false);
    } else {
      setMobileMenuOpen(false);
      navigate("/cart");
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when clicking a link
  const handleMenuClick = (menuItem) => {
    setMenu(menuItem);
    setMobileMenuOpen(false);
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <img src={assets.logo} alt="Company Logo" className="logo" />
        </Link>
      </div>

      <ul className={`navbar-menu ${mobileMenuOpen ? "active" : ""}`}>
        <Link
          to="/"
          onClick={() => handleMenuClick("home")}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </Link>
        <a
          href="#explore-menu"
          onClick={() => handleMenuClick("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </a>
        <a
          href="#app-download"
          onClick={() => handleMenuClick("mobile-app")}
          className={menu === "mobile-app" ? "active" : ""}
        >
          Mobile App
        </a>
        <a
          href="#footer"
          onClick={() => handleMenuClick("contact-us")}
          className={menu === "contact-us" ? "active" : ""}
        >
          Contact Us
        </a>

        {/* Mobile-only elements that appear in the dropdown menu */}
        <div className="mobile-menu-items">
          <div className="mobile-search">
            <img
              src={assets.search_icon}
              alt="Search"
              className="search-icon"
            />
          </div>

          {loggedIn ? (
            <>
              <div className="navbar-basket-icon mobile-cart" onClick={handleCartClick}>
                <img src={assets.basket_icon} alt="Cart" />
                <div className={totalQuantity === 0 ? "dotHidden" : "dot"}>
                  <p>{totalQuantity}</p>
                </div>
              </div>
              <div className="navbar-user mobile-user">
                <p className="welcome-message">
                  Welcome, <span className="username">{user?.username || "User"}</span>
                </p>
                <button
                  className="logout-button"
                  onClick={handleLogout}
                  aria-label="Logout"
                  title="Logout"
                >
                  <img src={assets.logout_icon} alt="Logout" className="logout-icon" />
                  <span className="logout-text">Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="auth-buttons mobile-auth">
              <button
                className="sign-in-button"
                onClick={() => {
                  setShowLogin(true);
                  setIsSignUp(false);
                  setMobileMenuOpen(false);
                }}
                aria-label="Sign In"
              >
                Sign In
              </button>
              <button
                className="sign-up-button"
                onClick={() => {
                  setShowLogin(true);
                  setIsSignUp(true);
                  setMobileMenuOpen(false);
                }}
                aria-label="Sign Up"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </ul>

      {/* Desktop navbar-right - modified for mobile */}
      <div className="navbar-right">
        {/* Move hamburger menu to navbar-right */}
        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <div className={`hamburger ${mobileMenuOpen ? "active" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        
        <img
          src={assets.search_icon}
          alt="Search"
          className="search-icon"
        />
        {loggedIn ? (
          <>
            <div className="navbar-basket-icon" onClick={handleCartClick}>
              <img src={assets.basket_icon} alt="Cart" />
              <div className={totalQuantity === 0 ? "dotHidden" : "dot"}>
                <p>{totalQuantity}</p>
              </div>
            </div>
            <div className="navbar-user">
              <p className="welcome-message">
                Welcome, <span className="username">{user?.username || "User"}</span>
              </p>
              <button
                className="logout-button"
                onClick={handleLogout}
                aria-label="Logout"
                title="Logout"
              >
                <img src={assets.logout_icon} alt="Logout" className="logout-icon" />
                <span className="logout-text">Logout</span>
              </button>
            </div>
          </>
        ) : (
          <div className="auth-buttons">
            <button
              className="sign-in-button"
              onClick={() => {
                setShowLogin(true);
                setIsSignUp(false);
              }}
              aria-label="Sign In"
            >
              Sign In
            </button>
            <button
              className="sign-up-button"
              onClick={() => {
                setShowLogin(true);
                setIsSignUp(true);
              }}
              aria-label="Sign Up"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;