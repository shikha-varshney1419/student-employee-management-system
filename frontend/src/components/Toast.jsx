import React, { useEffect } from 'react';

/**
 * A simple, self-dismissing toast fixed to the top-right corner.
 * variant: 'success' | 'danger' | 'warning' | 'info'
 */
export default function Toast({ show, message, variant = 'success', onClose, duration = 3500 }) {
  useEffect(() => {
    if (!show) return undefined;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  const icon = variant === 'success' ? 'bi-check-circle-fill' : variant === 'danger' ? 'bi-x-circle-fill' : 'bi-info-circle-fill';

  return (
    <div
      className={`toast align-items-center text-bg-${variant} border-0 show position-fixed top-0 end-0 m-3`}
      style={{ zIndex: 2000, minWidth: '280px' }}
      role="alert"
    >
      <div className="d-flex">
        <div className="toast-body">
          <i className={`bi ${icon} me-2`} />
          {message}
        </div>
        <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={onClose} />
      </div>
    </div>
  );
}
