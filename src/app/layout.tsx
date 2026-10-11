import type { Metadata } from 'next';
import { profile } from '@/content/portfolio';
import localFont from 'next/font/local';
import '@fontsource/noto-naskh-arabic/400.css';
import 'lenis/dist/lenis.css';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SmoothScroll } from '@/components/smooth-scroll';
import { PortfolioBot } from '@/components/portfolio-bot';

const michelangelus = localFont({
  src: [
    { path: '../fonts/michelangelus/Michelangelus-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../fonts/michelangelus/Michelangelus-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../fonts/michelangelus/Michelangelus-Italic.ttf', weight: '400', style: 'italic' },
    { path: '../fonts/michelangelus/Michelangelus-BoldItalic.ttf', weight: '700', style: 'italic' },
  ],
  variable: '--font-michelangelus',
  display: 'swap',
  preload: false,
  adjustFontFallback: 'Times New Roman',
  fallback: ['Georgia', 'serif'],
});

export const metadata: Metadata = { title: { default: `Shahmeer Ali | ${profile.focus}`, template: '%s | Shahmeer Ali' }, description: `Shahmeer Ali is an applied scientist and researcher working in applied AI. ${profile.biography} Based in ${profile.location}.`, icons: { icon: '/favicon.svg' } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={michelangelus.variable}><body><a className="skip-link" href="#main">Skip to content</a><Header />{children}<Footer /><SmoothScroll /><PortfolioBot /></body></html>;
}
