'use client';
import { useCallback, useEffect, useState, type RefObject } from 'react';
import { usePathname } from 'next/navigation';
import { companionPosition, guideTargets, tourStops } from '@/lib/companion-guide';
import { scrollToPortfolioTarget } from '@/lib/portfolio-scroll';
import { shouldPlayEntrance } from '@/lib/portfolio-entrance';

type Phase = 'boot' | 'intro' | 'idle' | 'tour' | 'visit';
export function useCompanionGuide(ref: RefObject<HTMLElement | null>, reduced: boolean | null, paused: boolean) {
  const [phase, setPhase] = useState<Phase>('boot');
  const [step, setStep] = useState(0);
  const [visit, setVisit] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0, scale: 1 });
  const pathname = usePathname();
  const active = phase === 'tour' || phase === 'visit';
  const targetId = phase === 'tour' ? tourStops[step] : visit;
  const stop = useCallback(() => { setPhase('idle'); setVisit(null); setPosition({ x: 0, y: 0, scale: 1 }); ref.current?.querySelector<HTMLButtonElement>('.bot-launcher')?.focus({ preventScroll: true }); }, [ref]);
  const finishIntro = useCallback(() => { setPhase('idle'); setPosition({ x: 0, y: 0, scale: 1 }); }, []);
  const start = useCallback(() => { setStep(0); setVisit(null); setPhase('tour'); }, []);
  const navigate = useCallback((target: string) => {
    if (guideTargets[target]) { setVisit(target); setPhase('visit'); }
  }, []);

  useEffect(() => {
    if (reduced === null) return;
    const enter = () => {
      setVisit(null);
      setPosition({ x: 0, y: 0, scale: 1 });
      setPhase(shouldPlayEntrance({ pathname, reduced, hash: window.location.hash }) ? 'intro' : 'idle');
    };
    enter();
    // A restored browser-history page keeps React state instead of mounting again.
    const restore = (event: PageTransitionEvent) => { if (event.persisted) enter(); };
    window.addEventListener('pageshow', restore);
    return () => window.removeEventListener('pageshow', restore);
  }, [pathname, reduced]);

  useEffect(() => {
    if (pathname !== '/') stop();
  }, [pathname, stop]);

  useEffect(() => {
    if (!active || !targetId) return;
    const target = document.getElementById(targetId);
    if (!target) { stop(); return; }
    const offsetForViewport = () => window.innerWidth <= 760 ? targetId === 'photos' ? 88 : 126 : targetId === 'photos' ? 94 : 160;
    const offset = offsetForViewport();
    const top = target.getBoundingClientRect().top + window.scrollY;
    const predictedScroll = Math.max(0, Math.min(document.documentElement.scrollHeight - window.innerHeight, top - offset));
    target.setAttribute('data-companion-target', 'true');
    const place = (predicted = false) => {
      const bot = ref.current;
      if (!bot) return;
      const style = getComputedStyle(bot);
      const base = { left: document.documentElement.clientWidth - Number.parseFloat(style.right) - bot.offsetWidth, top: window.innerHeight - Number.parseFloat(style.bottom) - bot.offsetHeight, width: bot.offsetWidth, height: bot.offsetHeight };
      const bounds = target.getBoundingClientRect();
      setPosition({ ...companionPosition({ width: document.documentElement.clientWidth, height: window.innerHeight }, base, { right: bounds.right, height: bounds.height, top: predicted ? top - predictedScroll : bounds.top }), scale: 1 });
    };
    place(true);
    scrollToPortfolioTarget(target, offset, Boolean(reduced || paused));
    const settle = setTimeout(() => place(), reduced || paused ? 0 : 1100);
    const resize = () => { scrollToPortfolioTarget(target, offsetForViewport(), true); place(); };
    const cancel = (event: Event) => {
      if ((event.target as Element | null)?.closest('[data-companion-controls], .bot-panel')) return;
      stop();
    };
    window.addEventListener('resize', resize);
    window.addEventListener('wheel', cancel, { passive: true });
    window.addEventListener('touchstart', cancel, { passive: true });
    return () => { target.removeAttribute('data-companion-target'); clearTimeout(settle); window.removeEventListener('resize', resize); window.removeEventListener('wheel', cancel); window.removeEventListener('touchstart', cancel); };
  }, [active, targetId, ref, reduced, paused, stop]);

  useEffect(() => {
    if (phase !== 'intro') return;
    if (!window.location.hash || window.location.hash === '#intro-heading') scrollToPortfolioTarget(document.documentElement, 0, true);
  }, [phase]);

  useEffect(() => {
    if (phase === 'idle' || phase === 'boot') return;
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { if (phase === 'intro') finishIntro(); else stop(); }
      if (active && ['PageDown', 'PageUp', 'Home', 'End'].includes(event.key)) stop();
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [phase, active, finishIntro, stop]);

  return { phase, active, step, position, stop, start, navigate, finishIntro,
    target: targetId ? guideTargets[targetId] : null,
    next: () => step < tourStops.length - 1 ? setStep(s => s + 1) : stop(),
    back: () => setStep(s => Math.max(0, s - 1)),
  };
}
