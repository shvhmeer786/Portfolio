import type Lenis from 'lenis';
let driver: Lenis | undefined;
export function setPortfolioScrollDriver(value: Lenis | undefined) { driver = value; }
export function scrollToPortfolioTarget(target: HTMLElement, offset: number, reduced: boolean) {
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  if (driver) driver.scrollTo(top, { immediate: reduced, duration: 1.05, lerp: 0, easing: t => 1 - Math.pow(1 - t, 3) });
  else window.scrollTo({ top, behavior: reduced ? 'instant' : 'smooth' });
}
