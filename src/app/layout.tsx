import type { Metadata } from 'next';
import { profile } from '@/content/portfolio';
import '@fontsource/geist/latin-400.css';
import '@fontsource/geist/latin-500.css';
import '@fontsource/newsreader/latin-400.css';
import '@fontsource/noto-naskh-arabic/400.css';
import 'lenis/dist/lenis.css';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SmoothScroll } from '@/components/smooth-scroll';
import { PortfolioBot } from '@/components/portfolio-bot';
import { ScrollProgress } from '@/components/scroll-progress';

export const metadata: Metadata = { title: { default: `Shahmeer Ali | ${profile.focus}`, template: '%s | Shahmeer Ali' }, description: `Shahmeer Ali is an applied scientist and researcher working in applied AI. ${profile.biography} Based in ${profile.location}.`, icons: { icon: '/favicon.svg' } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><ScrollProgress /><a className="skip-link" href="#main">Skip to content</a><Header />{children}<Footer /><SmoothScroll /><PortfolioBot /></body></html>;
}
