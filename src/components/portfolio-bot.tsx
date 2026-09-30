'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion, useMotionValue, useSpring } from 'motion/react';
import { X, ArrowUpRight, PaperPlaneTilt, HandWaving, Pause, Play } from '@phosphor-icons/react';
import { botMoments } from '@/content/portfolio';
import { getCompanionAction } from '@/lib/companion-guide';
import { useCompanionGuide } from './use-companion-guide';
import { CompanionGuideUI, TourInvitation } from './companion-guide-ui';
import { nextMomentDelay, type PortfolioAnswer } from '@/lib/portfolio-assistant';

type Message = { id: number; role: 'user' | 'assistant'; text: string; sources?: PortfolioAnswer['sources'] };
type Moment = typeof botMoments[number];
const initialMessage: Message = { id: 0, role: 'assistant', text: 'Hi! I’m Shahmeer’s portfolio companion. I can help with his research, experience, or contact information. You can also ask me to show you a section, or take a little tour. What are you curious about?' };
const suggestions = ['Take the tour', 'Microsoft', 'Orena', 'Contact'];

export function PortfolioBot() {
  const [open, setOpen] = useState(false);
  const [moment, setMoment] = useState<Moment | null>(null);
  const [paused, setPaused] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [question, setQuestion] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const companion = useRef<HTMLElement>(null);
  const guide = useCompanionGuide(companion, reduced, paused);
  const launcher = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const conversation = useRef<HTMLDivElement>(null);
  const request = useRef<AbortController | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastQuestion = useRef('');
  const sequence = useRef(0);
  const serial = useRef(1);
  const eyeX = useMotionValue(0);
  const eyeY = useMotionValue(0);
  const springX = useSpring(eyeX, { stiffness: 180, damping: 22 });
  const springY = useSpring(eyeY, { stiffness: 180, damping: 22 });
  useEffect(() => { setOpen(false); setMoment(null); if (openTimer.current) clearTimeout(openTimer.current); }, [pathname]);
  useEffect(() => () => { request.current?.abort(); if (openTimer.current) clearTimeout(openTimer.current); }, []);

  useEffect(() => {
    if (reduced || paused || open || guide.phase !== 'idle') { setMoment(null); return; }
    let timer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;
    let stopped = false;
    function schedule() {
      timer = setTimeout(() => {
        if (stopped) return;
        if (!document.hidden) {
          const next = botMoments[sequence.current % botMoments.length];
          sequence.current += 1;
          setMoment(next);
          clearTimeout(hideTimer);
          hideTimer = setTimeout(() => setMoment(null), 4600);
        }
        schedule();
      }, nextMomentDelay());
    }
    const onVisibility = () => { if (document.hidden) setMoment(null); };
    document.addEventListener('visibilitychange', onVisibility);
    schedule();
    return () => { stopped = true; clearTimeout(timer); clearTimeout(hideTimer); document.removeEventListener('visibilitychange', onVisibility); };
  }, [reduced, paused, open, guide.phase]);

  useEffect(() => {
    if (reduced || paused || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    function look(event: PointerEvent) {
      const bounds = launcher.current?.getBoundingClientRect();
      if (!bounds) return;
      eyeX.set(Math.max(-3, Math.min(3, (event.clientX - bounds.left - bounds.width / 2) / 90)));
      eyeY.set(Math.max(-2, Math.min(2, (event.clientY - bounds.top - bounds.height / 2) / 110)));
    }
    const reset = () => { eyeX.set(0); eyeY.set(0); };
    document.addEventListener('pointermove', look, { passive: true });
    document.addEventListener('pointerleave', reset);
    return () => { document.removeEventListener('pointermove', look); document.removeEventListener('pointerleave', reset); reset(); };
  }, [reduced, paused, eyeX, eyeY]);

  const close = useCallback(() => { if (openTimer.current) clearTimeout(openTimer.current); setOpen(false); launcher.current?.focus({ preventScroll: true }); }, []);
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => input.current?.focus());
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); close(); } };
    document.addEventListener('keydown', key);
    return () => { cancelAnimationFrame(frame); document.removeEventListener('keydown', key); };
  }, [open, close]);
  useEffect(() => {
    if (open && conversation.current) conversation.current.scrollTo({ top: conversation.current.scrollHeight, behavior: reduced ? 'instant' : 'smooth' });
  }, [messages, pending, error, open, reduced]);

  async function ask(text: string, retry = false) {
    const trimmed = text.trim();
    if (!trimmed || pending || trimmed.length > 600) return;
    const action = getCompanionAction(trimmed);
    if (action && pathname === '/') {
      setMessages(m => [...m, { id: serial.current++, role: 'user', text: trimmed }, { id: serial.current++, role: 'assistant', text: action.kind === 'tour' ? 'Let’s take a little look around.' : 'Right this way. You can ask me more once we’re there.' }]);
      setQuestion(''); setError(null); setOpen(false); setMoment(null);
      if (action.kind === 'tour') guide.start(); else guide.navigate(action.target);
      return;
    }
    lastQuestion.current = trimmed;
    setError(null); setPending(true); setQuestion('');
    if (!retry) setMessages(m => [...m, { id: serial.current++, role: 'user', text: trimmed }]);
    request.current?.abort();
    const controller = new AbortController(); request.current = controller;
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: trimmed }), signal: controller.signal });
      if (!response.ok) throw new Error('Could not load an answer');
      const answer: PortfolioAnswer = await response.json();
      setMessages(m => [...m, { id: serial.current++, role: 'assistant', text: answer.text, sources: answer.sources }]);
    } catch (cause) {
      if (!(cause instanceof Error && cause.name === 'AbortError')) setError('I couldn’t load an answer. Try that question again.');
    } finally { if (!controller.signal.aborted) setPending(false); }
  }

  const startTour = () => { setOpen(false); setMoment(null); guide.start(); };
  const openConversation = () => {
    const travelling = guide.active || guide.phase === 'intro' || guide.phase === 'settle';
    guide.stop(); setMoment(null);
    if (openTimer.current) clearTimeout(openTimer.current);
    if (travelling && !reduced && !paused) openTimer.current = setTimeout(() => setOpen(true), 800);
    else setOpen(true);
  };
  return <>
    <CompanionGuideUI guide={guide} reduced={Boolean(reduced || paused)} ask={text => { openConversation(); ask(text); }} />
    <motion.aside ref={companion} className={`portfolio-bot ${paused ? 'motion-paused' : ''}`} data-guide={guide.phase} style={{ visibility: guide.phase === 'boot' || (guide.phase === 'intro' && guide.position.scale === 1) ? 'hidden' : undefined }} initial={false} animate={{ transform: `translate(${guide.position.x}px, ${guide.position.y}px) scale(${guide.position.scale})` }} transition={{ duration: reduced || paused || guide.phase === 'intro' ? 0 : .8, ease: [.22, 1, .36, 1] }} aria-label="Portfolio companion" data-mood={pending ? 'thinking' : moment?.mood ?? 'idle'}>
    {guide.phase === 'offer' && !open && <TourInvitation start={startTour} dismiss={guide.stop} navigate={guide.navigate} />}
    <AnimatePresence>
      {moment && !open && !paused && <motion.button className="bot-thought" aria-label="Ask the portfolio companion a question" onClick={openConversation} initial={{ opacity: 0, y: 6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 3 }} transition={{ duration: 0.2 }}><span>{moment.mood === 'thinking' ? <span className="thinking-dots" aria-hidden><i /><i /><i /></span> : moment.mood === 'wave' ? <HandWaving size={17} /> : null}{moment.text}</span><span className="thought-tail" aria-hidden /></motion.button>}
    </AnimatePresence>
    <AnimatePresence>
      {open && <motion.section className="bot-panel" id="portfolio-chat" role="dialog" aria-modal="false" aria-labelledby="bot-title" data-lenis-prevent initial={reduced ? false : { opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 5, scale: 0.99 }} transition={{ duration: reduced ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}>
        <div className="bot-panel-header"><span className="mini-face" aria-hidden><i /><i /></span><div><h2 id="bot-title">Ask about Shahmeer</h2><span>Portfolio companion</span></div><button className="icon-button close-chat" aria-label="Close conversation" onClick={close}><X size={19} /></button></div>
        <div className="chat-messages" ref={conversation} data-lenis-prevent aria-live="polite" aria-relevant="additions text">{messages.map(message => <div className={`chat-message ${message.role}`} key={message.id}>{message.role === 'assistant' && <span className="message-author">Companion</span>}<p>{message.text}</p>{message.sources && message.sources.length > 0 && <div className="answer-sources">{message.sources.map(source => source.href.startsWith('mailto:') ? <a key={source.href} href={source.href}>{source.label}<ArrowUpRight size={14} /></a> : <Link key={source.href} href={source.href} onClick={() => setOpen(false)}>{source.label}<ArrowUpRight size={14} /></Link>)}</div>}</div>)}{pending && <div className="chat-pending" role="status"><span className="thinking-dots" aria-hidden><i /><i /><i /></span><span>Finding the right page…</span></div>}{error && <div className="chat-error" role="alert"><p>{error}</p><button onClick={() => ask(lastQuestion.current, true)}>Try again</button></div>}</div>
        <div className="chat-bottom"><div className="chat-suggestions" aria-label="Suggested questions">{suggestions.map(suggestion => <button key={suggestion} disabled={pending} onClick={() => ask(suggestion)}>{suggestion}</button>)}</div><form className="chat-form" onSubmit={event => { event.preventDefault(); ask(question); }}><label htmlFor="chat-question" className="sr-only">Ask about Shahmeer</label><input id="chat-question" ref={input} autoComplete="off" maxLength={600} value={question} onChange={event => setQuestion(event.target.value)} placeholder="What are you curious about?" disabled={pending} /><button type="submit" aria-label="Send question" disabled={pending || !question.trim()}><PaperPlaneTilt size={19} /></button></form><div className="chat-disclosure"><span>Answers from this portfolio</span><button className="motion-toggle" onClick={() => setPaused(!paused)} aria-label={paused ? 'Resume companion animations' : 'Pause companion animations'}>{paused ? <Play size={12} /> : <Pause size={12} />}{paused ? 'Resume motion' : 'Pause motion'}</button></div></div>
      </motion.section>}
    </AnimatePresence>
    <div className="bot-drift"><button ref={launcher} className="bot-launcher" onClick={() => { if (open) close(); else openConversation(); }} aria-label={open ? 'Close portfolio companion' : 'Ask about Shahmeer'} aria-expanded={open} aria-controls="portfolio-chat"><span className="bot-face" aria-hidden><span className="bot-eyes"><motion.span className="eye-socket" style={{ x: springX, y: springY }}><span className="eye-pupil" /></motion.span><motion.span className="eye-socket" style={{ x: springX, y: springY }}><span className="eye-pupil" /></motion.span></span></span></button></div><span className="bot-label">{open ? 'A little conversation.' : guide.active ? 'Right this way.' : guide.phase === 'intro' ? 'Hello there.' : 'Ask about me'}</span>
  </motion.aside></>;
}
