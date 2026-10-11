'use client';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';
import artworks from '@/content/entrance-art.json';

const duration = 2250;
const artworkSizes = '(max-width: 760px) min(144px, 30.4vw), 168px';
const fan = [
  { x: '-85%', y: '8%', rotation: '-12deg', orbitX: '-32%', orbitY: '-32%' },
  { x: '-28%', y: '-12%', rotation: '-4deg', orbitX: '32%', orbitY: '-32%' },
  { x: '28%', y: '-12%', rotation: '4deg', orbitX: '-32%', orbitY: '32%' },
  { x: '85%', y: '8%', rotation: '12deg', orbitX: '32%', orbitY: '32%' },
];

export function PortfolioEntrance({ onComplete, reduced }: { onComplete: () => void; reduced: boolean }) {
  const [running, setRunning] = useState(false);
  const loaded = useRef(new Set<number>());
  const started = useRef(false);
  const finished = useRef(false);
  const skip = useRef<HTMLButtonElement>(null);
  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    const restoreFocus = document.activeElement === skip.current;
    onComplete();
    if (restoreFocus) requestAnimationFrame(() => document.querySelector<HTMLAnchorElement>('.wordmark')?.focus({ preventScroll: true }));
  }, [onComplete]);

  useEffect(() => {
    if (reduced) { finish(); return; }
    const content = [...document.querySelectorAll<HTMLElement>('body > header, body > main, body > footer, body > .skip-link')];
    const original = content.map(element => element.inert);
    content.forEach(element => { element.inert = true; });
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    skip.current?.focus({ preventScroll: true });
    const readyDeadline = setTimeout(() => { if (!started.current) finish(); }, 1000);
    const hidden = () => { if (document.hidden) finish(); };
    document.addEventListener('visibilitychange', hidden);
    return () => {
      clearTimeout(readyDeadline);
      document.removeEventListener('visibilitychange', hidden);
      document.body.style.overflow = overflow;
      content.forEach((element, index) => { element.inert = original[index]; });
    };
  }, [finish, reduced]);

  useEffect(() => {
    if (!running) return;
    const deadline = setTimeout(finish, duration + 150);
    return () => clearTimeout(deadline);
  }, [running, finish]);

  function ready(index: number) {
    loaded.current.add(index);
    if (loaded.current.size === artworks.length && !finished.current) {
      started.current = true;
      setRunning(true);
    }
  }

  return <div className="portfolio-entrance" data-running={running} data-lenis-prevent role="dialog" aria-modal="true" aria-label="Portfolio opening animation" onKeyDown={event => { if (event.key === 'Tab') { event.preventDefault(); skip.current?.focus(); } }} onAnimationEnd={event => { if (event.animationName === 'entrance-open-top') finish(); }}>
    <div className="entrance-curtain entrance-curtain-top" aria-hidden="true" />
    <div className="entrance-curtain entrance-curtain-bottom" aria-hidden="true" />
    <div className="entrance-art-stage" aria-hidden="true">
      <div className="entrance-gather entrance-orbit">{artworks.map((art, index) => <div className="entrance-miniature" key={art.key} style={{ '--fan-x': fan[index].x, '--fan-y': fan[index].y, '--fan-rotation': fan[index].rotation, '--orbit-x': fan[index].orbitX, '--orbit-y': fan[index].orbitY } as CSSProperties}>
        <img src={art.src} srcSet={art.srcSet} sizes={artworkSizes} width={art.width} height={art.height} alt="" loading="eager" decoding="async" fetchPriority="low" onLoad={() => ready(index)} onError={finish} />
      </div>)}</div>
      <span className="entrance-monogram">SA</span>
    </div>
    <div className="entrance-identity"><span>Shahmeer Ali</span><span>Research &amp; applied AI</span></div>
    <button ref={skip} className="entrance-skip" onClick={finish}>Skip intro <ArrowUpRight size={16} /></button>
  </div>;
}
