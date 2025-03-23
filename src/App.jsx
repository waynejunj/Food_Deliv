import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";

const App = () => {
  const [showLogin, setShowLogin] = useState(false); // Controls login popup visibility
  const [refreshTrigger, setRefreshTrigger] = useState(false); // Triggers navbar refresh
  const [isSignUp, setIsSignUp] = useState(false); // Tracks whether to show Sign In or Sign Up form

  return (
    <>
      <div className="app">
        <Navbar
          setShowLogin={setShowLogin}
          refreshTrigger={refreshTrigger}
          setIsSignUp={setIsSignUp} // Pass setIsSignUp to Navbar
        />

        {showLogin && (
          <LoginPopup
            setShowLogin={setShowLogin}
            setRefreshTrigger={setRefreshTrigger}
            isSignUp={isSignUp} // Pass isSignUp to LoginPopup
            setIsSignUp={setIsSignUp} // Pass setIsSignUp to LoginPopup
          />
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;