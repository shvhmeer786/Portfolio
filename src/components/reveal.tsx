'use client';
import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -35px 0px' }} transition={{ duration: reduced ? 0 : 0.55, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}
