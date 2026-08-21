import React from 'react';
import useAuth from '../hooks/useAuth';

export default function Profile() {
  const { admin } = useAuth();

  return (
    <div>
      <h4 className="fw-bold mb-4">Profile</h4>
      <div className="glass-card p-4" style={{ maxWidth: 480 }}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <span
            className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center fw-bold"
            style={{ width: 64, height: 64, fontSize: '1.5rem' }}
          >
            {admin?.username ? admin.username.slice(0, 2).toUpperCase() : 'AD'}
          </span>
          <div>
            <h5 className="mb-0">{admin?.username || 'Admin'}</h5>
            <div className="text-muted small">Administrator</div>
          </div>
        </div>

        <dl className="row mb-0">
          <dt className="col-sm-4 text-muted fw-normal">Username</dt>
          <dd className="col-sm-8">{admin?.username || '—'}</dd>

          <dt className="col-sm-4 text-muted fw-normal">Email</dt>
          <dd className="col-sm-8">{admin?.email || '—'}</dd>

          <dt className="col-sm-4 text-muted fw-normal">Admin ID</dt>
          <dd className="col-sm-8">{admin?.id ?? '—'}</dd>
        </dl>
      </div>
    </div>
  );
}
