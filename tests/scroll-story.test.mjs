import assert from 'node:assert/strict';
import test from 'node:test';

test('story starts at material, ends in interior and reverses without retained state', async () => {
  const { getStoryFrame } = await import('../src/lib/scroll-story.ts');
  const start = getStoryFrame(0);
  const end = getStoryFrame(1);
  assert.equal(start.sculptureOpacity, 1);
  assert.equal(start.interiorOpacity, 0);
  assert.equal(end.interiorOpacity, 1);
  assert.equal(end.slabOpacity, 0);
  assert.deepEqual(getStoryFrame(0), start);
});

test('progress is clamped and each transition remains continuous at its boundary', async () => {
  const { getStoryFrame } = await import('../src/lib/scroll-story.ts');
  assert.deepEqual(getStoryFrame(-1), getStoryFrame(0));
  assert.deepEqual(getStoryFrame(2), getStoryFrame(1));
  assert.deepEqual(getStoryFrame(NaN), getStoryFrame(0));
  for (const boundary of [.18, .36, .6, .78, .94]) {
    const a = getStoryFrame(boundary - .00001);
    const b = getStoryFrame(boundary + .00001);
    for (const key of Object.keys(a)) {
      assert.ok(Number.isFinite(a[key]));
      if (key !== 'chapter') assert.ok(Math.abs(a[key] - b[key]) < .02, key);
    }
  }
});

test('scroll position stays usable before, within and after the pinned scene', async () => {
  const { getScrollProgress } = await import('../src/lib/scroll-story.ts');
  assert.equal(getScrollProgress(100, 2000, 800), 0);
  assert.equal(getScrollProgress(-600, 2000, 800), .5);
  assert.equal(getScrollProgress(-2000, 2000, 800), 1);
  assert.equal(getScrollProgress(-100, 600, 800), 0);
});
