import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { notFound } from 'next/navigation';
import { projects } from '@/content/portfolio';
import { EntryDetail } from '@/components/entry-detail';

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = projects.find(e => e.slug === slug);
  if (!entry) notFound();
  return {
    title: entry.title,
    description: entry.summary,
    alternates: { canonical: `${SITE_URL}/projects/${entry.slug}` },
    robots: { index: !entry.sample, follow: true },
  };
}
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const entry = projects.find(e => e.slug === slug); if (!entry) notFound(); return <EntryDetail entry={entry} kind="projects" others={projects.filter(e => e.slug !== slug)} />; }
