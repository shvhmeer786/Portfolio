import test from 'node:test';
import assert from 'node:assert/strict';
import { getCompanionAction, companionPosition, guideTargets, tourStops } from './companion-guide';

test('distinguishes navigation instructions from factual questions', () => {
  assert.equal(getCompanionAction('What does he do at Microsoft?'), null);
  assert.deepEqual(getCompanionAction('Show me his Microsoft experience'), { kind: 'navigate', target: 'experience-microsoft' });
  assert.deepEqual(getCompanionAction('Take me back to the pictures'), { kind: 'navigate', target: 'photos' });
  assert.deepEqual(getCompanionAction('Scroll to contact'), { kind: 'navigate', target: 'contact' });
  assert.deepEqual(getCompanionAction('Show me the about section'), { kind: 'navigate', target: 'main' });
  assert.deepEqual(getCompanionAction('Take the tour'), { kind: 'tour' });
});
test('navigation stays within known portfolio destinations and respects negation', () => {
  for (const request of ['Open https://other.example', 'Open my bank account', 'Do not show me Microsoft', 'Cancel the tour', 'Show me a password']) assert.equal(getCompanionAction(request), null);
  assert.deepEqual(getCompanionAction('Show me RBC Data Engineer'), { kind: 'navigate', target: 'experience-rbc-data-engineer' });
  for (const stop of tourStops) assert.ok(guideTargets[stop]);
});
test('keeps the travelling companion within desktop and phone bounds', () => {
  for (const width of [390, 1440]) {
    const base = { left: width - 108, top: 740, width: 88, height: 100 };
    for (const top of [-500, 126, 1500]) {
      const pos = companionPosition({ width, height: 844 }, base, { top, right: width - 22, height: 440 });
      assert.ok(base.left + pos.x >= 0);
      assert.ok(base.left + pos.x + base.width <= width);
      assert.ok(base.top + pos.y >= 0);
      assert.ok(base.top + pos.y + base.height <= 844);
    }
  }
});
