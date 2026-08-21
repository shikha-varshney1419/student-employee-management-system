import React from 'react';

export default function EmptyState({ icon = 'bi-inbox', title = 'No records found', subtitle, actionLabel, onAction }) {
  return (
    <div className="text-center py-5">
      <i className={`bi ${icon}`} style={{ fontSize: '3rem', opacity: 0.35 }} />
      <h5 className="mt-3">{title}</h5>
      {subtitle && <p className="text-muted mb-3">{subtitle}</p>}
      {actionLabel && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
