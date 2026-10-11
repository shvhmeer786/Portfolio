'use client';

import { useLayoutEffect, useRef, useState } from 'react';

export function FooterWordmark() {
  const container = useRef<HTMLDivElement>(null);
  const arabic = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<number>();

  useLayoutEffect(() => {
    const element = container.current;
    if (!element) return;
    let disposed = false;
    function fit() {
      if (disposed || !element || !arabic.current) return;
      const width = element.clientWidth;
      const arWidth = arabic.current.getBoundingClientRect().width;
      if (width && arWidth) setSize(width * 100 / arWidth);
    }
    const observer = new ResizeObserver(fit);
    observer.observe(element);
    fit();
    void document.fonts.ready.then(fit);
    return () => { disposed = true; observer.disconnect(); };
  }, []);

  return <div ref={container} className="footer-wordmark" role="img" aria-label="Shahmeer Ali">
    <span className="footer-name footer-name-arabic" lang="ar" dir="rtl" aria-hidden="true" style={size ? { fontSize: size } : undefined}>شاهمير علي</span>
    <span className="footer-name-measure-box" aria-hidden="true">
      <span ref={arabic} className="footer-name-measure footer-name-arabic" lang="ar" dir="rtl">شاهمير علي</span>
    </span>
  </div>;
}
