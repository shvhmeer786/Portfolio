'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    let frame: number | undefined;
    let range = 0;
    function update() {
      frame = undefined;
      const progress = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
    }
    function schedule() {
      if (frame === undefined) frame = requestAnimationFrame(update);
    }
    function measure() {
      range = Math.max(0, document.documentElement.scrollHeight - document.documentElement.clientHeight);
      schedule();
    }
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    observer.observe(document.documentElement);
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
