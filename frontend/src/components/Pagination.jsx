import React from 'react';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);

  for (let p = start; p <= end; p += 1) pages.push(p);

  return (
    <nav aria-label="Pagination">
      <ul className="pagination justify-content-center mb-0">
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(page - 1)} aria-label="Previous">
            &laquo;
          </button>
        </li>
        {start > 1 && (
          <li className="page-item disabled d-none d-sm-block">
            <span className="page-link">&hellip;</span>
          </li>
        )}
        {pages.map((p) => (
          <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(p)}>
              {p}
            </button>
          </li>
        ))}
        {end < totalPages && (
          <li className="page-item disabled d-none d-sm-block">
            <span className="page-link">&hellip;</span>
          </li>
        )}
        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(page + 1)} aria-label="Next">
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
}
