import type { MetadataRoute } from 'next';
import { projects } from '@/content/portfolio';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL },
    ...projects.filter(entry => !entry.sample).map(entry => ({
      url: `${SITE_URL}/projects/${entry.slug}`,
    })),
  ];
}
