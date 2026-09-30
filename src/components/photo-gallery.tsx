'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Pause, Play } from '@phosphor-icons/react';
import { useReducedMotion } from 'motion/react';
import { photos } from '@/content/portfolio';

export function PhotoGallery() {
  const [index, setIndex] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<boolean[]>(() => photos.map(() => false));
  const [playing, setPlaying] = useState(true);
  const [held, setHeld] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const reduced = useReducedMotion();
  const touchStart = useRef<number | null>(null);
  const next = (index + 1) % photos.length;
  const prior = (index + photos.length - 1) % photos.length;
  const active = loaded[index] && loaded[next] && playing && !held && !focused && !hidden && !reduced;
  useEffect(() => {
    const update = () => setHidden(document.hidden);
    update(); document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => { setPrevious(index); setIndex(next); }, 3000);
    return () => clearTimeout(timer);
  }, [active, index, next]);
  const select = (target: number) => { if (target !== index && loaded[target]) { setPrevious(index); setIndex(target); } };
  const go = (step: number) => select((index + step + photos.length) % photos.length);
  const frameWidth = `${Math.min(100, photos[index].width / photos[index].height / 0.75 * 100)}%`;
  return <figure id="photos" className="photo-gallery" aria-roledescription="carousel" aria-label="Personal photo slideshow" onPointerEnter={e => { if (e.pointerType === 'mouse') setHeld(true); }} onPointerLeave={() => setHeld(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }}>
    <div className="photo-stage-space"><div className="photo-stage" style={{ width: frameWidth }} onPointerDown={e => { if (e.pointerType === 'touch') touchStart.current = e.clientX; }} onPointerCancel={() => { touchStart.current = null; }} onPointerUp={e => { if (touchStart.current !== null) { const delta = e.clientX - touchStart.current; if (Math.abs(delta) > 50) { go(delta < 0 ? 1 : -1); setPlaying(false); } touchStart.current = null; } }}>
      {photos.map((photo, i) => <Image key={photo.src} src={photo.src} alt={i === index ? photo.alt : ''} aria-hidden={i !== index} unoptimized onLoad={() => setLoaded(ready => ready.map((value, position) => position === i ? true : value))} fill sizes="(max-width: 760px) 100vw, 550px" preload={i === 0} loading={i === 0 ? undefined : 'eager'} draggable={false} className={`gallery-photo ${i === index ? 'is-current' : i === previous ? 'is-previous' : ''}`} />)}
    </div></div>
    <figcaption className="gallery-caption">
      <div className="photo-caption" style={{ width: frameWidth }}><span>{photos[index].caption}</span><span className="photo-count">{String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span></div>
      <div className="gallery-controls"><div className="photo-dots" aria-label="Choose a photo">{photos.map((photo, i) => <button className="dot-button" key={photo.src} aria-label={`Show photo ${i + 1}`} aria-current={index === i ? 'true' : undefined} disabled={!loaded[i]} onClick={() => select(i)}><span /></button>)}</div>
        <button className="icon-button" onClick={() => go(-1)} disabled={!loaded[prior]} aria-label="Previous photo"><ArrowLeft size={17} /></button>
        <button className="icon-button" onClick={() => go(1)} disabled={!loaded[next]} aria-label="Next photo"><ArrowRight size={17} /></button>
        <button className="icon-button pause-photo" onClick={() => { setPlaying(!playing); setFocused(false); setHeld(false); }} aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}>{playing ? <Pause size={17} /> : <Play size={17} />}</button>
      </div>
    </figcaption>
  </figure>;
}
