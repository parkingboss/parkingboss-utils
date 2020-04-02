import { crockford32ToHex } from './base32';

import { ParsedUrl, parse as parseQs } from './qs';

export interface Infotag {
  type?: 'infotag';
  ref: string;
  format: string;
  serial?: string;
  version?: string;
  id?: string;
}

// convert crockford32 ids to guid hex
function normalizeID(id: string) {
  if (!id || id.length !== 26 || !/^[0-9A-TV-Za-tv-z]{26}$/.test(id)) {
    return id;
  }

  return crockford32ToHex(id);
}

function pathString(path: string) {
  if (!path || typeof path !== "string") return "";
  return path.replace(/^\//, '');
}

const formats: Record<string, string> = {
  "w": "warning",
  "warn": "warning",
  "warning":"warning",
  "d": "media",
  "media":"media",
  "noti": "notice",
  "magn": "magnet",
  "not": "notice",
  "mag": "magnet",
  "sig": "sign",
  "p": "pass",
  "m": "map",
  "vehicle": "vehicle"
};

const refs: Record<string, string> = {

  "d": "media",
  "media":"media",
  "warning": "violation",
  "v": "violation",
  "w": "violation",
  "warn": "violation",
  "vehicle":"vehicle",

  "sign": "location",
  "sig": "location",
  "l": "location",

  "map": "address",
  "m": "address",

  "notice": "location",
  "noti": "location",
  "not": "location",

  "magnet": "location",
  "magn": "location",
  "mag": "location",

  "pass": "permit",
  "p": "permit"
};

// /l/{id} etc
// ?l= etc
function extractV0(uri: string, querystring: URLSearchParams): Infotag | null {
  // fail as fast as possible on this
  uri = pathString(uri);

  if (!uri && !querystring) return null;

  const query: ParsedUrl = parseQs(querystring) || {};

  // handle query version first
  if (!!query.l) {
    return {
      ref: "location",
      format: formats[query.qr as string] || query.qr as string,
      id: query.l as string,
    };
  }

  if (!!query.d) return {
    ref: "media",
    format: "media",
    id: query.d as string
  };
  if (!!query.media) return {
    ref: "media",
    format: "media",
    id: query.media as string
  };
  if (!!query.vehicle) return {
    ref: "vehicle",
    format: "vehicle",
    id: (query.vehicle as string).length > 10 ? query.vehicle as string : undefined,
    serial: (query.vehicle as string).length > 10 ? undefined : query.vehicle as string,
  };
  if (!!query.p) return {
    ref: "permit",
    format: "pass",
    id: query.permit as string
  };
  if (!!query.permit) return {
    ref: "permit",
    format: "pass",
    id: query.permit as string
  };
  if (!!query.m) return {
    ref: "address",
    format: "map",
    id: query.m as string
  };

  if (!!query.w) return {
    ref: "violation",
    format: "warning",
    id: query.w as string
  };
  if (!!query.warning) return {
    ref: "violation",
    format: "warning",
    id: query.warning as string
  };

  var path = uri.split('/');
  if (path.length < 2) return null; // not enough data in path

  var id = path[1];

  switch (path[0]) {
    case "l":
      return {
        ref: "location",
        format: query.qr as string,
        id: id
      };
    case "media":
    case "d":
      return {
        ref: "media",
        format: "media",
        id: id
      };
    case "violation":
    case "w":
      return {
        ref: "violation",
        format: "warning",
        id: id
      };
    case "p":
      return {
        ref: "permit",
        format: "pass",
        id: id
      };
  }

  return null;
}

// /{version}/{uuid}/{serial}/{format} etc
// v1 must support going to lower case (no case sensitivity)
function extractV1(path: string): Infotag | null {

  path = pathString(path);

  if (!path || typeof path !== "string") return null;

  var parts = path.toLowerCase().split('/');
  if (parts.length < 4) return null;

  if (parts.length >= 4) {
    return {
      type: "infotag",
      ref: refs[parts[3]] || parts[3],
      format: formats[parts[3]] || parts[3],
      serial: parts[2],
      version: parts[0],
      id: normalizeID(parts[1])
    };
  }

  return null;
}

function extract(path: string, query: URLSearchParams) {
  return extractV1(path) || extractV0(path, query);
}

export function parse(url: string | URL) {
  if (typeof url === "string") {
    url = new URL(url);
  }

  return extract(url.pathname, url.searchParams);
}

