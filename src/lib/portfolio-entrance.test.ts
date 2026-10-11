import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldPlayEntrance } from './portfolio-entrance';

const firstVisit = { pathname: '/', reduced: false, welcomed: false, navigationType: 'navigate', hash: '' };
test('opens on first entry and refresh, without replaying on back navigation', () => {
  assert.equal(shouldPlayEntrance(firstVisit), true);
  assert.equal(shouldPlayEntrance({ ...firstVisit, welcomed: true, navigationType: 'reload' }), true);
  assert.equal(shouldPlayEntrance({ ...firstVisit, welcomed: true, navigationType: 'back_forward' }), false);
  assert.equal(shouldPlayEntrance({ ...firstVisit, welcomed: true }), false);
});
test('keeps reduced-motion visits, deep links and project pages immediately accessible', () => {
  assert.equal(shouldPlayEntrance({ ...firstVisit, reduced: true }), false);
  for (const hash of ['#experience', '#contact', '#experience-microsoft']) {
    assert.equal(shouldPlayEntrance({ ...firstVisit, hash, navigationType: 'reload' }), false);
  }
  assert.equal(shouldPlayEntrance({ ...firstVisit, pathname: '/projects/research' }), false);
});
