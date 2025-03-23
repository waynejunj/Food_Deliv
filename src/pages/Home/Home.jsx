import React, { useState } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import AppDownload from "../../components/AppDownload.jsx/AppDownload";
import LoginPopup from "../../components/LoginPopup/LoginPopup";

const Home = () => {
  const [category, setCategory] = useState("All");
  const [showLogin, setShowLogin] = useState(false); // Control login popup visibility
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Sign In and Sign Up forms

  return (
    <div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay
        category={category}
        setShowLogin={setShowLogin}
        setIsSignUp={setIsSignUp}
      />
      <AppDownload />
      {showLogin && (
        <LoginPopup
          setShowLogin={setShowLogin}
          setIsSignUp={setIsSignUp}
          isSignUp={isSignUp}
        />
      )}
    </div>
  );
};

export default Home;