import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { profile, experiences } from '@/content/portfolio';
import { PhotoGallery } from '@/components/photo-gallery';
import { Reveal } from '@/components/reveal';
import Image from 'next/image';
import { SocialLinks } from '@/components/social-links';
import { ExperienceHighlight } from '@/components/experience-highlight';

export default function Home() {
  return <main id="main" className="shell">
    <section className="home-hero" aria-labelledby="intro-heading">
      <Reveal className="hero-copy"><h1 id="intro-heading">I’m Shahmeer.</h1><p className="hero-intro">{profile.introduction}</p><p className="hero-biography">{profile.biography}</p><p className="hero-location">Based in {profile.location}.</p><div className="hero-links"><a className="text-link" href="#experience">View my experience <ArrowUpRight size={18} /></a><a className="text-link secondary-link" href={`mailto:${profile.email}`}>Say hello <ArrowUpRight size={18} /></a></div><SocialLinks /></Reveal>
      <Reveal delay={0.1}><PhotoGallery /></Reveal>
    </section>
    <section id="experience" className="experience-section section-gap" aria-labelledby="experience-heading"><Reveal><div className="section-heading"><h2 id="experience-heading">Experience</h2><p>Research, building, and learning along the way.</p></div></Reveal>
      <ExperienceHighlight>
        {experiences.map((entry, i) => <Reveal key={entry.slug} delay={Math.min(i * 0.04, 0.16)}>
          <article className="experience-row" id={`experience-${entry.slug}`}>
            <div className="experience-identity">
              <a className={`experience-logo experience-logo-${entry.slug}`} href={entry.href} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${entry.organization} website`}>
                <Image src={entry.logo} alt="" width={40} height={40} unoptimized />
              </a>
              <div className="experience-info">
                <h3><a className="experience-company-link" href={entry.href} target="_blank" rel="noopener noreferrer">{entry.organization}</a></h3>
                <p>{entry.title}</p>
                {entry.team && <span className="experience-team">{entry.team}</span>}
              </div>
            </div>
            <p className="experience-summary">{entry.summary}</p>
            <div className="experience-meta"><span className="experience-date">{entry.date}</span><span className="experience-location">{entry.location}</span></div>
          </article>
        </Reveal>)}
      </ExperienceHighlight>
    </section>
  </main>;
}
