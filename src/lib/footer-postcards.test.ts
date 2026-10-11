import test from 'node:test';
import assert from 'node:assert/strict';
import { constrainPostcard } from './footer-postcards';

test('keeps a dragged postcard inside the footer at every edge', () => {
  const frame = { width: 320, height: 600 };
  const card = { width: 136, height: 90 };
  assert.deepEqual(constrainPostcard({ x: -100, y: -100 }, frame, card, 0), { x: 76, y: 53 });
  assert.deepEqual(constrainPostcard({ x: 900, y: 900 }, frame, card, 0), { x: 244, y: 547 });
  assert.deepEqual(constrainPostcard({ x: 150, y: 200 }, frame, card, 0), { x: 150, y: 200 });
});

test('keeps the rotated corners inside the frame, including after a narrow resize', () => {
  for (const width of [276, 529, 1120]) {
    for (const rotation of [-8, 6, -5, 8]) {
      const frame = { width, height: 500 };
      const card = { width: 136, height: 90 };
      for (const target of [{ x: -500, y: -500 }, { x: 2000, y: 2000 }]) {
        const center = constrainPostcard(target, frame, card, rotation);
        const radians = rotation * Math.PI / 180;
        for (const dx of [-68, 68]) for (const dy of [-45, 45]) {
          const x = center.x + dx * Math.cos(radians) - dy * Math.sin(radians);
          const y = center.y + dx * Math.sin(radians) + dy * Math.cos(radians);
          assert.ok(x >= 8 - 1e-8 && x <= width - 8 + 1e-8);
          assert.ok(y >= 8 - 1e-8 && y <= 492 + 1e-8);
        }
      }
    }
  }
});
