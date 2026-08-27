import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
  { to: '/students', icon: 'bi-mortarboard-fill', label: 'Student Management' },
  { to: '/employees', icon: 'bi-people-fill', label: 'Employee Management' },
  { to: '/search', icon: 'bi-search', label: 'Search & Filter' },
  { to: '/profile', icon: 'bi-person-circle', label: 'Profile' },
];

export default function Sidebar({ open, onNavigate, onLogoutClick }) {
  return (
    <aside className={`sms-sidebar ${open ? 'open' : ''}`}>

      {/* India Tech Group Branding */}
      <div className="px-3 py-3 text-center">
        <img
          src="/indiatechgroup-logo.png"
          alt="India Tech Group"
          style={{
            width: '70px',
            height: '70px',
            objectFit: 'contain',
            borderRadius: '50%',
          }}
        />

        <div className="fw-bold mt-2">INDIA TECH GROUP</div>
        <div className="small opacity-75">
          Learn • Grow • Succeed
        </div>
      </div>

      {/* Admin Panel Branding */}
      <div className="px-3 pb-4 pt-2 text-center">
        <div className="fw-bold">
          India Tech Group – Admin Panel
        </div>
      </div>

      {/* Navigation */}
      <nav className="nav flex-column px-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `nav-link d-flex align-items-center gap-2 ${
                isActive ? 'active' : ''
              }`
            }
            onClick={onNavigate}
          >
            <i className={`bi ${link.icon}`} />
            {link.label}
          </NavLink>
        ))}

        {/* Logout */}
        <button
          type="button"
          className="nav-link d-flex align-items-center gap-2 border-0 bg-transparent w-100 text-start mt-2"
          onClick={onLogoutClick}
        >
          <i className="bi bi-box-arrow-right" />
          Logout
        </button>
      </nav>

    </aside>
  );
}