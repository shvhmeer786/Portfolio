import { profile } from '@/content/portfolio';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { FooterClock } from './footer-clock';
import { Reveal } from './reveal';
import { FooterRecord } from './footer-record';

export function Footer() {
  return <footer className="site-footer shell" id="contact">
    <div className="contact-inner"><div><h2>Say hello.</h2><p>For research, collaboration, or a good conversation.</p></div><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={21} /></a></div>
    <Reveal className="footer-information">
      <div className="footer-information-block"><h3>Toronto time</h3><FooterClock /></div>
      <div className="footer-information-block footer-note"><h3>A small note</h3><p>Based in {profile.location}.</p><p>A space for research, ideas, and the person behind them.</p><span>Always a work in progress.</span></div>
      <nav className="footer-information-block footer-navigation" aria-label="Footer navigation"><h3>Explore</h3><Link href="/#experience">Experience</Link><Link href="/#about">Beyond the work</Link><Link href="/#main">Back to top <ArrowUpRight size={13} /></Link></nav>
      <FooterRecord />
    </Reveal>
    <Reveal className="footer-signature"><p className="footer-wordmark">Shahmeer Ali<span className="signature-dot" aria-hidden="true">.</span></p><div className="signature-caption"><span>{profile.focus}</span><span>Curiosity, continued.</span></div></Reveal>
    <div className="footer-bottom"><span>© {new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', year: 'numeric' }).format(new Date())} Shahmeer Ali</span><span>A little research. A little building. A little me.</span></div>
  </footer>;
}
