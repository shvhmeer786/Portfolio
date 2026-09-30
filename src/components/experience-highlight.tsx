'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

type Frame = { y: number; height: number; visible: boolean };

export function ExperienceHighlight({ children }: { children: ReactNode }) {
  const list = useRef<HTMLDivElement>(null);
  const selected = useRef<HTMLElement | null>(null);
  const pointerRow = useRef<HTMLElement | null>(null);
  const measured = useRef(false);
  const [frame, setFrame] = useState<Frame>({ y: 0, height: 0, visible: false });
  const reduced = useReducedMotion();

  function show(row: HTMLElement | null) {
    selected.current = row;
    if (!row || !list.current) { setFrame(old => ({ ...old, visible: false })); return; }
    const bounds = row.getBoundingClientRect();
    const y = bounds.top - list.current.getBoundingClientRect().top;
    setFrame(old => old.visible && old.y === y && old.height === bounds.height ? old : { y, height: bounds.height, visible: true });
  }

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const row = selected.current;
      if (!row || !list.current) return;
      const bounds = row.getBoundingClientRect();
      setFrame({ y: bounds.top - list.current.getBoundingClientRect().top, height: bounds.height, visible: true });
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
      pointerRow.current = (event.target as HTMLElement).closest<HTMLElement>('.experience-row');
      show(pointerRow.current);
    }}
    onPointerLeave={() => { pointerRow.current = null; show(focusedRow()); }}
    onFocusCapture={event => show(event.target.closest<HTMLElement>('.experience-row'))}
    onBlurCapture={event => {
      const next = event.relatedTarget as HTMLElement | null;
      show(next && list.current?.contains(next) ? next.closest<HTMLElement>('.experience-row') : pointerRow.current);
    }}>
    <motion.div className="experience-hover-outline" aria-hidden="true" initial={false}
      animate={{ y: frame.y, height: frame.height, opacity: frame.visible ? 1 : 0 }}
      transition={{ y: reduced || !measured.current ? { duration: 0 } : { type: 'spring', stiffness: 750, damping: 48, mass: 0.65 }, height: reduced || !measured.current ? { duration: 0 } : { type: 'spring', stiffness: 750, damping: 48, mass: 0.65 }, opacity: { duration: reduced ? 0 : 0.12 } }} />
    {children}
  </div>;
}
