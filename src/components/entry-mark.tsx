import { WindowsLogo, GraduationCap, Atom, BracketsCurly } from '@phosphor-icons/react/dist/ssr';

export function EntryMark({ slug, large = false }: { slug: string; large?: boolean }) {
  const size = large ? 64 : 23;
  if (slug === 'microsoft') return <WindowsLogo size={size} weight="fill" aria-hidden />;
  if (slug === 'waterloo') return <GraduationCap size={size} weight="light" aria-hidden />;
  if (slug === 'research') return <Atom size={size} weight="light" aria-hidden />;
  if (slug === 'applied-ai') return <BracketsCurly size={size} weight="light" aria-hidden />;
  return <span className={large ? 'orena-initial large' : 'orena-initial'} aria-hidden>O</span>;
}
