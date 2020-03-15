import * as qs from '../../src/querystring';

test('stringify works with one key', () => {
  expect(qs.stringify({ test: 'value' }))
    .toBe("test=value");;
});

test('stringify works with two keys', () => {
  expect(qs.stringify({ test: 'value', parking: "boss" }))
    .toBe("test=value&parking=boss");;
});

test('stringify works with duplicate key', () => {
  expect(qs.stringify({ test: ['val1', 'val2'] }))
    .toBe("test=val1&test=val2");
});

test('stringify works with duplicate key and other', () => {
  expect(qs.stringify({ test: ['val1', 'val2'], parking: 'boss' }))
    .toBe("test=val1&test=val2&parking=boss");
});

test('stringify works with empty object', () => {
  expect(qs.stringify({})).toBe("");
});
