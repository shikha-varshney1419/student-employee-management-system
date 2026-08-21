import React from 'react';
import useAuth from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';

export default function Navbar({ onToggleSidebar, onLogoutClick }) {
  const { admin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const initials = admin?.username ? admin.username.slice(0, 2).toUpperCase() : 'AD';

  return (
    <header className="glass-card d-flex align-items-center justify-content-between px-3 py-2 mx-3 mt-3 sticky-top" style={{ zIndex: 1020 }}>
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-light d-lg-none" onClick={onToggleSidebar} aria-label="Toggle menu">
          <i className="bi bi-list fs-5" />
        </button>
        <h6 className="mb-0 fw-semibold d-none d-sm-block">Welcome back{admin?.username ? `, ${admin.username}` : ''} 👋</h6>
      </div>

      <div className="d-flex align-items-center gap-2">
        <button
          className="theme-toggle-btn btn btn-light"
          onClick={toggleTheme}
          title="Toggle dark / light mode"
          aria-label="Toggle theme"
        >
          <i className={`bi ${theme === 'light' ? 'bi-moon-stars-fill' : 'bi-sun-fill'}`} />
        </button>

        <div className="dropdown">
          <button
            className="btn btn-light d-flex align-items-center gap-2"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span
              className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
              style={{ width: 32, height: 32, fontSize: '0.8rem', fontWeight: 700 }}
            >
              {initials}
            </span>
            <span className="d-none d-md-inline">{admin?.username || 'Admin'}</span>
            <i className="bi bi-chevron-down small" />
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <a className="dropdown-item" href="/profile">
                <i className="bi bi-person me-2" />
                Profile
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button className="dropdown-item text-danger" onClick={onLogoutClick}>
                <i className="bi bi-box-arrow-right me-2" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
