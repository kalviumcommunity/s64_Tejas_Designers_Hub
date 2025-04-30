import React, { useState } from "react";
import "./SellerSignup.css";
import { useNavigate } from "react-router-dom";

export default function SellerSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    shopName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Implement seller signup logic
    navigate("/seller-dashboard");
  };

  return (
    <div className="seller-signup-root">
      <div className="seller-signup-card">
        <div className="seller-signup-image-side">
          <img src="/src/assets/seller-signup.jpg" alt="Seller Welcome" className="seller-signup-image-main" />
          <div className="seller-signup-image-label">Welcome Seller!</div>
        </div>
        <div className="seller-signup-form-side">
          <div className="seller-signup-title">Seller Registration</div>
          <form className="seller-signup-form" onSubmit={handleSubmit}>
            <label className="seller-signup-label">Shop Name</label>
            <input name="shopName" className="seller-signup-input" placeholder="Shop Name" value={form.shopName} onChange={handleChange} required />
            <label className="seller-signup-label">Owner Name</label>
            <input name="ownerName" className="seller-signup-input" placeholder="Owner Name" value={form.ownerName} onChange={handleChange} required />
            <label className="seller-signup-label">Email</label>
            <input name="email" type="email" className="seller-signup-input" placeholder="Email Address" value={form.email} onChange={handleChange} required />
            <label className="seller-signup-label">Phone</label>
            <input name="phone" type="tel" className="seller-signup-input" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
            <label className="seller-signup-label">Password</label>
            <div className="seller-signup-password-row">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                className="seller-signup-input"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="seller-signup-password-toggle"
                tabIndex="-1"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "🔒"}
              </button>
            </div>
            <label className="seller-signup-label">Confirm Password</label>
            <div className="seller-signup-password-row">
              <input
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                className="seller-signup-input"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="seller-signup-password-toggle"
                tabIndex="-1"
                onClick={() => setShowConfirm(v => !v)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? "🙈" : "🔒"}
              </button>
            </div>
            <button type="submit" className="seller-signup-btn">Register</button>
          </form>
          <div className="seller-signup-login-row">
            <span>Already have an account?</span>
            <span className="seller-signup-login-link" onClick={() => navigate("/seller-login")}>Log in</span>
          </div>
        </div>
      </div>
    </div>
  );
}
