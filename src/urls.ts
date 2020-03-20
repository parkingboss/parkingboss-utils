function urlToPath(url: URL, includeHash = true) {
  return url.href;
  const { pathname, search, hash } = url;
  return pathname + search + (includeHash && url.hash ? hash : '');
}

export interface UrlOpts {
  query?: Record<string, null | string | string[]>;
  hash?: string;
  absolute?: true;
  login?: true;
  base?: string;
}

export type UrlLike = string | URL | Location;

function isUrlLike(x: any): x is UrlLike {
  return (typeof x == 'string') || (x instanceof URL) || (x instanceof Location);
}

export function build(url: UrlLike): string;
export function build(opts: UrlOpts): string;
export function build(url: UrlLike, opts: UrlOpts): string;
export function build(urlOrOpt: UrlLike | UrlOpts, maybeOpt?: UrlOpts): string {
  const urlArg: UrlLike = isUrlLike(urlOrOpt) ? urlOrOpt : self.location;
  const opts: UrlOpts = maybeOpt || (isUrlLike(urlOrOpt) ? {} : urlOrOpt);

  const base = opts.absolute ? undefined : opts.base || document.baseURI;
  const url = urlArg instanceof URL
    ? urlArg
    : new URL(urlArg.toString(), base);

  Object.entries(opts.query || {})
    .forEach(([key, val]) => {
      if (val) {
        (Array.isArray(val) ? val : [ val ]).forEach((v, ix) => {
          if (ix == 0) {
            url.searchParams.set(key, v);
          } else {
            url.searchParams.append(key, v);
          }
        });
      } else {
        url.searchParams.delete(key);
      }
    });

  if (opts.hash) {
    url.hash = opts.hash;
  }

  const requestedPath = urlToPath(url);

  return opts.login
    ? `https://my.parkingboss.com/user/navigate?url=${requestedPath}`
    : requestedPath;
}
