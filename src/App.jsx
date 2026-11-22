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
  const [showPassword, setShowPassword] = useState(false);
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);
  const [lastSubmissionResult, setLastSubmissionResult] = useState(null);

  const copyInstallCommand = () => {
    navigator.clipboard.writeText('npm install formguard-js');
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

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
        const em = validateEmail(value, 'Please enter a valid work or personal email address.');
        if (!em.isValid) return em.message;
        return '';
      }
      case 'phone': {
        const req = validateRequired(value, 'Phone number is required.');
        if (!req.isValid) return req.message;
        const ph = validatePhone(value, {
          minLength: 10,
          maxLength: 15,
          message: 'Phone must be a valid number with at least 10 digits.'
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

    setTouched({
      fullName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true
    });

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
    setLastSubmissionResult(result);

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
    setShowRawJson(false);
  };

  const getStrengthTier = () => {
    if (!passwordStats || !formData.password) return { label: 'Empty', color: '#64748b', score: 0 };
    switch (passwordStats.strength) {
      case 'strong':
        return { label: 'Strong', color: '#10b981', score: 4 };
      case 'medium':
        return { label: 'Medium', color: '#f59e0b', score: 2 };
      case 'weak':
      default:
        return { label: 'Weak', color: '#f43f5e', score: 1 };
    }
  };

  const strengthTier = getStrengthTier();

  return (
    <div className="layout-wrapper">
      {/* Navbar */}
      <header className="navbar">
        <div className="nav-brand">
          <div className="brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">FormGuard<span>.js</span></span>
            <span className="version-pill">v1.0.0</span>
          </div>
        </div>

        <div className="nav-actions">
          <button className="copy-cmd-btn" onClick={copyInstallCommand} title="Copy install command">
            <code>npm i formguard-js</code>
            <span className="copy-icon">
              {copiedInstall ? '✓ Copied' : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              )}
            </span>
          </button>

          <a
            href="https://github.com/quickDhav/formguard-js"
            target="_blank"
            rel="noreferrer"
            className="github-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </header>

      {/* Hero Header */}
      <section className="hero">
        <div className="badge-highlight">
          <span className="dot"></span> NPM Library Showcase
        </div>
        <h1 className="hero-title">
          Enterprise Form Validation <br />
          <span>Made Lightweight & Simple.</span>
        </h1>
        <p className="hero-subtitle">
          Experience real-time field validation, password scoring, and form schema orchestration powered by the <strong>formguard-js</strong> engine.
        </p>

        <div className="feature-pills">
          <span className="pill">⚡ 0 Dependencies</span>
          <span className="pill">🔐 Real-time Scoring</span>
          <span className="pill">📱 International E.164</span>
          <span className="pill">📧 RFC 5322 Compliant</span>
          <span className="pill">🧪 100% Tested</span>
        </div>
      </section>

      {/* Main Container */}
      <main className="card-container">
        {submitted ? (
          <div className="result-card success-view">
            <div className="success-badge">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2>Verification Passed!</h2>
            <p className="success-desc">
              All rules passed. The payload is sanitized, schema-validated, and ready for your backend API.
            </p>

            <div className="data-table">
              <div className="data-row">
                <span className="data-key">Full Name</span>
                <span className="data-val">{formData.fullName}</span>
              </div>
              <div className="data-row">
                <span className="data-key">Email Address</span>
                <span className="data-val">{formData.email}</span>
              </div>
              <div className="data-row">
                <span className="data-key">Phone</span>
                <span className="data-val">{formData.phone}</span>
              </div>
              <div className="data-row">
                <span className="data-key">Password Strength</span>
                <span className="status-badge strong">
                  ✓ {passwordStats?.strength?.toUpperCase()} ({passwordStats?.score}/4)
                </span>
              </div>
            </div>

            <div className="accordion-wrapper">
              <button
                type="button"
                className="accordion-toggle"
                onClick={() => setShowRawJson(!showRawJson)}
              >
                <span>{showRawJson ? 'Hide' : 'Inspect'} Raw validateForm Output</span>
                <span className="chevron">{showRawJson ? '▲' : '▼'}</span>
              </button>
              {showRawJson && (
                <pre className="json-preview">
                  {JSON.stringify(lastSubmissionResult, null, 2)}
                </pre>
              )}
            </div>

            <button className="primary-action-btn" onClick={handleReset}>
              Reset and Test Again
            </button>
          </div>
        ) : (
          <form className="glass-form" onSubmit={handleSubmit} noValidate>
            <div className="form-top">
              <h2>Account Registration</h2>
              <p>Fill out the fields to test real-time validation feedback.</p>
            </div>

            {/* Field: Full Name */}
            <div className={`input-field-group ${errors.fullName && touched.fullName ? 'error' : ''} ${touched.fullName && !errors.fullName && formData.fullName ? 'valid' : ''}`}>
              <label htmlFor="fullName">Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="e.g. Ada Lovelace"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="name"
                />
                {touched.fullName && !errors.fullName && formData.fullName && (
                  <span className="input-valid-icon">✓</span>
                )}
              </div>
              {touched.fullName && errors.fullName && (
                <div className="error-banner">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span>{errors.fullName}</span>
                </div>
              )}
            </div>

            {/* Field: Email Address */}
            <div className={`input-field-group ${errors.email && touched.email ? 'error' : ''} ${touched.email && !errors.email && formData.email ? 'valid' : ''}`}>
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="e.g. ada@computing.org"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                />
                {touched.email && !errors.email && formData.email && (
                  <span className="input-valid-icon">✓</span>
                )}
              </div>
              {touched.email && errors.email && (
                <div className="error-banner">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Field: Phone */}
            <div className={`input-field-group ${errors.phone && touched.phone ? 'error' : ''} ${touched.phone && !errors.phone && formData.phone ? 'valid' : ''}`}>
              <label htmlFor="phone">Phone Number</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </span>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="e.g. +1 (555) 123-4567"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="tel"
                />
                {touched.phone && !errors.phone && formData.phone && (
                  <span className="input-valid-icon">✓</span>
                )}
              </div>
              {touched.phone && errors.phone && (
                <div className="error-banner">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span>{errors.phone}</span>
                </div>
              )}
            </div>

            {/* Field: Password */}
            <div className={`input-field-group ${errors.password && touched.password ? 'error' : ''} ${touched.password && !errors.password && formData.password ? 'valid' : ''}`}>
              <div className="label-row">
                <label htmlFor="password">Password</label>
                {formData.password && (
                  <span className="strength-label" style={{ color: strengthTier.color }}>
                    Strength: {strengthTier.label}
                  </span>
                )}
              </div>

              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>

              {/* Segmented Strength Bar */}
              {formData.password.length > 0 && passwordStats && (
                <div className="strength-widget">
                  <div className="segments-track">
                    <div className={`segment ${passwordStats.score >= 1 ? 'filled' : ''}`} style={{ backgroundColor: passwordStats.score >= 1 ? strengthTier.color : undefined }} />
                    <div className={`segment ${passwordStats.score >= 2 ? 'filled' : ''}`} style={{ backgroundColor: passwordStats.score >= 2 ? strengthTier.color : undefined }} />
                    <div className={`segment ${passwordStats.score >= 3 ? 'filled' : ''}`} style={{ backgroundColor: passwordStats.score >= 3 ? strengthTier.color : undefined }} />
                    <div className={`segment ${passwordStats.score >= 4 ? 'filled' : ''}`} style={{ backgroundColor: passwordStats.score >= 4 ? strengthTier.color : undefined }} />
                  </div>

                  <div className="checklist-grid">
                    <span className={`check-chip ${passwordStats.details.length ? 'done' : ''}`}>
                      {passwordStats.details.length ? '✓' : '•'} 8+ chars
                    </span>
                    <span className={`check-chip ${passwordStats.details.uppercase ? 'done' : ''}`}>
                      {passwordStats.details.uppercase ? '✓' : '•'} Uppercase
                    </span>
                    <span className={`check-chip ${passwordStats.details.lowercase ? 'done' : ''}`}>
                      {passwordStats.details.lowercase ? '✓' : '•'} Lowercase
                    </span>
                    <span className={`check-chip ${passwordStats.details.number ? 'done' : ''}`}>
                      {passwordStats.details.number ? '✓' : '•'} Number
                    </span>
                    <span className={`check-chip ${passwordStats.details.special ? 'done' : ''}`}>
                      {passwordStats.details.special ? '✓' : '•'} Special
                    </span>
                  </div>
                </div>
              )}

              {touched.password && errors.password && (
                <div className="error-banner">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Field: Confirm Password */}
            <div className={`input-field-group ${errors.confirmPassword && touched.confirmPassword ? 'error' : ''} ${touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword ? 'valid' : ''}`}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                />
                {touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword && (
                  <span className="input-valid-icon">✓</span>
                )}
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <div className="error-banner">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span>{errors.confirmPassword}</span>
                </div>
              )}
            </div>

            {/* Submit CTA Button */}
            <button type="submit" className="primary-action-btn">
              Validate & Submit
            </button>
          </form>
        )}
      </main>

      {/* Footer */}
      <footer className="page-footer">
        <p>Built with <strong>FormGuard.js</strong> • Zero Dependencies • ES Modules</p>
      </footer>
    </div>
  );
}
