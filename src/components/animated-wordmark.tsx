'use client';
import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

export function AnimatedWordmark() {
  const [arabic, setArabic] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    function resume() {
      if (timer) clearInterval(timer);
      if (!document.hidden) timer = setInterval(() => setArabic(value => !value), 3000);
    }
    resume();
    document.addEventListener('visibilitychange', resume);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', resume); };
  }, [reduced]);
  return <span className="wordmark-window" aria-hidden="true" data-language={arabic && !reduced ? 'ar' : 'en'}>
    <span className="wordmark-name wordmark-english" lang="en">Shahmeer Ali</span>
    <span className="wordmark-name wordmark-arabic" lang="ar" dir="rtl">شاهمير علي</span>
  </span>;
}
