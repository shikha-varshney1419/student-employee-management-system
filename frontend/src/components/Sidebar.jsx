import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

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
      <div className="d-flex align-items-center gap-2 px-3 py-4">
        <span className="brand-logo">SM</span>
        <div>
          <div className="fw-bold">SMS Admin</div>
          <div className="small opacity-75">Management Suite</div>
        </div>
      </div>
      <nav className="nav flex-column px-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-link d-flex align-items-center gap-2 ${isActive ? 'active' : ''}`}
            onClick={onNavigate}
          >
            <i className={`bi ${link.icon}`} />
            {link.label}
          </NavLink>
        ))}
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
