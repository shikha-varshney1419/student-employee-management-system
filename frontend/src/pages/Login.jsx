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
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  const validate = () => {
    const errs = {};
    if (!identifier.trim()) errs.identifier = 'Email or username is required.';
    if (!password) errs.password = 'Password is required.';
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
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to log in. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="glass-card p-4 p-md-5" style={{ maxWidth: 440, width: '100%' }}>
        <div className="text-center mb-4">
          <span
            className="brand-logo bg-primary text-white mx-auto mb-3"
            style={{ width: 56, height: 56, fontSize: '1.25rem' }}
          >
            SM
          </span>
          <h4 className="fw-bold mb-1">Admin Login</h4>
          <p className="text-muted small mb-0">Student & Employee Management System</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="identifier" className="form-label small fw-semibold">
              Admin Email / Username
            </label>
            <input
              id="identifier"
              type="text"
              className={`form-control ${fieldErrors.identifier ? 'is-invalid' : ''}`}
              placeholder="admin@example.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              autoFocus
            />
            {fieldErrors.identifier && <div className="invalid-feedback">{fieldErrors.identifier}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label small fw-semibold">
              Password
            </label>
            <div className="input-group">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
              </button>
              {fieldErrors.password && <div className="invalid-feedback">{fieldErrors.password}</div>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={submitting}>
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <p className="text-center text-muted small mt-4 mb-0">
          Default admin credentials are set via <code>backend/.env</code> and created by <code>npm run seed</code>.
        </p>
      </div>
    </div>
  );
}
