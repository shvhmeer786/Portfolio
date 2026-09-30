'use client';
import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ArrowLeft, X, HandWaving } from '@phosphor-icons/react';
import { tourStops } from '@/lib/companion-guide';
import type { useCompanionGuide } from './use-companion-guide';

type Guide = ReturnType<typeof useCompanionGuide>;
export function CompanionGuideUI({ guide, reduced, ask }: { guide: Guide; reduced: boolean; ask: (question: string) => void }) {
  const next = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (guide.active) next.current?.focus({ preventScroll: true });
  }, [guide.active]);
  return <>
    <AnimatePresence>
      {guide.phase === 'intro' && <motion.div className="companion-arrival" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .5 }}>
        <div className="arrival-copy" role="status"><p>Hi. Let’s look around.</p><span>Shahmeer’s portfolio companion</span><button onClick={guide.finishIntro}>Skip intro <ArrowRight size={13} /></button></div>
      </motion.div>}
    </AnimatePresence>
    <AnimatePresence>
      {guide.active && guide.target && <motion.section className="companion-tour-card" data-companion-controls data-lenis-prevent role="dialog" aria-modal="false" aria-labelledby="tour-title" initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: reduced ? 0 : .25 }}>
        <div className="tour-card-top"><span>{guide.phase === 'tour' ? `A little look around · ${String(guide.step + 1).padStart(2, '0')} / ${String(tourStops.length).padStart(2, '0')}` : 'Right this way'}</span><button aria-label="End guided tour" onClick={guide.stop}><X size={17} /></button></div>
        <div className="tour-card-copy" aria-live="polite" aria-atomic="true"><h2 id="tour-title">{guide.target.title}</h2><p>{guide.target.description}</p></div>
        <div className="tour-card-actions"><button className="tour-ask" onClick={() => ask(guide.target!.question)}>Ask about this</button><div>{guide.phase === 'tour' && guide.step > 0 && <button className="tour-back" aria-label="Previous tour stop" onClick={guide.back}><ArrowLeft size={16} /></button>}<button ref={next} className="tour-primary" onClick={guide.phase === 'tour' ? guide.next : guide.stop}>{guide.phase === 'visit' ? 'Back to browsing' : guide.step === tourStops.length - 1 ? 'Finish tour' : 'Next'}<ArrowRight size={16} /></button></div></div>
        {guide.phase === 'tour' && <div className="tour-progress" aria-hidden="true">{tourStops.map((stop, i) => <span key={stop} className={i <= guide.step ? 'visited' : ''} />)}</div>}
      </motion.section>}
    </AnimatePresence>
  </>;
}
export function TourInvitation({ start, dismiss, navigate }: { start: () => void; dismiss: () => void; navigate: (target: string) => void }) {
  return <section className="companion-invitation" aria-label="Optional guided tour" data-companion-controls>
    <button className="invitation-close" aria-label="Dismiss tour invitation" onClick={dismiss}><X size={16} /></button><span className="invitation-eyebrow"><HandWaving size={16} /> A little curious?</span><h2>Want a quick look around?</h2><p>I can introduce the work—and the person behind it.</p><button className="tour-primary" onClick={start}>Show me around <ArrowRight size={16} /></button><button className="invitation-later" onClick={dismiss}>I’ll explore</button><div className="invitation-shortcuts"><button onClick={() => navigate('photos')}>Photos</button><span>·</span><button onClick={() => navigate('experience')}>Experience</button><span>·</span><button onClick={() => navigate('contact')}>Contact</button></div>
  </section>;
}
