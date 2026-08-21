import React from 'react';

export default function StatusBadge({ status }) {
  const isActive = status === 'Active';
  return (
    <span
      className={`status-badge ${isActive ? 'bg-success-subtle text-success-emphasis' : 'bg-secondary-subtle text-secondary-emphasis'}`}
    >
      <i className={`bi ${isActive ? 'bi-check-circle-fill' : 'bi-pause-circle-fill'} me-1`} />
      {status}
    </span>
  );
}
