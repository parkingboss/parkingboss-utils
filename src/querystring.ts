export type ParsedUrl = Record<string, string | string[]>;

export function toSearchParams(urlStr: string): URLSearchParams {
  try {
    return new URL(urlStr).searchParams;
  } catch (err) {
    if (!urlStr.startsWith("?")) {
      urlStr = '?' + urlStr;
    }
    return new URL("http://localhost:1000" + urlStr).searchParams;
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
  const url = new URL("http://localhost:1000");
  Object.entries(obj).forEach(([key, val]) => {
    if (typeof val === 'string') {
      url.searchParams.set(key, val);
    } else {
      val.forEach(v => url.searchParams.append(key, v));
    }
  });
  return url.searchParams.toString();
}
