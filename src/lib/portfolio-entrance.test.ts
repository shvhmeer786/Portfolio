import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldPlayEntrance } from './portfolio-entrance';

const homepage = { pathname: '/', reduced: false, hash: '' };
test('allows the opening on every homepage entry without a visit-history requirement', () => {
  assert.equal(shouldPlayEntrance(homepage), true);
});
test('keeps reduced-motion visits, deep links and project pages immediately accessible', () => {
  assert.equal(shouldPlayEntrance({ ...homepage, reduced: true }), false);
  for (const hash of ['#experience', '#contact', '#experience-microsoft']) {
    assert.equal(shouldPlayEntrance({ ...homepage, hash }), false);
  }
  assert.equal(shouldPlayEntrance({ ...homepage, pathname: '/projects/research' }), false);
});
