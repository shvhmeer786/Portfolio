'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';

type Frame = { y: number; height: number; visible: boolean; instant: boolean };

export function ExperienceHighlight({ children }: { children: ReactNode }) {
  const list = useRef<HTMLDivElement>(null);
  const selected = useRef<HTMLElement | null>(null);
  const pointerRow = useRef<HTMLElement | null>(null);
  const measured = useRef(false);
  const [frame, setFrame] = useState<Frame>({ y: 0, height: 0, visible: false, instant: false });
  const reduced = useReducedMotion();
  const left = useRef(0);
  const light = useMotionValue(0);
  const smoothLight = useSpring(light, { stiffness: 220, damping: 30 });
  const lightTransform = useTransform(smoothLight, x => `translate3d(${x}px, 0, 0)`);

  function show(row: HTMLElement | null, instant = false) {
    selected.current = row;
    if (!row || !list.current) { setFrame(old => ({ ...old, visible: false })); return; }
    const bounds = row.getBoundingClientRect();
    const listBounds = list.current.getBoundingClientRect();
    left.current = listBounds.left;
    const y = bounds.top - listBounds.top;
    setFrame(old => old.visible && old.y === y && old.height === bounds.height && old.instant === instant ? old : { y, height: bounds.height, visible: true, instant });
  }

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const row = selected.current;
      if (!row || !list.current) return;
      const bounds = row.getBoundingClientRect();
      const listBounds = list.current.getBoundingClientRect();
      left.current = listBounds.left;
      setFrame(old => ({ ...old, y: bounds.top - listBounds.top, height: bounds.height, visible: true }));
    });
    if (list.current) observer.observe(list.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { if (frame.visible) measured.current = true; }, [frame.visible]);

  function focusedRow() {
    return list.current?.contains(document.activeElement) ? document.activeElement?.closest<HTMLElement>('.experience-row') ?? null : null;
  }

  return <div ref={list} className="experience-list"
    onPointerMove={event => {
      if (event.pointerType === 'touch') return;
      const row = (event.target as Element).closest<HTMLElement>('.experience-row');
      if (row !== pointerRow.current || row !== selected.current || frame.instant) { pointerRow.current = row; show(row); }
      if (row && !reduced) light.set(event.clientX - left.current + 12);
    }}
    onPointerLeave={() => { pointerRow.current = null; show(focusedRow(), true); }}
    onFocusCapture={event => show(event.target.closest<HTMLElement>('.experience-row'), true)}
    onBlurCapture={event => {
      const next = event.relatedTarget as HTMLElement | null;
      const nextRow = next && list.current?.contains(next) ? next.closest<HTMLElement>('.experience-row') : null;
      show(nextRow ?? pointerRow.current, Boolean(nextRow));
    }}>
    <motion.div className="experience-hover-glass" data-visible={frame.visible} data-focus={frame.instant} data-row={selected.current?.id} aria-hidden="true" initial={false}
      animate={{ transform: `translate3d(0, ${frame.y}px, 0)`, height: frame.height, opacity: frame.visible ? 1 : 0 }}
      transition={{ transform: reduced || frame.instant || !measured.current ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34, mass: .8 }, height: reduced || frame.instant || !measured.current ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34, mass: .8 }, opacity: { duration: reduced ? 0 : .16 } }}>
      <motion.div className="experience-glass-light" style={{ transform: lightTransform }} />
    </motion.div>
    {children}
  </div>;
}
