import test from 'node:test';
import assert from 'node:assert/strict';
import { nextWidgetIndex, widgetSwipe } from './widget-stack';

test('swipes cycle in either direction and wrap through the stack', () => {
  assert.equal(widgetSwipe(5, -80), 1);
  assert.equal(widgetSwipe(-10, 70), -1);
  assert.equal(nextWidgetIndex(2, 1, 3), 0);
  assert.equal(nextWidgetIndex(0, -1, 3), 2);
});

test('taps, small movements, and horizontal page gestures do not switch widgets', () => {
  for (const [x, y] of [[0, 0], [0, 25], [100, 60], [-70, -50]]) assert.equal(widgetSwipe(x, y), 0);
});
