import React, { useState } from "react";
import "./loginPage.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        mode: 'cors',
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token
        localStorage.setItem('token', data.token);
        
        // Also store user data in localStorage as a backup
        if (data.user) {
          localStorage.setItem('userInfo', JSON.stringify(data.user));
          console.log("User info stored in localStorage:", data.user);
        }
        
        // Update auth context
        if (login) {
          login(data.user);
        }
        
        // Navigate to home page
        navigate("/");
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-card">
        <div className="login-form-side">
          <div className="login-title">
            <span className="login-title-dot" /> Log In
          </div>
          <div className="login-desc">Welcome back! Please enter your details</div>
          {error && <div className="login-error">{error}</div>}
          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-label">Email</label>
            <input 
              type="email" 
              className="login-input" 
              placeholder="Enter your email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
            <label className="login-label">Password</label>
            <div className="login-password-row">
              <input
                type={showPassword ? "text" : "password"}
                className="login-input"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="login-password-toggle"
                tabIndex="-1"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <div className="login-forgot-row">
              <span className="login-forgot">forgot password ?</span>
            </div>
            <button 
              type="submit" 
              className="login-btn" 
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>
          <div className="login-divider">
            <span>Or Continue With</span>
          </div>
          <button 
            className="login-google-btn" 
            onClick={() => navigate("/")}
            disabled={isLoading}
          >
            <img src="/src/assets/google-icon.png" alt="Google" className="login-google-icon" />
            Google
          </button>
          <div className="login-signup-row">
            <span>Don't have account?</span>
            <span className="login-signup-link" onClick={() => navigate("/signup")}>Sign up</span>
          </div>
        </div>
        <div className="login-image-side">
          <div className="login-image-bg" />
          <div className="login-image-overlay" />
          <img src="/src/assets/login-side.jpg" alt="Login Visual" className="login-image-main" />
        </div>
      </div>
    </div>
  );
}
