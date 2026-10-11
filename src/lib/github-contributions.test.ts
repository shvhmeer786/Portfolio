import test from 'node:test';
import assert from 'node:assert/strict';
import { parseContributionCalendar, recentContributions } from './github-contributions';

test('matches GitHub cells to their tooltips and sorts calendar dates, including a year boundary', () => {
  const html = `<td data-level="2" id="jan" data-date="2026-01-01"></td><td data-date='2025-12-31' id='dec' data-level='0'></td>
    <tool-tip for="dec">No contributions on December 31st.</tool-tip><tool-tip for="jan">1,234 contributions on January 1st.</tool-tip>`;
  assert.deepEqual(parseContributionCalendar(html), [
    { date: '2025-12-31', level: 0, count: 0 }, { date: '2026-01-01', level: 2, count: 1234 },
  ]);
});

test('rejects missing counts, impossible dates, duplicate days, and non-calendar responses', () => {
  for (const html of ['<h1>Sign in</h1>', '<td data-date="2026-01-01" id="x" data-level="3"></td>',
    '<td data-date="2026-02-30" id="x" data-level="0"></td><tool-tip for="x">No contributions</tool-tip>',
    '<td data-date="2026-01-01" id="x" data-level="9"></td><tool-tip for="x">2 contributions</tool-tip>',
    '<td data-date="2026-01-01" id="x" data-level="0"></td><td data-date="2026-01-01" id="x" data-level="0"></td><tool-tip for="x">No contributions</tool-tip>']) {
    assert.throws(() => parseContributionCalendar(html));
  }
});

test('the recent graph starts on Sunday and reports only the displayed contribution total', () => {
  const days = Array.from({ length: 365 }, (_, index) => ({ date: new Date(Date.UTC(2025, 9, 11 + index)).toISOString().slice(0, 10), count: 1, level: 1 }));
  const recent = recentContributions(days, 26);
  assert.equal(recent.start, '2026-04-12');
  assert.equal(recent.days.length, 182);
  assert.equal(recent.total, 182);
  assert.equal(recent.days[181].date, '2026-10-10');
});
