'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import artworks from '@/content/entrance-art.json';
import { constrainPostcard } from '@/lib/footer-postcards';

const rotations = [-8, 6, -5, 8];
type Point = { x: number; y: number };
type Placement = Point & { moved: boolean };
type Drag = { index: number; pointer: number; origin: Point; start: Point; next: Point; moved: boolean; last: Point; time: number; tilt: number };

export function FooterPostcards({ children }: { children: ReactNode }) {
  const frame = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const placements = useRef<Placement[]>([]);
  const drag = useRef<Drag | null>(null);
  const animationFrame = useRef<number | null>(null);
  const topLayer = useRef(0);
  const [images, setImages] = useState(() => artworks.map((_, index) => index));
  const instructions = useId();

  function initial(index: number): Point {
    const board = frame.current!;
    const slot = board.querySelector<HTMLElement>('.footer-art-space')!;
    function layoutTop(element: HTMLElement) {
      let top = 0;
      let current: HTMLElement | null = element;
      while (current && current !== board) {
        top += current.offsetTop;
        current = current.offsetParent as HTMLElement | null;
      }
      return top;
    }
    const top = layoutTop(slot);
    const name = board.querySelector<HTMLElement>('.footer-wordmark')!;
    const bottom = layoutTop(name) + name.offsetHeight;
    const compact = board.clientWidth < 600;
    const fractions = compact ? [.2, .8, .26, .74] : [.14, .85, .32, .73];
    return { x: board.clientWidth * fractions[index], y: index < 2 ? top + (compact ? 42 : 54) : bottom + (compact ? 44 : 56) };
  }

  function place(index: number, point: Point, moved: boolean) {
    const board = frame.current;
    const card = cards.current[index];
    if (!board || !card || !board.clientWidth || !board.clientHeight) return;
    // Reserve the full lifted/tilted footprint, including every intermediate animation frame.
    const next = constrainPostcard(point, { width: board.clientWidth, height: board.clientHeight }, { width: card.offsetWidth * 1.045, height: card.offsetHeight * 1.045 }, Math.abs(rotations[index]) + 6);
    placements.current[index] = { x: next.x / board.clientWidth, y: next.y / board.clientHeight, moved };
    card.style.transform = `translate3d(${next.x - card.offsetWidth / 2}px, ${next.y - card.offsetHeight / 2}px, 0)`;
  }

  useLayoutEffect(() => {
    const board = frame.current;
    if (!board) return;
    const fit = () => {
      cards.current.forEach((_, index) => {
        const saved = placements.current[index];
        place(index, saved?.moved ? { x: saved.x * board.clientWidth, y: saved.y * board.clientHeight } : initial(index), Boolean(saved?.moved));
      });
      board.dataset.ready = 'true';
    };
    const observer = new ResizeObserver(fit);
    observer.observe(board);
    const information = board.querySelector('.footer-information');
    if (information) observer.observe(information);
    const name = board.querySelector('.footer-wordmark');
    if (name) observer.observe(name);
    fit();
    return () => {
      observer.disconnect();
      if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  useEffect(() => {
    const board = frame.current;
    if (!board) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timers: number[] = [];
    let visible = false;
    function stop() { timers.splice(0).forEach(timer => window.clearTimeout(timer)); }
    function schedule(index: number, delay: number) {
      timers[index] = window.setTimeout(() => {
        // Keep the artwork steady in the user's hand; resume its cycle after release.
        if (drag.current?.index !== index) setImages(previous => previous.map((image, slot) => slot === index ? (image + 1) % artworks.length : image));
        schedule(index, 4800);
      }, delay);
    }
    function sync() {
      stop();
      if (visible && !document.hidden && !reduced.matches) artworks.forEach((_, index) => schedule(index, 4800 + index * 900));
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(board);
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', sync);
    return () => { stop(); observer.disconnect(); document.removeEventListener('visibilitychange', sync); reduced.removeEventListener('change', sync); };
  }, []);

  function begin(event: PointerEvent<HTMLButtonElement>, index: number) {
    if (!event.isPrimary || event.button !== 0 || drag.current) return;
    const board = frame.current!;
    const position = placements.current[index];
    if (!position) return;
    event.preventDefault();
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.style.zIndex = String(++topLayer.current);
    event.currentTarget.dataset.dragging = 'true';
    const origin = { x: position.x * board.clientWidth, y: position.y * board.clientHeight };
    const start = { x: event.pageX, y: event.pageY };
    drag.current = { index, pointer: event.pointerId, origin, start, next: origin, moved: position.moved, last: start, time: event.timeStamp, tilt: 0 };
  }

  function move(event: PointerEvent<HTMLButtonElement>) {
    const current = drag.current;
    if (!current || current.pointer !== event.pointerId) return;
    current.next = { x: current.origin.x + event.pageX - current.start.x, y: current.origin.y + event.pageY - current.start.y };
    const elapsed = Math.max(8, event.timeStamp - current.time);
    current.tilt = Math.max(-6, Math.min(6, (event.pageX - current.last.x) / elapsed * 3));
    current.last = { x: event.pageX, y: event.pageY };
    current.time = event.timeStamp;
    if (event.pageX !== current.start.x || event.pageY !== current.start.y) current.moved = true;
    if (animationFrame.current !== null) return;
    animationFrame.current = requestAnimationFrame(() => {
      animationFrame.current = null;
      if (drag.current) {
        place(drag.current.index, drag.current.next, drag.current.moved);
        cards.current[drag.current.index]?.style.setProperty('--postcard-tilt', `${drag.current.tilt}deg`);
      }
    });
  }

  function end(event: PointerEvent<HTMLButtonElement>) {
    const current = drag.current;
    if (!current || current.pointer !== event.pointerId) return;
    if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);
    animationFrame.current = null;
    place(current.index, current.next, current.moved);
    drag.current = null;
    event.currentTarget.dataset.dragging = 'false';
    event.currentTarget.style.setProperty('--postcard-tilt', '0deg');
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function keyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const offsets: Record<string, Point> = { ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }, ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 } };
    if (event.key !== 'Home' && !offsets[event.key]) return;
    event.preventDefault();
    const board = frame.current!;
    const saved = placements.current[index];
    if (!saved) return;
    const delta = offsets[event.key];
    const step = event.shiftKey ? 30 : 10;
    const point = event.key === 'Home' ? initial(index) : { x: saved.x * board.clientWidth + delta.x * step, y: saved.y * board.clientHeight + delta.y * step };
    event.currentTarget.style.zIndex = String(++topLayer.current);
    place(index, point, event.key !== 'Home');
  }

  return <div ref={frame} className="footer-playground">
    {children}
    <span id={instructions} className="sr-only">Drag to rearrange within the footer. You can also use the arrow keys; hold Shift for larger moves. Press Home to reset this image.</span>
    <div className="footer-postcards">
      {artworks.map((art, index) => <button key={art.key} ref={element => { cards.current[index] = element; }} className="footer-postcard" style={{ '--postcard-rotation': `${rotations[index]}deg` } as CSSProperties} aria-label={`Move ${artworks[images[index]].title} postcard`} aria-describedby={instructions} data-lenis-prevent onPointerDown={event => begin(event, index)} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end} onKeyDown={event => keyboard(event, index)}>
        <span className="footer-postcard-art" aria-hidden="true">
          {artworks.map((image, imageIndex) => <img key={image.key} src={image.src} width={image.width} height={image.height} alt="" data-active={images[index] === imageIndex} loading="lazy" decoding="async" fetchPriority="low" draggable={false} />)}
        </span>
      </button>)}
    </div>
  </div>;
}
