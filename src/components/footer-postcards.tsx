'use client';

import { useId, useLayoutEffect, useRef, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import artworks from '@/content/entrance-art.json';
import { constrainPostcard } from '@/lib/footer-postcards';

const rotations = [-8, 6, -5, 8];
type Point = { x: number; y: number };
type Placement = Point & { moved: boolean };
type Drag = { index: number; pointer: number; origin: Point; start: Point; next: Point; moved: boolean };

export function FooterPostcards({ children }: { children: ReactNode }) {
  const frame = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const placements = useRef<Placement[]>([]);
  const drag = useRef<Drag | null>(null);
  const animationFrame = useRef<number | null>(null);
  const topLayer = useRef(0);
  const instructions = useId();

  function initial(index: number): Point {
    const board = frame.current!;
    const slot = board.querySelector<HTMLElement>('.footer-art-space')!;
    const top = slot.getBoundingClientRect().top - board.getBoundingClientRect().top;
    if (board.clientWidth < 600) return { x: board.clientWidth * (index % 2 ? .74 : .26), y: top + (index < 2 ? 45 : 128) };
    return { x: board.clientWidth * [.12, .37, .63, .88][index], y: top + [52, 74, 54, 72][index] };
  }

  function place(index: number, point: Point, moved: boolean) {
    const board = frame.current;
    const card = cards.current[index];
    if (!board || !card || !board.clientWidth || !board.clientHeight) return;
    const next = constrainPostcard(point, { width: board.clientWidth, height: board.clientHeight }, { width: card.offsetWidth, height: card.offsetHeight }, rotations[index]);
    placements.current[index] = { x: next.x / board.clientWidth, y: next.y / board.clientHeight, moved };
    card.style.transform = `translate3d(${next.x - card.offsetWidth / 2}px, ${next.y - card.offsetHeight / 2}px, 0) rotate(${rotations[index]}deg)`;
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
    fit();
    return () => {
      observer.disconnect();
      if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);
    };
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
    drag.current = { index, pointer: event.pointerId, origin, start: { x: event.pageX, y: event.pageY }, next: origin, moved: position.moved };
  }

  function move(event: PointerEvent<HTMLButtonElement>) {
    const current = drag.current;
    if (!current || current.pointer !== event.pointerId) return;
    current.next = { x: current.origin.x + event.pageX - current.start.x, y: current.origin.y + event.pageY - current.start.y };
    if (event.pageX !== current.start.x || event.pageY !== current.start.y) current.moved = true;
    if (animationFrame.current !== null) return;
    animationFrame.current = requestAnimationFrame(() => {
      animationFrame.current = null;
      if (drag.current) place(drag.current.index, drag.current.next, drag.current.moved);
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
      {artworks.map((art, index) => <button key={art.key} ref={element => { cards.current[index] = element; }} className="footer-postcard" style={{ '--postcard-rotation': `${rotations[index]}deg` } as CSSProperties} aria-label={`Move ${art.title} postcard`} aria-describedby={instructions} data-lenis-prevent onPointerDown={event => begin(event, index)} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end} onKeyDown={event => keyboard(event, index)}>
        <img src={art.src} width={art.width} height={art.height} alt="" loading="lazy" decoding="async" fetchPriority="low" draggable={false} />
      </button>)}
    </div>
  </div>;
}
