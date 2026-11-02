'use client';

import { useEffect } from 'react';

// Highlights the "On this page" link for the section being read. Progressive
// enhancement only: the links work without it.
export default function TocSpy({ ids }) {
  useEffect(() => {
    const headings = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!headings.length || !('IntersectionObserver' in window)) return undefined;

    let current = null;
    const setCurrent = (id) => {
      if (id === current) return;
      current = id;
      document.querySelectorAll('[data-toc] a[href^="#"]').forEach((link) => {
        if (link.getAttribute('href') === `#${id}`) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setCurrent(visible[0].target.id);
      },
      { rootMargin: '-12% 0px -72% 0px' },
    );
    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [ids]);

  return null;
}
