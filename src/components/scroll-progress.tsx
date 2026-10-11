'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    let frame: number | undefined;
    let range = 0;
    const darkSections = Array.from(document.querySelectorAll<HTMLElement>('.dark-section'));
    let darkRanges: { top: number; bottom: number }[] = [];
    function update() {
      frame = undefined;
      const progress = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
      if (bar.current) {
        bar.current.style.transform = `scaleX(${progress})`;
        const dark = darkRanges.some(section => window.scrollY + 1 >= section.top && window.scrollY + 1 < section.bottom);
        const surface = dark ? 'dark' : 'light';
        if (bar.current.dataset.surface !== surface) bar.current.dataset.surface = surface;
      }
    }
    function schedule() {
      if (frame === undefined) frame = requestAnimationFrame(update);
    }
    function measure() {
      range = Math.max(0, document.documentElement.scrollHeight - document.documentElement.clientHeight);
      darkRanges = darkSections.map(section => {
        const bounds = section.getBoundingClientRect();
        return { top: bounds.top + window.scrollY, bottom: bounds.bottom + window.scrollY };
      });
      schedule();
    }
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    observer.observe(document.documentElement);
    darkSections.forEach(section => observer.observe(section));
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('pageshow', measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      window.removeEventListener('pageshow', measure);
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return <div ref={bar} className="scroll-progress" aria-hidden="true" />;
}
