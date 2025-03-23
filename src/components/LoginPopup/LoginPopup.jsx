import React, { useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { Auth } from "./auth";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const LoginPopup = ({ setShowLogin, setRefreshTrigger, isSignUp, setIsSignUp }) => {
  const navigate = useNavigate();

  // Initialize Hooks
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Clear form fields
  const clearForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setPhone("");
    setError("");
    setSuccess("");
    setLoading(false);
  };

  // Toggle between Sign In and Sign Up
  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    clearForm();
  };

  // Submit function
  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isSignUp) {
        // Sign Up logic
        const data = new FormData();
        data.append("username", username);
        data.append("email", email);
        data.append("password", password);
        data.append("phone", phone);

        const response = await Auth.signup(data);

        setSuccess(response.data.message);
        clearForm();
      } else {
        // Sign In logic
        const data = new FormData();
        data.append("email", email);
        data.append("password", password);

        const response = await Auth.signin(data);

        if (response.data.user) {
          alert("Login Successful");
          localStorage.setItem("user", JSON.stringify(response.data.user));
          setRefreshTrigger((prev) => !prev); // Trigger navbar refresh
          setShowLogin(false); // Close the login popup
        } else {
          setError("Login Failed");
        }
      }
    } catch (error) {
      console.error("Server Error:", error);
      setError(error.response?.data?.message || "There was a server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={submit}>
        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="login-popup-title">
          <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
          <img
            src={assets.cross_icon}
            alt="close"
            onClick={() => setShowLogin(false)}
          />
        </div>

        <div className="login-popup-inputs">
          {isSignUp && (
            <>
              <input
                type="text"
                placeholder="Your name"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="tel"
                placeholder="Phone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </>
          )}
          <input
            type="email"
            placeholder="Your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? (
            <ClipLoader color="#ffffff" size={20} />
          ) : isSignUp ? (
            "Create Account"
          ) : (
            "Login"
          )}
        </button>

        {isSignUp && (
          <div className="login-popup-condition">
            <input type="checkbox" required />
            <p>By continuing, I agree to the terms of use & privacy policy</p>
          </div>
        )}

        {isSignUp ? (
          <p>
            Already have an account?{" "}
            <span onClick={toggleForm}>Login here</span>
          </p>
        ) : (
          <p>
            Create a new account?{" "}
            <span onClick={toggleForm}>Sign Up here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;