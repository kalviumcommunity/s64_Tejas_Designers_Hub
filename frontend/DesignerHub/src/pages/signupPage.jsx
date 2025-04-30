import React, { useState } from "react";
import "./signupPage.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    gender: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    
    // Check if passwords match
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          gender: form.gender,
          password: form.password
        }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Registration failed");
      }

      const data = await response.json();
      // Store the token
      localStorage.setItem('token', data.token);
      // Update auth context if needed
      if (signup) {
        signup(data.user);
      }
      // Navigate to home page
      navigate('/');
    } catch (error) {
      setError(error.message || "An error occurred during registration");
      console.error(error);
    }
  }
  
  return (
    <div className="signup-root">
      <div className="signup-card">
        <div className="signup-image-side">
          <img src="/src/assets/signup-side.jpg" alt="Signup Visual" className="signup-image-main" />
          <div className="signup-image-label">WELCOME!</div>
        </div>
        <div className="signup-form-side">
          <div className="signup-title">REGISTRATION FORM</div>
          {error && <div className="signup-error">{error}</div>}
          <form className="signup-form" onSubmit={handleSignup}>
            <div className="signup-row">
              <input name="firstName" className="signup-input" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
              <input name="lastName" className="signup-input" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
            </div>
            <input name="email" type="email" className="signup-input" placeholder="Email Address" value={form.email} onChange={handleChange} required />
            <select name="gender" className="signup-select" value={form.gender} onChange={handleChange} required>
              <option value="" disabled>Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <div className="signup-row">
              <div className="signup-password-wrap">
                <input name="password" type={showPassword ? "text" : "password"} className="signup-input" placeholder="Password" value={form.password} onChange={handleChange} required />
                <button type="button" className="signup-password-toggle" tabIndex="-1" onClick={() => setShowPassword(v => !v)}>{showPassword ? "🙈" : "🔒"}</button>
              </div>
              <div className="signup-password-wrap">
                <input name="confirmPassword" type={showConfirm ? "text" : "password"} className="signup-input" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
                <button type="button" className="signup-password-toggle" tabIndex="-1" onClick={() => setShowConfirm(v => !v)}>{showConfirm ? "🙈" : "🔒"}</button>
              </div>
            </div>
            <button type="submit" className="signup-btn">Register <span className="signup-btn-arrow">→</span></button>
          </form>
        </div>
      </div>
    </div>
  );
}
