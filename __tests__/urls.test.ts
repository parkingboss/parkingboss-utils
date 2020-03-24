/**
 * @jest-environment jsdom
 */

import { build } from '../src/urls';

test('url parsed', () => {
  expect(build("http://www.example.com/test/path?arg1=true&arg2=false#anchor"))
    .toBe("/test/path?arg1=true&arg2=false#anchor");
});

test('url accepted', () => {
  const url = new URL("http://www.example.com/test/path?arg1=true&arg2=false#anchor");
  expect(build(url)).toBe("/test/path?arg1=true&arg2=false#anchor");
});

test('just query accepted', () => {
  expect(build({ query: { test1: 'true', test2: 'false' } })).toBe("/?test1=true&test2=false");
});

test('just hash accepted', () => {
  expect(build({ hash: 'test' })).toBe("/#test");
});

test('absolute works', () => {
  expect(build({ absolute: true })).toBe("http://localhost/");
});

test('login works', () => {
  expect(build({ login: true })).toBe(`https://my.parkingboss.com/user/navigate?url=${encodeURIComponent('http://localhost/')}`);
});

test('query can remove query param', () => {
  const url = new URL("http://www.example.com/home?test=removeme");
  expect(build(url, { query: { test: null } })).toBe('/home');
});

test('query can replace query param', () => {
  const url = new URL("http://www.example.com/home?test=removeme");
  expect(build(url, { query: { test: 'newval' } })).toBe('/home?test=newval');
});

test('query can replace query param with multilpes', () => {
  const url = new URL("http://www.example.com/home?test=removeme");
  expect(build(url, { query: { test: ['one', 'two'] } })).toBe('/home?test=one&test=two');
});

test('query can remove hash', () => {
  expect(build('/test#anchor', { hash: false })).toBe('/test');
});

test('query can replace hash', () => {
  expect(build('/test#anchor', { hash: 'test' })).toBe('/test#test');
});
