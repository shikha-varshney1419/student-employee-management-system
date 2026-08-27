import React from 'react';

export default function ConfirmModal({
  show,
  title = 'Confirm action',
  message = 'Are you sure?',
  confirmLabel = 'Delete',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!show) return null;

  return (
    <>
      {/* Dark background overlay */}
      <div
        className="modal-backdrop fade show"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1050,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
        }}
      />

      {/* Confirmation Modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1060,
          overflowY: 'auto',
        }}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{
            minHeight: 'calc(100% - 1rem)',
          }}
        >
          <div
            className="modal-content border-0 shadow-lg"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#0B1F3A',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              className="modal-header"
              style={{
                borderBottom: '1px solid rgba(11, 31, 58, 0.08)',
                padding: '1.25rem 1.5rem',
              }}
            >
              <h5
                className="modal-title fw-bold mb-0"
                style={{ color: '#0B1F3A' }}
              >
                {title}
              </h5>

              <button
                type="button"
                className="btn-close"
                onClick={onCancel}
                disabled={loading}
                aria-label="Close"
              />
            </div>

            {/* Body */}
            <div
              className="modal-body"
              style={{
                padding: '1.5rem',
                color: '#475569',
              }}
            >
              <p className="mb-0">{message}</p>
            </div>

            {/* Footer */}
            <div
              className="modal-footer"
              style={{
                borderTop: '1px solid rgba(11, 31, 58, 0.08)',
                padding: '1rem 1.5rem',
              }}
            >
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="button"
                className={`btn btn-${confirmVariant}`}
                onClick={onConfirm}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    Please wait...
                  </>
                ) : (
                  confirmLabel
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}