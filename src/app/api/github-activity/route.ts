import { githubUsername } from '@/content/footer-widgets';
import { parseContributionCalendar } from '@/lib/github-contributions';

export async function GET() {
  try {
    const response = await fetch(`https://github.com/users/${encodeURIComponent(githubUsername)}/contributions`, {
      headers: { Accept: 'text/html', 'Accept-Language': 'en-US', 'User-Agent': 'Shahmeer-Portfolio' },
      next: { revalidate: 300 }, signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error('GitHub unavailable');
    const days = parseContributionCalendar(await response.text());
    if (days.length < 350 || days.length > 371) throw new Error('Incomplete calendar');
    const date = Date.parse(response.headers.get('date') ?? '');
    return Response.json({ days, username: githubUsername, updatedAt: new Date(Number.isFinite(date) ? date : Date.now()).toISOString() }, {
      headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch {
    return Response.json({ error: 'GitHub activity is unavailable right now.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
