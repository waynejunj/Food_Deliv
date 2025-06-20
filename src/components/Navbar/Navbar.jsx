import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'

const Navbar = ({ setShowLogin, setIsSignUp, refreshTrigger }) => {
  const { getTotalQuantity, foodList, addToCart } = useContext(StoreContext);
  const totalQuantity = getTotalQuantity();
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [menu, setMenu] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.navbar-user') && !event.target.closest('.search-container') && !event.target.closest('.hamburger-menu')) {
        setIsUserDropdownOpen(false);
        setIsMenuOpen(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setLoggedIn(false);
    setUser({});
    setIsUserDropdownOpen(false);
    navigate("/");
  };

  // Handle cart click
  const handleCartClick = () => {
    if (!loggedIn) {
      setShowLogin(true);
    } else {
      navigate("/cart");
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = foodList.filter((food) =>
        food.name.toLowerCase().includes(query)
      );
      setFilteredFoods(filtered);
    } else {
      setFilteredFoods([]);
    }
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
      setIsSearchFocused(false);
    }
  };

  // Handle search result click
  const handleSearchResultClick = (food) => {
    if (!loggedIn) {
      setShowLogin(true);
    } else {
      addToCart(food);
      setSearchQuery("");
      setFilteredFoods([]);
      setIsSearchFocused(false);
    }
  };

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsUserDropdownOpen(false);
  };

  // Toggle user dropdown
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setIsMenuOpen(false);
  };

  // Get first initial of username
  const getUserInitial = () => {
    return user?.username ? user.username.charAt(0).toUpperCase() : "U";
  };

  // Handle search focus
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  // Handle search blur with delay to allow for clicks
  const handleSearchBlur = () => {
    setTimeout(() => setIsSearchFocused(false), 200);
  };

  return (
    <div className="navbar rounded-5 p-3">
      {/* Hamburger Menu Icon */}
      <div className="hamburger-menu" onClick={toggleMenu}>
        <div className={`hamburger-lines ${isMenuOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* Logo */}
      <Link to="/" className="logo-link">
        <img src={assets.logo} alt="Company Logo" className="logo" />
      </Link>

      {/* Search Bar (Visible only when logged in) */}
      {loggedIn && (
        <div className="search-container">
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search for delicious food..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className={isSearchFocused ? 'focused' : ''}
              />
              <button type="submit" className="search-button">
                <img src={assets.search_icon} alt="Search" className="search-icon" />
              </button>
            </div>
          </form>
          {(searchQuery && isSearchFocused) && (
            <div className="search-results">
              {filteredFoods.length > 0 ? (
                <>
                  <div className="search-results-header">
                    <span>Found {filteredFoods.length} item{filteredFoods.length !== 1 ? 's' : ''}</span>
                  </div>
                  {filteredFoods.slice(0, 5).map((food) => (
                    <div
                      key={food.id}
                      className="search-result-item"
                      onClick={() => handleSearchResultClick(food)}
                    >
                      <div className="food-item-info">
                        <span className="food-name">{food.name}</span>
                        <span className="food-category">{food.category}</span>
                      </div>
                      <div className="add-to-cart-icon">+</div>
                    </div>
                  ))}
                  {filteredFoods.length > 5 && (
                    <div className="view-all-results" onClick={() => navigate(`/search?query=${searchQuery}`)}>
                      View all {filteredFoods.length} results →
                    </div>
                  )}
                </>
              ) : (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <span>No results found for "{searchQuery}"</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Navbar Menu */}
      <ul className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
        <li>
          <Link
            to="/"
            onClick={() => {
              setMenu("home");
              setIsMenuOpen(false);
            }}
            className={`nav-link ${menu === "home" ? "active" : ""}`}
          >
            <span>Home</span>
          </Link>
        </li>
        <li>
          <a
            href="#explore-menu"
            onClick={() => {
              setMenu("menu");
              setIsMenuOpen(false);
            }}
            className={`nav-link ${menu === "menu" ? "active" : ""}`}
          >
            <span>Menu</span>
          </a>
        </li>
        <li>
          <a
            href="#app-download"
            onClick={() => {
              setMenu("mobile-app");
              setIsMenuOpen(false);
            }}
            className={`nav-link ${menu === "mobile-app" ? "active" : ""}`}
          >
            <span>Mobile App</span>
          </a>
        </li>
        <li>
          <a
            href="#footer"
            onClick={() => {
              setMenu("contact-us");
              setIsMenuOpen(false);
            }}
            className={`nav-link ${menu === "contact-us" ? "active" : ""}`}
          >
            <span>Contact Us</span>
          </a>
        </li>
      </ul>

      {/* Navbar Right Section */}
      <div className="navbar-right">
        {/* Cart Icon (Visible only when logged in) */}
        {loggedIn && (
          <div className="navbar-basket-icon" onClick={handleCartClick}>
            <div className="cart-button">
              <img src={assets.basket_icon} alt="Cart" />
              {totalQuantity > 0 && (
                <div className="cart-badge">
                  <span>{totalQuantity}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Auth Buttons (Visible only when not logged in) */}
        {!loggedIn && (
          <div className="auth-buttons">
            <button
              className="auth-button sign-in-button"
              onClick={() => {
                setShowLogin(true);
                setIsSignUp(false);
              }}
              aria-label="Sign In"
            >
              Sign In
            </button>
            <button
              className="auth-button sign-up-button"
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

        {/* User Avatar (Visible only when logged in) */}
        {loggedIn && (
          <div className="navbar-user">
            <div 
              className={`user-avatar ${isUserDropdownOpen ? 'active' : ''}`} 
              onClick={toggleUserDropdown}
            >
              <span className="user-initial">{getUserInitial()}</span>
              <div className="user-status-dot"></div>
            </div>
            {isUserDropdownOpen && (
              <div className="user-dropdown">
                <div className="user-dropdown-header">
                  <div className="user-avatar-large">
                    {getUserInitial()}
                  </div>
                  <div className="user-info">
                    <span className="welcome-text">Welcome back!</span>
                    <span className="username">{user?.username || "User"}</span>
                  </div>
                </div>
                <div className="user-dropdown-divider"></div>
                <div className="user-dropdown-actions">
                  <button
                    className="dropdown-action-btn profile-btn"
                    onClick={() => {
                      navigate("/profile");
                      setIsUserDropdownOpen(false);
                    }}
                  >
                    <span className="action-icon">👤</span>
                    <span>My Profile</span>
                  </button>
                  <button
                    className="dropdown-action-btn orders-btn"
                    onClick={() => {
                      navigate("/orders");
                      setIsUserDropdownOpen(false);
                    }}
                  >
                    <span className="action-icon">📦</span>
                    <span>My Orders</span>
                  </button>
                  <button
                    className="dropdown-action-btn logout-btn"
                    onClick={handleLogout}
                    aria-label="Logout"
                  >
                    <img src={assets.logout_icon} alt="Logout" className="logout-icon" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      <div className={`mobile-dropdown ${isMenuOpen ? "active" : ""}`}>
        <div className="mobile-dropdown-content">
          {!loggedIn && (
            <div className="mobile-auth-section">
              <button
                className="mobile-auth-btn sign-in"
                onClick={() => {
                  setShowLogin(true);
                  setIsSignUp(false);
                  setIsMenuOpen(false);
                }}
              >
                <span className="auth-icon">👤</span>
                Sign In
              </button>
              <button
                className="mobile-auth-btn sign-up"
                onClick={() => {
                  setShowLogin(true);
                  setIsSignUp(true);
                  setIsMenuOpen(false);
                }}
              >
                <span className="auth-icon">✨</span>
                Sign Up
              </button>
            </div>
          )}
          
          {loggedIn && (
            <div className="mobile-user-section">
              <div className="mobile-user-info">
                <div className="mobile-user-avatar">{getUserInitial()}</div>
                <div className="mobile-user-details">
                  <span className="mobile-welcome">Hello,</span>
                  <span className="mobile-username">{user?.username || "User"}</span>
                </div>
              </div>
              
              <div className="mobile-user-actions">
                <button
                  className="mobile-action-btn cart-btn"
                  onClick={() => {
                    handleCartClick();
                    setIsMenuOpen(false);
                  }}
                >
                  <img src={assets.basket_icon} alt="Cart" />
                  <span>Cart</span>
                  {totalQuantity > 0 && <div className="mobile-cart-badge">{totalQuantity}</div>}
                </button>
                
                <button
                  className="mobile-action-btn profile-btn"
                  onClick={() => {
                    navigate("/profile");
                    setIsMenuOpen(false);
                  }}
                >
                  <span className="mobile-action-icon">👤</span>
                  <span>Profile</span>
                </button>
                
                <button
                  className="mobile-action-btn orders-btn"
                  onClick={() => {
                    navigate("/orders");
                    setIsMenuOpen(false);
                  }}
                >
                  <span className="mobile-action-icon">📦</span>
                  <span>Orders</span>
                </button>
                
                <button
                  className="mobile-action-btn logout-btn"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <img src={assets.logout_icon} alt="Logout" className="mobile-logout-icon" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop for mobile menu */}
      {isMenuOpen && <div className="mobile-backdrop" onClick={() => setIsMenuOpen(false)}></div>}
    </div>
  );
};

export default Navbar;