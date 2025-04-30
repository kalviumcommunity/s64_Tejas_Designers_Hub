import React, { useState } from "react";
import "./SellerLogin.css";
import { useNavigate } from "react-router-dom";

export default function SellerLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");

  const handleGoogleLogin = () => {
    // TODO: Implement Google login logic
    navigate("/seller-dashboard");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement seller authentication logic here
    // If login is successful:
    navigate("/seller-dashboard");
  };

  return (
    <div className="seller-login-root">
      <div className="seller-login-card">
        <div className="seller-login-image-side">
          <img src="/src/assets/seller-login.jpg" alt="Seller Motivation" className="seller-login-image-main" />
          <div className="seller-login-image-label">Grow Your Brand</div>
        </div>
        <div className="seller-login-form-side">
          <div className="seller-login-title">Seller Login</div>
          <form className="seller-login-form" onSubmit={handleSubmit}>
            <label className="seller-login-label">Email</label>
            <input type="email" className="seller-login-input" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
            <label className="seller-login-label">Password</label>
            <div className="seller-login-password-row">
              <input
                type={showPassword ? "text" : "password"}
                className="seller-login-input"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="seller-login-password-toggle"
                tabIndex="-1"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <div className="seller-login-forgot-row">
              <span className="seller-login-forgot">forgot password ?</span>
            </div>
            <button type="submit" className="seller-login-btn">Log in</button>
          </form>
          <div className="seller-login-divider">
            <span>Or Continue With</span>
          </div>
          <button className="seller-login-google-btn" onClick={handleGoogleLogin}>
            <img src="/src/assets/google-icon.png" alt="Google" className="seller-login-google-icon" />
            Google
          </button>
          <div className="seller-login-signup-row">
            <span>Don't have an account?</span>
            <span className="seller-login-signup-link" onClick={() => navigate("/seller-signup")}>Sign up</span>
          </div>
        </div>
      </div>
    </div>
  );
}
