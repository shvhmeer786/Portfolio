export type ContributionDay = { date: string; level: number; count: number };
export type ContributionFeed = { days: ContributionDay[]; updatedAt: string; username: string };
const dayLength = 86400000;

function attribute(tag: string, name: string) {
  return tag.match(new RegExp(`(?:^|\\s)${name}=(['"])(.*?)\\1`))?.[2];
}

export function parseContributionCalendar(html: string): ContributionDay[] {
  const counts = new Map<string, number>();
  for (const match of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
    const id = attribute(match[1], 'for');
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    const count = /^No contributions\b/.test(text) ? 0 : Number(text.match(/^([\d,]+) contributions?\b/)?.[1]?.replaceAll(',', ''));
    if (id && Number.isSafeInteger(count) && count >= 0) counts.set(id, count);
  }
  const dates = new Set<string>();
  const days: ContributionDay[] = [];
  for (const match of html.matchAll(/<td\b([^>]*)>/g)) {
    const date = attribute(match[1], 'data-date');
    if (!date) continue;
    const level = Number(attribute(match[1], 'data-level') ?? NaN);
    const count = counts.get(attribute(match[1], 'id') ?? '');
    const timestamp = Date.parse(`${date}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== date || dates.has(date) || !Number.isInteger(level) || level < 0 || level > 4 || count === undefined) throw new Error('Invalid contribution calendar');
    dates.add(date);
    days.push({ date, level, count });
  }
  days.sort((a, b) => a.date.localeCompare(b.date));
  if (!days.length || days.some((day, index) => index > 0 && Date.parse(day.date) - Date.parse(days[index - 1].date) !== dayLength)) throw new Error('Incomplete contribution calendar');
  return days;
}

export function recentContributions(days: ContributionDay[], weeks: number) {
  const end = new Date(`${days[days.length - 1].date}T00:00:00Z`);
  const start = new Date(end.getTime() - ((weeks - 1) * 7 + end.getUTCDay()) * dayLength).toISOString().slice(0, 10);
  const recent = days.filter(day => day.date >= start);
  return { start, days: recent, total: recent.reduce((sum, day) => sum + day.count, 0) };
}
