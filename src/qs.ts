import { ensureArray } from './arrays';

export type ParsedUrl = Record<string, null | string | string[]>;

export function toSearchParams(urlStr: string): URLSearchParams {
  try {
    return new URL(urlStr).searchParams;
  } catch (err) {
    return new URLSearchParams(urlStr);
  }
}

export function parse(url: URLSearchParams | URL | string): ParsedUrl {
  const entries = url instanceof URL ? url.searchParams.entries()
    : url instanceof URLSearchParams ? url.entries()
    : toSearchParams(url).entries();

  const result: ParsedUrl = {};

  return [...entries].reduce((res, [key, val]) => {
    if (!res[key]) {
      res[key] = val;
    } else if (typeof res[key] == 'string') {
      res[key] = [res[key] as string, val];
    } else {
      (res[key] as string[]).push(val);
    }
    return res;
  }, result);
}

export function stringify(obj: ParsedUrl): string {
  const searchParams = new URLSearchParams("?");
  Object.entries(obj).forEach(([key, val]) => {
    if (typeof val === 'string') {
      searchParams.set(key, val);
    } else if (val != null) {
      if (typeof val.forEach === 'function') {
        val.forEach(v => searchParams.append(key, v));
      } else {
        searchParams.set(key, val.toString());
      }
    }
  });
  return searchParams.toString();
}