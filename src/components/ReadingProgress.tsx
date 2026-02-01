'use client';

import { useState, useEffect } from 'react';

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    // Update on scroll
    window.addEventListener('scroll', updateProgress, { passive: true });
    // Update on resize (viewport height changes)
    window.addEventListener('resize', updateProgress, { passive: true });
    // Initial update
    updateProgress();

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 bg-transparent pointer-events-none z-50"
      style={{
        background: `linear-gradient(to right, var(--color-shabrang-gold) ${progress}%, transparent ${progress}%)`,
      }}
    />
  );
}
