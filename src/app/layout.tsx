import type { Metadata } from 'next';
import { profile } from '@/content/portfolio';
import '@fontsource/geist/400.css';
import '@fontsource/geist/500.css';
import '@fontsource/newsreader/400.css';
import '@fontsource/noto-naskh-arabic/400.css';
import 'lenis/dist/lenis.css';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SmoothScroll } from '@/components/smooth-scroll';
import { PortfolioBot } from '@/components/portfolio-bot';

export const metadata: Metadata = { title: { default: `Shahmeer Ali | ${profile.focus}`, template: '%s | Shahmeer Ali' }, description: `Shahmeer Ali is an applied scientist and researcher working in applied AI. ${profile.biography} Based in ${profile.location}.`, icons: { icon: '/favicon.svg' } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Header />{children}<Footer /><SmoothScroll /><PortfolioBot /></body></html>;
}
