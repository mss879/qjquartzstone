const clamp = (value: number) => Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
const blend = (value: number, start: number, end: number) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

export function getScrollProgress(top: number, height: number, viewport: number) {
  return height <= viewport ? 0 : clamp(-top / (height - viewport));
}

export function getStoryFrame(progress: number) {
  const p = clamp(progress);
  const toSlab = blend(p, .18, .36);
  const toDetail = blend(p, .36, .6);
  const toSpace = blend(p, .68, .94);
  return {
    sculptureOpacity: 1 - toSlab,
    sculptureRotation: -10 + toSlab * 18,
    sculptureScale: 1 - toSlab * .35,
    slabOpacity: toSlab * (1 - toSpace),
    slabRotation: -12 + toDetail * 24 - toSpace * 12,
    slabScale: .78 + toDetail * .32 + toSpace * .5,
    interiorOpacity: toSpace,
    interiorScale: 1.12 - toSpace * .12,
    chapter: p < .25 ? 0 : p < .48 ? 1 : p < .82 ? 2 : 3,
    progress: p,
  };
}
