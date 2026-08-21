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
    <div>
      <CustomCursor />
      <Sidebar
        open={sidebarOpen}
        onNavigate={() => setSidebarOpen(false)}
        onLogoutClick={() => setShowLogoutConfirm(true)}
      />
      {sidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-lg-none"
          style={{ background: 'rgba(0,0,0,0.4)', zIndex: 1020 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="sms-main">
        <Navbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onLogoutClick={() => setShowLogoutConfirm(true)}
        />
        <main className="p-3 p-md-4">{children}</main>
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
