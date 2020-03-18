import * as qs from '../../src/qs';

test('toSearchParams handles empty', () => {
  const sp = qs.toSearchParams('');
  expect(sp).toBeInstanceOf(URLSearchParams);
  expect(sp.toString()).toBe('');
});

test('toSearchParams handles single quote empty', () => {
  const sp = qs.toSearchParams('?');
  expect(sp).toBeInstanceOf(URLSearchParams);
  expect(sp.toString()).toBe('');
});

test('toSearchParams handles empty url', () => {
  const sp = qs.toSearchParams('http://www.example.com');
  expect(sp).toBeInstanceOf(URLSearchParams);
  expect(sp.toString()).toBe('');
});

test('toSearchParams handles single quote empty url', () => {
  const sp = qs.toSearchParams('http://www.example.com?');
  expect(sp).toBeInstanceOf(URLSearchParams);
  expect(sp.toString()).toBe('');
});

test('toSearchParams handles single', () => {
  const sp = qs.toSearchParams('test=val');
  expect(sp).toBeInstanceOf(URLSearchParams);
  expect(sp.toString()).toBe('test=val');
});

test('toSearchParams handles single quote single', () => {
  const sp = qs.toSearchParams('?test=val');
  expect(sp).toBeInstanceOf(URLSearchParams);
  expect(sp.toString()).toBe('test=val');
});

test('toSearchParams handles single url', () => {
  const sp = qs.toSearchParams('http://www.example.com?test=val');
  expect(sp).toBeInstanceOf(URLSearchParams);
  expect(sp.toString()).toBe('test=val');
});
