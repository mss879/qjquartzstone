export type Point = { x: number; y: number };
export type Quad = [Point, Point, Point, Point];
export type Pixels = { data: Uint8ClampedArray; width: number; height: number };

/** Sorts clicks into top-left, top-right, bottom-right, bottom-left so any click order works. */
export function orderCorners(points: Point[]): Quad {
  const centre = points.reduce((sum, point) => ({ x: sum.x + point.x / points.length, y: sum.y + point.y / points.length }), { x: 0, y: 0 });
  const clockwise = [...points].sort((a, b) => Math.atan2(a.y - centre.y, a.x - centre.x) - Math.atan2(b.y - centre.y, b.x - centre.x));
  const start = clockwise.reduce((best, point, index) => point.x + point.y < clockwise[best].x + clockwise[best].y ? index : best, 0);
  return [0, 1, 2, 3].map(offset => clockwise[(start + offset) % 4]) as Quad;
}

/** Heckbert's projective mapping from the unit square onto a quad, returned as its inverse: image position to surface position. */
export function quadToSquare([p0, p1, p2, p3]: Quad) {
  const dx3 = p0.x - p1.x + p2.x - p3.x, dy3 = p0.y - p1.y + p2.y - p3.y;
  const dx1 = p1.x - p2.x, dx2 = p3.x - p2.x, dy1 = p1.y - p2.y, dy2 = p3.y - p2.y;
  const denominator = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / denominator, h = (dx1 * dy3 - dx3 * dy1) / denominator;
  const a = p1.x - p0.x + g * p1.x, b = p3.x - p0.x + h * p3.x, c = p0.x;
  const d = p1.y - p0.y + g * p1.y, e = p3.y - p0.y + h * p3.y, f = p0.y;
  const A = e - f * h, B = c * h - b, C = b * f - c * e, D = f * g - d, E = a - c * g, F = c * d - a * f, G = d * h - e * g, H = b * g - a * h, I = a * e - b * d;
  return (x: number, y: number): [number, number] => { const w = G * x + H * y + I; return [(A * x + B * y + C) / w, (D * x + E * y + F) / w]; };
}

const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const mirror = (value: number) => { const wrapped = Math.abs(value) % 2; return wrapped > 1 ? 2 - wrapped : wrapped; };

/** Lays a texture onto the marked quad in perspective, keeping the photo's own light and shadow so the surface sits in the room. */
export function blendSurface(photo: Pixels, corners: Quad, texture: Pixels) {
  const toSurface = quadToSquare(corners);
  const quadWidth = (distance(corners[0], corners[1]) + distance(corners[3], corners[2])) / 2;
  const quadHeight = (distance(corners[0], corners[3]) + distance(corners[1], corners[2])) / 2;
  const repeatU = Math.max(1, (quadWidth / quadHeight) / (texture.width / texture.height));
  const left = Math.max(0, Math.floor(Math.min(...corners.map(point => point.x)))), right = Math.min(photo.width - 1, Math.ceil(Math.max(...corners.map(point => point.x))));
  const top = Math.max(0, Math.floor(Math.min(...corners.map(point => point.y)))), bottom = Math.min(photo.height - 1, Math.ceil(Math.max(...corners.map(point => point.y))));
  const luminance = (index: number) => photo.data[index] * .2126 + photo.data[index + 1] * .7152 + photo.data[index + 2] * .0722;

  let total = 0, count = 0;
  for (let y = top; y <= bottom; y += 2) for (let x = left; x <= right; x += 2) {
    const [u, v] = toSurface(x, y);
    if (u >= 0 && u <= 1 && v >= 0 && v <= 1) { total += luminance((y * photo.width + x) * 4); count++; }
  }
  const average = count ? total / count : 128;

  for (let y = top; y <= bottom; y++) for (let x = left; x <= right; x++) {
    const [u, v] = toSurface(x, y);
    if (u < 0 || u > 1 || v < 0 || v > 1) continue;
    const index = (y * photo.width + x) * 4;
    const sampleX = Math.min(texture.width - 1, Math.floor(mirror(u * repeatU) * texture.width)), sampleY = Math.min(texture.height - 1, Math.floor(v * texture.height));
    const sample = (sampleY * texture.width + sampleX) * 4;
    const shade = Math.min(1.3, Math.max(.45, luminance(index) / (average || 1)));
    const edge = Math.min(1, Math.min(u, 1 - u) * quadWidth / 1.5, Math.min(v, 1 - v) * quadHeight / 1.5);
    for (let channel = 0; channel < 3; channel++) photo.data[index + channel] = photo.data[index + channel] * (1 - edge) + texture.data[sample + channel] * shade * edge;
  }
  return photo;
}
