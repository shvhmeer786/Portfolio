import { notFound } from 'next/navigation';
import { projects } from '@/content/portfolio';
import { EntryDetail } from '@/components/entry-detail';

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const entry = projects.find(e => e.slug === slug); return { title: entry?.title ?? 'Project' }; }
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const entry = projects.find(e => e.slug === slug); if (!entry) notFound(); return <EntryDetail entry={entry} kind="projects" others={projects.filter(e => e.slug !== slug)} />; }
