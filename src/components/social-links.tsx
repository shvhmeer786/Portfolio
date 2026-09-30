import { LinkedinLogo, GithubLogo, EnvelopeSimple, XLogo } from '@phosphor-icons/react/dist/ssr';
import { profile } from '@/content/portfolio';

const links = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/shahmeer-ali-6995b11b6/', icon: LinkedinLogo },
  { label: 'GitHub', href: 'https://github.com/shvhmeer786', icon: GithubLogo },
  { label: 'Email Shahmeer', href: `mailto:${profile.email}`, icon: EnvelopeSimple },
  { label: 'X', href: 'https://x.com/shvhmeer', icon: XLogo },
];

export function SocialLinks() {
  return <nav className="hero-socials" aria-label="Find Shahmeer online">{links.map(({ label, href, icon: Icon }) =>
    <a key={label} href={href} aria-label={label} title={label} target={href.startsWith('https:') ? '_blank' : undefined} rel={href.startsWith('https:') ? 'noopener noreferrer' : undefined}><Icon size={21} weight="regular" aria-hidden="true" /></a>
  )}</nav>;
}
