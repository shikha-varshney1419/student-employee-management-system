import { useEffect, useRef } from 'react';

/**
 * Attaches an IntersectionObserver to the returned ref; when the element
 * scrolls into view, adds the "in-view" class which index.css transitions
 * (fade + slide up) for the ".reveal" utility class.
 */
export default function useScrollReveal(options = { threshold: 0.15 }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
