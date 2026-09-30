'use client';

import { useLayoutEffect, useRef, useState } from 'react';

export function FooterWordmark() {
  const container = useRef<HTMLDivElement>(null);
  const english = useRef<HTMLSpanElement>(null);
  const arabic = useRef<HTMLSpanElement>(null);
  const [sizes, setSizes] = useState<{ english: number; arabic: number }>();

  useLayoutEffect(() => {
    const element = container.current;
    if (!element) return;
    let disposed = false;
    function fit() {
      if (disposed || !element || !english.current || !arabic.current) return;
      const width = element.clientWidth;
      const enWidth = english.current.getBoundingClientRect().width;
      const arWidth = arabic.current.getBoundingClientRect().width;
      if (width && enWidth && arWidth) setSizes({ english: width * 100 / enWidth, arabic: width * 100 / arWidth });
    }
    const observer = new ResizeObserver(fit);
    observer.observe(element);
    fit();
    void document.fonts.ready.then(fit);
    return () => { disposed = true; observer.disconnect(); };
  }, []);

  return <div ref={container} className="footer-wordmark" tabIndex={0} role="img" aria-label="Shahmeer Ali">
    <span className="footer-name footer-name-arabic" lang="ar" dir="rtl" aria-hidden="true" style={sizes ? { fontSize: sizes.arabic } : undefined}>شاهمير علي</span>
    <span className="footer-name footer-name-english" lang="en" aria-hidden="true" style={sizes ? { fontSize: sizes.english } : undefined}>Shahmeer Ali.</span>
    <span className="footer-name-measure-box" aria-hidden="true">
      <span ref={arabic} className="footer-name-measure footer-name-arabic" lang="ar" dir="rtl">شاهمير علي</span>
      <span ref={english} className="footer-name-measure footer-name-english" lang="en">Shahmeer Ali.</span>
    </span>
  </div>;
}
