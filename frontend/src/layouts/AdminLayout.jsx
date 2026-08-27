import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import FloatingActions, { CustomCursor } from '../components/FloatingActions.jsx';
import useAuth from '../hooks/useAuth';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
    setShowLogoutConfirm(false);
    navigate('/login', { replace: true });
  };

  return (
    <div className="admin-layout">
      <CustomCursor />

      <Sidebar
        open={sidebarOpen}
        onNavigate={() => setSidebarOpen(false)}
        onLogoutClick={() => setShowLogoutConfirm(true)}
      />

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="sms-main">
        <Navbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onLogoutClick={() => setShowLogoutConfirm(true)}
        />

        <main className="admin-content">
          {children}
        </main>
      </div>

      <FloatingActions />

      <ConfirmModal
        show={showLogoutConfirm}
        title="Log out"
        message="Are you sure you want to log out of the admin dashboard?"
        confirmLabel="Log out"
        confirmVariant="danger"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
        loading={loggingOut}
      />
    </div>
  );
}