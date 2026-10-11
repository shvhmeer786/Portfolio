'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, GithubLogo, ArrowClockwise } from '@phosphor-icons/react';
import { githubUsername } from '@/content/footer-widgets';
import { recentContributions, type ContributionFeed } from '@/lib/github-contributions';

const colors = ['#2d352b', '#0e4429', '#006d32', '#26a641', '#39d353'];
const dateFormat = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const monthFormat = new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' });
const dayLength = 86400000;

export function GitHubActivity({ active }: { active: boolean }) {
  const [feed, setFeed] = useState<ContributionFeed | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const request = useRef<AbortController | null>(null);
  const lastLoaded = useRef(0);

  async function load(force = false) {
    if (!force && Date.now() - lastLoaded.current < 300000) return;
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError(false);
    try {
      const response = await fetch('/api/github-activity', { signal: controller.signal });
      if (!response.ok) throw new Error('Unavailable');
      const next: ContributionFeed = await response.json();
      if (!controller.signal.aborted) { setFeed(next); lastLoaded.current = Date.now(); }
    } catch {
      if (!controller.signal.aborted) setError(true);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    if (!active) return;
    const refresh = () => { if (!document.hidden) void load(); };
    refresh();
    const timer = window.setInterval(refresh, 300000);
    document.addEventListener('visibilitychange', refresh);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', refresh); request.current?.abort(); };
  }, [active]);

  const recent = feed ? recentContributions(feed.days, 26) : null;
  const start = recent ? Date.parse(recent.start) : 0;
  const days = new Map(recent?.days.map(day => [day.date, day]) ?? []);
  const months = Array.from({ length: 26 }, (_, column) => new Date(start + column * 7 * dayLength));
  return <>
    <div className="widget-heading"><span><GithubLogo size={18} />GitHub activity</span><a href={`https://github.com/${githubUsername}`} target="_blank" rel="noopener noreferrer" aria-label="View Shahmeer’s activity on GitHub"><ArrowUpRight size={17} /></a></div>
    {recent ? <>
      <div className="github-widget-total"><span>{recent.total.toLocaleString()}</span> contributions<span className="github-widget-period">Last 26 weeks</span></div>
      <svg className="github-widget-calendar" viewBox="0 0 304 98" role="img" aria-label={`${recent.total} GitHub contributions over the last 26 weeks. Brighter green squares mean more activity.`}>
        {months.map((month, column) => (column === 0 || month.getUTCMonth() !== months[column - 1].getUTCMonth()) && <text key={column} x={18 + column * 11} y="10">{monthFormat.format(month)}</text>)}
        {[1, 3, 5].map(row => <text key={row} x="0" y={25 + row * 11}>{['S', 'M', 'T', 'W', 'T', 'F', 'S'][row]}</text>)}
        {Array.from({ length: 182 }, (_, index) => {
          const column = Math.floor(index / 7), row = index % 7;
          const date = new Date(start + index * dayLength);
          const day = days.get(date.toISOString().slice(0, 10));
          return <rect key={index} x={18 + column * 11} y={18 + row * 11} width="9" height="9" rx="2" fill={day ? colors[day.level] : 'transparent'}><title>{day ? `${day.count} contribution${day.count === 1 ? '' : 's'} on ${dateFormat.format(date)}` : 'Not yet recorded'}</title></rect>;
        })}
      </svg>
      <div className="github-widget-bottom"><span>{error ? 'Showing last available activity' : 'Updates automatically'}</span><span className="github-widget-legend" aria-label="Less to more activity">Less{colors.map(color => <i key={color} style={{ background: color }} />)}More</span></div>
    </> : <div className="github-widget-empty" role="status"><GithubLogo size={30} /><p>{error ? 'GitHub activity is taking a moment.' : 'Loading GitHub activity…'}</p>{error && <button disabled={loading} onClick={() => void load(true)}><ArrowClockwise size={14} />Try again</button>}</div>}
  </>;
}
