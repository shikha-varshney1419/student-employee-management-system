import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  const validate = () => {
    const errs = {};

    if (!identifier.trim()) {
      errs.identifier = 'Email or username is required.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setSubmitting(true);

    try {
      await login(identifier.trim(), password);

      const redirectTo =
        location.state?.from?.pathname || '/dashboard';

      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        'Unable to log in. Please try again.';

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center p-3"
      style={{
        background: '#F5F7FA',
      }}
    >
      <div
        className="bg-white rounded-4 overflow-hidden shadow-lg"
        style={{
          width: '100%',
          maxWidth: '1050px',
          minHeight: '600px',
        }}
      >
        <div className="row g-0 h-100">

          {/* LEFT SIDE */}
          <div
            className="col-lg-6 d-flex flex-column align-items-center justify-content-center text-center p-5"
            style={{
              background: '#0B1F3A',
              color: '#FFFFFF',
            }}
          >
            <img
              src="/indiatechgroup-logo.png"
              alt="India Tech Group"
              style={{
                width: '145px',
                height: '145px',
                objectFit: 'contain',
                marginBottom: '25px',
              }}
            />

            <h2
              className="fw-bold mb-2"
              style={{ color: '#FFFFFF' }}
            >
              INDIA TECH GROUP
            </h2>

            <p
              className="mb-4"
              style={{
                fontSize: '1.05rem',
                letterSpacing: '1px',
              }}
            >
              Learn • Grow • Succeed
            </p>

            <div
              style={{
                width: '80%',
                maxWidth: '380px',
                borderRadius: '18px',
                padding: '25px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <h5
                className="fw-semibold mb-2"
                style={{ color: '#FFFFFF' }}
              >
                India Tech Group
              </h5>

              <h5
                className="fw-semibold mb-3"
                style={{ color: '#FFFFFF' }}
              >
                Management System
              </h5>

              <p
                className="mb-0"
                style={{
                  fontSize: '0.9rem',
                  opacity: 0.8,
                  lineHeight: 1.6,
                }}
              >
                Manage students, interns, employees and
                administrative records efficiently.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div
            className="col-lg-6 d-flex align-items-center justify-content-center p-4 p-md-5"
            style={{
              background: '#FFFFFF',
            }}
          >
            <div style={{ width: '100%', maxWidth: '420px' }}>

              <div className="text-center mb-4">
                <img
                  src="/indiatechgroup-logo.png"
                  alt="India Tech Group"
                  style={{
                    width: '65px',
                    height: '65px',
                    objectFit: 'contain',
                    marginBottom: '12px',
                  }}
                />

                <h2
                  className="fw-bold mb-1"
                  style={{ color: '#0B1F3A' }}
                >
                  Admin Login
                </h2>

                <p
                  className="mb-0"
                  style={{
                    color: '#64748B',
                    fontSize: '0.85rem',
                  }}
                >
                  Student • Intern • Employee Management
                </p>
              </div>

              {error && (
                <div
                  className="alert alert-danger py-2 small"
                  role="alert"
                >
                  <i className="bi bi-exclamation-triangle-fill me-2" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>

                {/* EMAIL */}
                <div className="mb-3">
                  <label
                    htmlFor="identifier"
                    className="form-label fw-semibold"
                    style={{ color: '#0B1F3A' }}
                  >
                    Admin Email / Username
                  </label>

                  <input
                    id="identifier"
                    type="text"
                    className={`form-control form-control-lg ${
                      fieldErrors.identifier ? 'is-invalid' : ''
                    }`}
                    placeholder="Enter admin email / username"
                    value={identifier}
                    onChange={(e) =>
                      setIdentifier(e.target.value)
                    }
                    autoComplete="username"
                    autoFocus
                  />

                  {fieldErrors.identifier && (
                    <div className="invalid-feedback">
                      {fieldErrors.identifier}
                    </div>
                  )}
                </div>

                {/* PASSWORD */}
                <div className="mb-3">
                  <label
                    htmlFor="password"
                    className="form-label fw-semibold"
                    style={{ color: '#0B1F3A' }}
                  >
                    Password
                  </label>

                  <div className="input-group">
                    <input
                      id="password"
                      type={
                        showPassword ? 'text' : 'password'
                      }
                      className={`form-control form-control-lg ${
                        fieldErrors.password ? 'is-invalid' : ''
                      }`}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      autoComplete="current-password"
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      tabIndex={-1}
                    >
                      <i
                        className={`bi ${
                          showPassword
                            ? 'bi-eye-slash'
                            : 'bi-eye'
                        }`}
                      />
                    </button>
                  </div>

                  {fieldErrors.password && (
                    <div className="text-danger small mt-1">
                      {fieldErrors.password}
                    </div>
                  )}
                </div>

                {/* REMEMBER + FORGOT */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) =>
                        setRememberMe(e.target.checked)
                      }
                    />

                    <label
                      className="form-check-label small"
                      htmlFor="rememberMe"
                    >
                      Remember me
                    </label>
                  </div>

                  <span
                    className="small"
                    style={{
                      color: '#F39A1E',
                      cursor: 'default',
                    }}
                  >
                    Forgot Password?
                  </span>
                </div>

                {/* LOGIN */}
                <button
                  type="submit"
                  className="btn btn-lg w-100 fw-semibold"
                  style={{
                    backgroundColor: '#F39A1E',
                    borderColor: '#F39A1E',
                    color: '#FFFFFF',
                  }}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login
                      <i className="bi bi-arrow-right ms-2" />
                    </>
                  )}
                </button>
              </form>

              <p
                className="text-center small mt-4 mb-0"
                style={{ color: '#64748B' }}
              >
                © 2026 India Tech Group
                <br />
                India Tech Group Management System
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}