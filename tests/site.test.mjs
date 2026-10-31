import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const load = file => JSON.parse(readFileSync(new URL(`../src/dictionaries/${file}.json`, import.meta.url)));
const shape = (value, path = '') => {
  if (Array.isArray(value)) return [`${path}[${value.length}]`, ...value.flatMap((item, index) => shape(item, `${path}.${index}`))];
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([key, item]) => shape(item, path ? `${path}.${key}` : key));
  return [path];
};

test('language follows remembered choice, then country, then browser', async () => {
  const { detectLocale } = await import('../src/lib/i18n.ts');
  assert.equal(detectLocale({ country: 'TW' }), 'zh-hant');
  assert.equal(detectLocale({ country: 'LK' }), 'si');
  assert.equal(detectLocale({ country: 'LK', acceptLanguage: 'ta-LK,ta;q=0.9,en;q=0.5' }), 'ta');
  assert.equal(detectLocale({ country: 'TW', cookie: 'en' }), 'en');
  assert.equal(detectLocale({ country: 'DE', acceptLanguage: 'de-DE,de;q=0.9' }), 'en');
  assert.equal(detectLocale({ acceptLanguage: 'zh-TW,zh;q=0.9' }), 'zh-hant');
  assert.equal(detectLocale({ acceptLanguage: 'zh-CN' }), 'en');
});

test('language switching keeps the current page', async () => {
  const { swapLocale } = await import('../src/lib/i18n.ts');
  assert.equal(swapLocale('/en/collections/qj711-bianco-calacatta', 'ta'), '/ta/collections/qj711-bianco-calacatta');
  assert.equal(swapLocale('/en', 'si'), '/si');
});

test('every translation matches the English structure and placeholders', () => {
  const english = load('en');
  for (const locale of ['si', 'ta', 'zh-hant']) {
    const translated = load(locale);
    assert.deepEqual(shape(translated), shape(english), locale);
    assert.ok(translated.forms.thanks.includes('{reference}'), locale);
    assert.ok(translated.catalogue.results.includes('{count}'), locale);
  }
});

test('the catalogue keeps all 50 authentic surfaces and their assets', async () => {
  const { allProducts } = await import('../src/lib/data/products.ts');
  assert.equal(allProducts.length, 50);
  assert.equal(new Set(allProducts.map(product => product.code)).size, 50);
  assert.equal(new Set(allProducts.map(product => product.slug)).size, 50);
  for (const product of allProducts) {
    assert.ok(existsSync(new URL(`../public${product.swatch}`, import.meta.url)), product.swatch);
    assert.ok(existsSync(new URL(`../public/textures/${product.code.toLowerCase()}.jpg`, import.meta.url)), product.code);
    assert.ok(existsSync(new URL(`../public/downloads/spec-sheets/${product.code.toLowerCase()}.pdf`, import.meta.url)), product.code);
  }
});

test('filters widen within a group and narrow across groups', async () => {
  const { allProducts } = await import('../src/lib/data/products.ts');
  const { emptyFilters, filterProducts } = await import('../src/lib/catalogue.ts');
  const count = filters => filterProducts(allProducts, { ...emptyFilters, ...filters }).length;
  assert.equal(count({}), 50);
  assert.equal(count({ collection: 'designers' }), 6);
  assert.ok(count({ colour: ['white', 'black'] }) > count({ colour: ['white'] }));
  assert.ok(count({ colour: ['white'], pattern: ['veined'] }) < count({ colour: ['white'] }));
  assert.deepEqual(filterProducts(allProducts, { ...emptyFilters, q: 'qj711' }).map(product => product.name), ['Bianco Calacatta']);
  assert.equal(count({ q: 'no such stone' }), 0);
});

test('filtered views survive a round trip through the URL', async () => {
  const { emptyFilters, filtersToQuery, parseFilters } = await import('../src/lib/catalogue.ts');
  const filters = { ...emptyFilters, q: 'grey', collection: 'nature', colour: ['grey', 'black'], thickness: ['20'] };
  assert.deepEqual(parseFilters(Object.fromEntries(new URLSearchParams(filtersToQuery(filters)))), filters);
});

test('favourites toggle and compare stops at four', async () => {
  const { emptySaved, toggleCompare, toggleFavourite } = await import('../src/lib/shortlist.ts');
  assert.equal(toggleFavourite(toggleFavourite(emptySaved, 'QJ711'), 'QJ711').favourites.length, 0);
  const full = ['A', 'B', 'C', 'D', 'E'].reduce(toggleCompare, emptySaved);
  assert.deepEqual(full.compare, ['A', 'B', 'C', 'D']);
});

test('share links keep names and notes in any language', async () => {
  const { decodeShortlist, encodeShortlist } = await import('../src/lib/shortlist.ts');
  const shared = { name: 'ගාලු පාර 廚房', items: [{ code: 'QJ711', note: 'Island top' }, { code: 'QJ905', note: '' }] };
  const token = encodeShortlist(shared);
  assert.match(token, /^[\w-]+$/);
  assert.deepEqual(decodeShortlist(token), shared);
  assert.equal(decodeShortlist('not a list'), null);
});

test('request forms enforce their own required fields', async () => {
  const { validateSubmission } = await import('../src/lib/inquiry.ts');
  const person = { name: 'A', email: 'a@example.com', phone: '1' };
  assert.deepEqual(Object.keys(validateSubmission('contact', {}, [])).sort(), ['email', 'message', 'name']);
  assert.equal(validateSubmission('contact', { ...person, email: 'nope', message: 'Hi' }, []).email, 'invalidEmail');
  assert.equal(validateSubmission('sample', { ...person, deliveryAddress: 'Colombo' }, []).products, 'pickProduct');
  assert.deepEqual(validateSubmission('sample', { ...person, deliveryAddress: 'Colombo' }, ['QJ711']), {});
  assert.equal(validateSubmission('consultation', { ...person, consultationType: 'site', preferredDate: '2026-11-01', preferredTime: 'morning' }, []).siteAddress, 'required');
});

test('marked corners work in any click order and map onto the surface', async () => {
  const { orderCorners, quadToSquare } = await import('../src/lib/homography.ts');
  const corners = orderCorners([{ x: 100, y: 90 }, { x: 10, y: 10 }, { x: 0, y: 100 }, { x: 110, y: 5 }]);
  assert.deepEqual(corners, [{ x: 10, y: 10 }, { x: 110, y: 5 }, { x: 100, y: 90 }, { x: 0, y: 100 }]);
  const toSurface = quadToSquare(corners);
  for (const [point, expected] of [[corners[0], [0, 0]], [corners[1], [1, 0]], [corners[2], [1, 1]], [corners[3], [0, 1]]]) {
    const [u, v] = toSurface(point.x, point.y);
    assert.ok(Math.abs(u - expected[0]) < 1e-9 && Math.abs(v - expected[1]) < 1e-9);
  }
});

test('applied surfaces stay inside the marked area and keep the photo shading', async () => {
  const { blendSurface } = await import('../src/lib/homography.ts');
  const width = 40, height = 40;
  const photo = { data: new Uint8ClampedArray(width * height * 4).fill(200), width, height };
  const texture = { data: new Uint8ClampedArray([10, 20, 30, 255]), width: 1, height: 1 };
  blendSurface(photo, [{ x: 10, y: 10 }, { x: 30, y: 10 }, { x: 30, y: 30 }, { x: 10, y: 30 }], texture);
  assert.equal(photo.data[(20 * width + 20) * 4], 10);
  assert.equal(photo.data[(2 * width + 2) * 4], 200);
});
