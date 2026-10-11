'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { AnimatePresence, motion, useIsPresent, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { CaretDown, CaretUp, Clock, MusicNote } from '@phosphor-icons/react';
import { footerWidgets, favouriteSong, type FooterWidgetKind } from '@/content/footer-widgets';
import { nextWidgetIndex, widgetSwipe } from '@/lib/widget-stack';
import { FooterClock } from './footer-clock';
import { FooterRecord } from './footer-record';
import { GitHubActivity } from './github-activity';

const labels = { github: 'GitHub activity', clock: 'Toronto clock', song: 'Favourite song' };
type Transition = { direction: number; instant: boolean };
const variants = {
  enter: ({ direction, instant }: Transition) => ({ opacity: instant ? 1 : 0, transform: `translate3d(0, ${instant ? 0 : direction * 48}px, 0) scale(${instant ? 1 : .97})`, transition: { duration: instant ? 0 : .24 } }),
  center: ({ instant }: Transition) => ({ opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)', transition: { duration: instant ? 0 : .24, ease: [.22, 1, .36, 1] as const } }),
  exit: ({ direction, instant }: Transition) => ({ opacity: 0, transform: `translate3d(0, ${instant ? 0 : -direction * 48}px, 0) scale(.97)`, transition: { duration: instant ? 0 : .18 } }),
};

function WidgetPanel({ kind, near, transition, children }: { kind: FooterWidgetKind; near: boolean; transition: Transition; children?: ReactNode }) {
  const present = useIsPresent();
  return <motion.div className={`widget-panel widget-${kind}`} custom={transition} variants={variants} initial="enter" animate="center" exit="exit" inert={!present} aria-hidden={!present || undefined}>
    {kind === 'github' ? <GitHubActivity active={present && near} /> : children}
  </motion.div>;
}

export function FooterWidgetStack() {
  const [selection, setSelection] = useState({ index: 0, direction: 1, instant: false });
  const [near, setNear] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const pointer = useRef<{ id: number; x: number; y: number; nextX: number; nextY: number } | null>(null);
  const reduced = useReducedMotion();
  const offset = useMotionValue(0);
  const smooth = useSpring(offset, { stiffness: 600, damping: 42 });
  const transform = useTransform(reduced ? offset : smooth, value => `translate3d(0, ${value}px, 0)`);
  const kind = footerWidgets[selection.index];
  const transition = { direction: selection.direction, instant: Boolean(reduced || selection.instant) };

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: '200px' });
    if (frame.current) observer.observe(frame.current);
    return () => observer.disconnect();
  }, []);

  function select(step: number, instant = false) {
    if (instant || reduced) smooth.jump(0);
    offset.set(0);
    setSelection(previous => ({ index: nextWidgetIndex(previous.index, step, footerWidgets.length), direction: Math.sign(step) || 1, instant }));
  }

  function begin(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0 || (event.target as HTMLElement).closest('button, a, iframe, input')) return;
    pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, nextX: event.clientX, nextY: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.dataset.dragging = 'true';
  }
  function move(event: PointerEvent<HTMLDivElement>) {
    const current = pointer.current;
    if (!current || current.id !== event.pointerId) return;
    current.nextX = event.clientX; current.nextY = event.clientY;
    offset.set(Math.max(-80, Math.min(80, (event.clientY - current.y) * .55)));
  }
  function end(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    const current = pointer.current;
    if (!current || current.id !== event.pointerId) return;
    pointer.current = null;
    event.currentTarget.dataset.dragging = 'false';
    const step = cancelled ? 0 : widgetSwipe(current.nextX - current.x, current.nextY - current.y);
    if (step) select(step); else offset.set(0);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }
  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    const step = event.key === 'ArrowUp' ? 1 : event.key === 'ArrowDown' ? -1 : 0;
    if (step) { event.preventDefault(); select(step, true); }
  }

  return <section className="footer-widget-stack" aria-label="Swipeable footer widgets">
    <div className="widget-stack-frame" ref={frame} role="region" aria-roledescription="carousel" aria-label="Footer widgets. Swipe up or down, or use the arrow keys." tabIndex={0} data-lenis-prevent onKeyDown={keyboard} onPointerDown={begin} onPointerMove={move} onPointerUp={event => end(event)} onPointerCancel={event => end(event, true)} onLostPointerCapture={event => end(event, true)}>
      <span className="widget-stack-back widget-stack-back-one" aria-hidden="true" /><span className="widget-stack-back widget-stack-back-two" aria-hidden="true" />
      <motion.div className="widget-stack-front" style={{ transform }}>
        <AnimatePresence initial={false} custom={transition}>
          <WidgetPanel key={kind} kind={kind} near={near} transition={transition}>
            {kind === 'clock' && <><div className="widget-heading"><span><Clock size={18} />Toronto time</span><span className="widget-live-dot" aria-label="Live clock" /></div><div className="widget-clock-content"><FooterClock /></div><p className="widget-clock-note">A little closer, wherever you are.</p></>}
            {kind === 'song' && <><div className="widget-heading"><span><MusicNote size={18} />On repeat</span></div><div className="widget-song-content"><div><h3>{favouriteSong.title}</h3><p>{favouriteSong.artist}</p></div><FooterRecord /></div><p className="widget-song-note">A favourite for the background.</p></>}
          </WidgetPanel>
        </AnimatePresence>
      </motion.div>
    </div>
    <div className="widget-stack-controls"><span className="widget-swipe-hint">Swipe up or down</span><div className="widget-stack-dots" aria-label="Choose a widget">{footerWidgets.map((widget, index) => <button key={widget} aria-label={`Show ${labels[widget]} widget`} aria-pressed={index === selection.index} onClick={event => select(index - selection.index, event.detail === 0)}><i /></button>)}</div><div className="widget-stack-arrows"><button aria-label="Previous widget" onClick={event => select(-1, event.detail === 0)}><CaretUp size={15} /></button><button aria-label="Next widget" onClick={event => select(1, event.detail === 0)}><CaretDown size={15} /></button></div></div>
    <span className="sr-only" aria-live="polite" aria-atomic="true">{labels[kind]}, widget {selection.index + 1} of {footerWidgets.length}</span>
  </section>;
}
