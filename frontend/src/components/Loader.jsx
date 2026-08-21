import React from 'react';

export default function Loader({ fullscreen = false, label = 'Loading...' }) {
  const content = (
    <div className="d-flex flex-column align-items-center justify-content-center gap-3 py-5">
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">{label}</span>
      </div>
      <div className="text-muted small">{label}</div>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        {content}
      </div>
    );
  }

  return content;
}
