'use client';

import { useEffect, useRef, useState } from 'react';

const greetings = [
  { lang: 'en', text: 'hello', dir: 'ltr' },
  { lang: 'ar', text: 'مرحبًا', dir: 'rtl' },
  { lang: 'zh', text: '你好', dir: 'ltr' },
  { lang: 'es', text: 'hola', dir: 'ltr' },
] as const;

export function FooterGreeting() {
  const heading = useRef<HTMLHeadingElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let inView = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    function sync() {
      clearInterval(timer);
      if (reduced.matches) { setIndex(0); return; }
      if (!inView || document.hidden) return;
      timer = setInterval(() => setIndex(previous => (previous + 1) % greetings.length), 2000);
    }
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
    if (heading.current) observer.observe(heading.current);
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', sync);
    return () => {
      clearInterval(timer);
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      reduced.removeEventListener('change', sync);
    };
  }, []);

  return <h2 ref={heading} className="footer-greeting" data-language={greetings[index].lang}>
    <span className="sr-only">Say hello.</span>
    <span className="footer-greeting-visual" aria-hidden="true">
      <span>Say</span>{' '}
      <span className="footer-greeting-slot">
        {greetings.map((greeting, position) => <span key={greeting.lang} lang={greeting.lang} className={`footer-greeting-word${position === index ? ' is-active' : ''}`}><bdi dir={greeting.dir}>{greeting.text}</bdi>.</span>)}
      </span>
    </span>
  </h2>;
}
