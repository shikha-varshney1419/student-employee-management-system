import React, { useEffect, useState } from 'react';

/**
 * Floating "contact support" buttons (WhatsApp + Call), fixed to the
 * bottom-right of every admin page. Numbers are placeholders — replace
 * with the real support line before going live.
 */
export default function FloatingActions() {
  return (
    <div className="floating-actions">
      <a
        href="https://wa.me/910000000000" // PLACEHOLDER: replace with real WhatsApp number
        target="_blank"
        rel="noopener noreferrer"
        className="floating-btn bg-grad-green"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <i className="bi bi-whatsapp" />
      </a>
      <a
        href="tel:+910000000000" // PLACEHOLDER: replace with real support number
        className="floating-btn bg-grad-indigo"
        title="Call support"
        aria-label="Call support"
      >
        <i className="bi bi-telephone-fill" />
      </a>
    </div>
  );
}

/**
 * A small circular cursor-follower for desktop pointers. Purely cosmetic;
 * automatically hidden on touch/mobile via CSS media query.
 */
export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const overInteractive = (e) => {
      const target = e.target.closest('button, a, input, select, textarea, .clickable');
      setActive(Boolean(target));
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', overInteractive);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', overInteractive);
    };
  }, []);

  return (
    <div
      className={`custom-cursor ${active ? 'active' : ''}`}
      style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
    />
  );
}
