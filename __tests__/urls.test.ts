/**
 * @jest-environment jsdom
 */

import { build, buildLoginUrl } from "../src/urls";

test("url parsed", () => {
  expect(build("http://www.example.com/test/path?arg1=true&arg2=false#anchor")).toBe(
    "/test/path?arg1=true&arg2=false#anchor"
  );
});

test("url accepted", () => {
  const url = new URL("http://www.example.com/test/path?arg1=true&arg2=false#anchor");
  expect(build(url)).toBe("/test/path?arg1=true&arg2=false#anchor");
});

test("just query accepted", () => {
  expect(build({ query: { test1: "true", test2: "false" } })).toBe("/?test1=true&test2=false");
});

test("just hash accepted", () => {
  expect(build({ hash: "test" })).toBe("/#test");
});

test("absolute works", () => {
  expect(build({ absolute: true })).toBe("http://localhost/");
});

test("login works", () => {
  expect(buildLoginUrl({ clientId: "hello", email: "chris@parkingboss.com", redirectUrl: "www.example.com" })).toBe(
    `https://auth.communityboss.app/login?client_id=hello&login_hint=${encodeURIComponent(
      "chris@parkingboss.com"
    )}&redirect_uri=${encodeURIComponent("www.example.com")}`
  );
});

test("query can remove query param", () => {
  const url = new URL("http://www.example.com/home?test=removeme");
  expect(build(url, { query: { test: null } })).toBe("/home");
});

test("query can replace query param", () => {
  const url = new URL("http://www.example.com/home?test=removeme");
  expect(build(url, { query: { test: "newval" } })).toBe("/home?test=newval");
});

test("query can replace query param with multilpes", () => {
  const url = new URL("http://www.example.com/home?test=removeme");
  expect(build(url, { query: { test: ["one", "two"] } })).toBe("/home?test=one&test=two");
});

test("query can remove hash", () => {
  expect(build("/test#anchor", { hash: false })).toBe("/test");
});

test("query can replace hash", () => {
  expect(build("/test#anchor", { hash: "test" })).toBe("/test#test");
});
