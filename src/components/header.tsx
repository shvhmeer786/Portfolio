'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, List, X } from '@phosphor-icons/react';
import { AnimatedWordmark } from './animated-wordmark';

const links = [{ label: 'Experience', href: '/#experience' }, { label: 'Contact', href: '/#contact' }];
export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    function close(event: KeyboardEvent) { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); } }
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  return <header className="site-header shell">
    <Link className="wordmark" href="/" aria-label="Shahmeer Ali home"><AnimatedWordmark /></Link>
    <nav className="desktop-nav" aria-label="Main navigation">{links.map(link => <Link key={link.label} href={link.href}>{link.label}{link.label === 'Contact' && <ArrowUpRight size={15} />}</Link>)}</nav>
    <button ref={toggle} className="mobile-menu-toggle" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>Menu {open ? <X size={22} /> : <List size={22} />}</button>
    {open && <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">{links.map(link => <Link key={link.label} href={link.href} onClick={() => setOpen(false)}>{link.label}<ArrowUpRight size={18} /></Link>)}</nav>}
  </header>;
}
