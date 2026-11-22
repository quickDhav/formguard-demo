import React, { useState } from 'react';
import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateRequired,
  validateLength,
  validateForm
} from 'formguard-js';
import './App.css';

export default function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [passwordStats, setPasswordStats] = useState(null);

  // Validate a single field in real-time
  const validateSingleField = (name, value, currentData) => {
    switch (name) {
      case 'fullName': {
        const req = validateRequired(value, 'Full name is required.');
        if (!req.isValid) return req.message;
        const len = validateLength(value, 3, 50, 'Name must be between 3 and 50 characters.');
        if (!len.isValid) return len.message;
        return '';
      }
      case 'email': {
        const req = validateRequired(value, 'Email address is required.');
        if (!req.isValid) return req.message;
        const em = validateEmail(value, 'Please enter a valid email address.');
        if (!em.isValid) return em.message;
        return '';
      }
      case 'phone': {
        const req = validateRequired(value, 'Phone number is required.');
        if (!req.isValid) return req.message;
        const ph = validatePhone(value, {
          minLength: 10,
          maxLength: 15,
          message: 'Please enter a valid phone number (at least 10 digits).'
        });
        if (!ph.isValid) return ph.message;
        return '';
      }
      case 'password': {
        const req = validateRequired(value, 'Password is required.');
        if (!req.isValid) return req.message;
        const pass = validatePassword(value, { minLength: 8 });
        setPasswordStats(pass);
        if (!pass.isValid) return pass.message;
        return '';
      }
      case 'confirmPassword': {
        const req = validateRequired(value, 'Please confirm your password.');
        if (!req.isValid) return req.message;
        if (value !== currentData.password) {
          return 'Passwords do not match.';
        }
        return '';
      }
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    // If password changed, update password stats & revalidate confirmPassword if touched
    if (name === 'password') {
      const stats = validatePassword(value, { minLength: 8 });
      setPasswordStats(stats);
      if (touched.confirmPassword && updatedData.confirmPassword) {
        const confirmErr = updatedData.confirmPassword !== value ? 'Passwords do not match.' : '';
        setErrors((prev) => ({ ...prev, confirmPassword: confirmErr }));
      }
    }

    if (touched[name]) {
      const fieldError = validateSingleField(name, value, updatedData);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateSingleField(name, value, formData);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true
    });

    // Use FormGuard.js `validateForm` to validate entire submission
    const formRules = {
      fullName: [
        { rule: 'required', message: 'Full name is required.' },
        { rule: 'length', min: 3, max: 50, message: 'Name must be between 3 and 50 characters.' }
      ],
      email: [
        { rule: 'required', message: 'Email address is required.' },
        { rule: 'email', message: 'Please enter a valid email address.' }
      ],
      phone: [
        { rule: 'required', message: 'Phone number is required.' },
        { rule: 'phone', options: { minLength: 10 } }
      ],
      password: [
        { rule: 'required', message: 'Password is required.' },
        { rule: 'password', options: { minLength: 8 } }
      ],
      confirmPassword: [
        { rule: 'required', message: 'Please confirm your password.' },
        {
          rule: 'custom',
          validator: (val, all) => val === all.password,
          message: 'Passwords do not match.'
        }
      ]
    };

    const result = validateForm(formData, formRules);

    if (!result.isValid) {
      setErrors(result.errors);
      setSubmitted(false);
    } else {
      setErrors({});
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setTouched({});
    setSubmitted(false);
    setPasswordStats(null);
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'strong':
        return '#10b981'; // Green
      case 'medium':
        return '#f59e0b'; // Amber
      case 'weak':
      default:
        return '#ef4444'; // Red
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="badge">NPM Package Demo</div>
        <h1>
          FormGuard<span>.js</span>
        </h1>
        <p className="tagline">
          Simple, lightweight and reusable JavaScript form validation library.
        </p>
      </header>

      <main className="main-content">
        {submitted ? (
          <div className="success-card">
            <div className="success-icon">✓</div>
            <h2>Registration Successful!</h2>
            <p>
              FormGuard.js successfully validated all form inputs without any errors.
            </p>
            <div className="summary-box">
              <p><strong>Name:</strong> {formData.fullName}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Phone:</strong> {formData.phone}</p>
              <p><strong>Password Strength:</strong> <span className="status-tag strong">{passwordStats?.strength?.toUpperCase()}</span></p>
            </div>
            <button className="reset-button" onClick={handleReset}>
              Submit Another Response
            </button>
          </div>
        ) : (
          <form className="form-card" onSubmit={handleSubmit} noValidate>
            <h2>Create Your Account</h2>
            <p className="form-subtitle">
              All validations below are powered by the <code>formguard-js</code> package.
            </p>

            {/* Full Name */}
            <div className={`form-group ${errors.fullName && touched.fullName ? 'has-error' : ''}`}>
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="e.g. Ada Lovelace"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.fullName && errors.fullName && (
                <span className="error-message">⚠️ {errors.fullName}</span>
              )}
            </div>

            {/* Email Address */}
            <div className={`form-group ${errors.email && touched.email ? 'has-error' : ''}`}>
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. ada@computing.org"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.email && errors.email && (
                <span className="error-message">⚠️ {errors.email}</span>
              )}
            </div>

            {/* Phone Number */}
            <div className={`form-group ${errors.phone && touched.phone ? 'has-error' : ''}`}>
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="e.g. +1 (555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.phone && errors.phone && (
                <span className="error-message">⚠️ {errors.phone}</span>
              )}
            </div>

            {/* Password */}
            <div className={`form-group ${errors.password && touched.password ? 'has-error' : ''}`}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter a secure password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.password && errors.password && (
                <span className="error-message">⚠️ {errors.password}</span>
              )}

              {/* Password Strength Indicator */}
              {formData.password.length > 0 && passwordStats && (
                <div className="strength-meter">
                  <div className="strength-header">
                    <span>Password Strength:</span>
                    <strong style={{ color: getStrengthColor(passwordStats.strength) }}>
                      {passwordStats.strength.toUpperCase()}
                    </strong>
                  </div>
                  <div className="strength-track">
                    <div
                      className="strength-bar"
                      style={{
                        width: `${(passwordStats.score / 4) * 100}%`,
                        backgroundColor: getStrengthColor(passwordStats.strength)
                      }}
                    />
                  </div>
                  <div className="criteria-list">
                    <span className={passwordStats.details.length ? 'met' : 'unmet'}>
                      {passwordStats.details.length ? '✓' : '•'} 8+ chars
                    </span>
                    <span className={passwordStats.details.uppercase ? 'met' : 'unmet'}>
                      {passwordStats.details.uppercase ? '✓' : '•'} Uppercase
                    </span>
                    <span className={passwordStats.details.lowercase ? 'met' : 'unmet'}>
                      {passwordStats.details.lowercase ? '✓' : '•'} Lowercase
                    </span>
                    <span className={passwordStats.details.number ? 'met' : 'unmet'}>
                      {passwordStats.details.number ? '✓' : '•'} Number
                    </span>
                    <span className={passwordStats.details.special ? 'met' : 'unmet'}>
                      {passwordStats.details.special ? '✓' : '•'} Special
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className={`form-group ${errors.confirmPassword && touched.confirmPassword ? 'has-error' : ''}`}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <span className="error-message">⚠️ {errors.confirmPassword}</span>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-button">
              Register with FormGuard
            </button>
          </form>
        )}
      </main>

      <footer className="footer">
        <p>Built with ❤️ using <strong>formguard-js</strong> • College Assignment Project</p>
      </footer>
    </div>
  );
}

