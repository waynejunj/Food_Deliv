import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLoggedIn(false);
    setUser({});
    navigate("/");
  };

  const handleCartClick = () => {
    if (!loggedIn) {
      setShowLogin(true);
    } else {
      navigate("/cart");
    }
  };

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  const handleSearchResultClick = (food) => {
    if (!loggedIn) {
      setShowLogin(true);
    } else {
      addToCart(food);
      setSearchQuery("");
      setFilteredFoods([]);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Reusable components
  const AuthButtons = ({ isDropdown }) => (
    <>
      <button
        className={`sign-in-button ${isDropdown ? "dropdown-button" : ""}`}
        onClick={() => {
          setShowLogin(true);
          setIsSignUp(false);
          if (isDropdown) setIsMenuOpen(false);
        }}
      >
        Sign In
      </button>
      <button
        className={`sign-up-button ${isDropdown ? "dropdown-button" : ""}`}
        onClick={() => {
          setShowLogin(true);
          setIsSignUp(true);
          if (isDropdown) setIsMenuOpen(false);
        }}
      >
        Sign Up
      </button>
    </>
  );

  const CartIcon = ({ isDropdown }) => (
    <div
      className={`navbar-basket-icon ${isDropdown ? "dropdown-button" : ""}`}
      onClick={handleCartClick}
    >
      <img src={assets.basket_icon} alt="Cart" />
      {totalQuantity > 0 && <div className="dot">{totalQuantity}</div>}
    </div>
  );

  const LogoutButton = ({ isDropdown }) => (
    <button
      className={`logout-button ${isDropdown ? "dropdown-button" : ""}`}
      onClick={() => {
        handleLogout();
        if (isDropdown) setIsMenuOpen(false);
      }}
    >
      Logout
    </button>
  );

  const MenuLink = ({ to, label, menuKey }) => (
    <Link
      to={to}
      onClick={() => {
        setMenu(menuKey);
        setIsMenuOpen(false);
      }}
      className={menu === menuKey ? "active" : ""}
    >
      {label}
    </Link>
  );

  return (
    <div className="navbar">
      {/* Hamburger Menu Icon */}
      <div className="hamburger-menu" onClick={toggleMenu}>
        ☰
      </div>

      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} alt="Company Logo" className="logo" />
      </Link>

      {/* Search Bar */}
      {loggedIn && (
        <div className="search-container">
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search for food..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button type="submit">
              <img src={assets.search_icon} alt="Search" className="search-icon" />
            </button>
          </form>
          {searchQuery && (
            <div className="search-results">
              {filteredFoods.length > 0 ? (
                filteredFoods.map((food) => (
                  <div
                    key={food.id}
                    className="search-result-item"
                    onClick={() => handleSearchResultClick(food)}
                  >
                    {food.name}
                  </div>
                ))
              ) : (
                <div className="no-results">No results found</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Navbar Menu */}
      <ul className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
        <MenuLink to="/" label="Home" menuKey="home" />
        <MenuLink to="#explore-menu" label="Menu" menuKey="menu" />
        <MenuLink to="#app-download" label="Mobile App" menuKey="mobile-app" />
        <MenuLink to="#footer" label="Contact Us" menuKey="contact-us" />

        {!loggedIn && <AuthButtons isDropdown={true} />}
        {loggedIn && <CartIcon isDropdown={true} />}
        {loggedIn && <LogoutButton isDropdown={true} />}
      </ul>

      {/* Navbar Right Section */}
      <div className="navbar-right">
        {loggedIn && <CartIcon isDropdown={false} />}
        {!loggedIn && <AuthButtons isDropdown={false} />}
        {loggedIn && (
          <div className="navbar-user">
            <p className="welcome-message">
              Welcome, <span className="username">{user?.username || "User"}</span>
            </p>
            <LogoutButton isDropdown={false} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;