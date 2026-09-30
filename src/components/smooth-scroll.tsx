'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { setPortfolioScrollDriver } from '@/lib/portfolio-scroll';

export function SmoothScroll() {
  const pathname = usePathname();
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | undefined;
    function setup() {
      lenis?.destroy();
      lenis = undefined;
      if (!preference.matches) {
        lenis = new Lenis({ autoRaf: true, lerp: 0.085, smoothWheel: true, syncTouch: false, anchors: { offset: -32 }, prevent: (node) => node.hasAttribute('data-lenis-prevent') });
      }
      setPortfolioScrollDriver(lenis);
    }
    setup();
    preference.addEventListener('change', setup);
    return () => { preference.removeEventListener('change', setup); lenis?.destroy(); setPortfolioScrollDriver(undefined); };
  }, [pathname]);
  return null;
}
