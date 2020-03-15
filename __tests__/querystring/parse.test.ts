import * as qs from '../../src/querystring';

test('parse handles empty', () => {
  expect(qs.parse(''))
    .toStrictEqual({});
});

test('parse handles single value', () => {
  expect(qs.parse('test=val'))
    .toStrictEqual({ test: 'val' });
});

test('parse handles duplicate key', () => {
  expect(qs.parse('test=val&test=val2'))
    .toStrictEqual({ test: ['val', 'val2'] });
});

test('parse handles two keys', () => {
  expect(qs.parse('test1=val1&test2=val2'))
    .toStrictEqual({ test1: 'val1', test2: 'val2' });
});

test('parse handles duplicate key with other', () => {
  expect(qs.parse('arr=one&arr=two&test=val'))
    .toStrictEqual({
      arr: [ 'one', 'two' ],
      test: 'val',
    });
});

test('parse handles triple key with other', () => {
  expect(qs.parse('arr=one&arr=two&arr=three&test=val'))
    .toStrictEqual({
      arr: ['one', 'two', 'three'],
      test: 'val',
    });
});

test('parse works with URL', () => {
  expect(qs.parse(new URL("http://www.example.com?arr=one&arr=two&test=val")))
    .toStrictEqual({
      arr: ['one', 'two'],
      test: 'val',
    });
});

test('parse works with URLSearchParams', () => {
  expect(qs.parse(new URL("http://www.example.com?arr=one&arr=two&test=val").searchParams))
    .toStrictEqual({
      arr: ['one', 'two'],
      test: 'val',
    });
});
