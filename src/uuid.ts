import { toByteArray, fromByteArray} from 'base64-js';
import { parse as parseUuid, unparse as uuidToString } from 'uuid-parse';
import { crockford32ToHex } from './base32';

interface _4 { }
interface _32 { }
interface _64 { }

export type Uuid = string & _4;
export type Uuid32 = string & _32;
export type Uuid64 = string & _64;

const uuidRex = /^[0-9a-f]{32}$/i;
export function uuid(input: string): Uuid | null {
  const withoutDashes = input.replace(/-/g, '');
  return uuidRex.test(withoutDashes) ? withoutDashes.toLowerCase() : null;
}

const crockfordRex = /^[0-9abcdefghjkmnpqrstvwxyz]{26}$/i;
export function uuid32(input: string): Uuid32 | null {
  return crockfordRex.test(input) ? input.toLowerCase() : null;
}

const b64Rex = /^[0-9A-Za-z-_‐]{22}$/;
export function uuid64(input: string): Uuid64 | null {
  return b64Rex.test(input) ? input : null;
}

function toDotNetByteOrder(bytes: Uint8Array): Uint8Array {
  return new Uint8Array([bytes[3], bytes[2], bytes[1], bytes[0], bytes[5], bytes[4], bytes[7], bytes[6], bytes[8], bytes[9], bytes[10], bytes[11], bytes[12], bytes[13], bytes[14], bytes[15]]);
}

function fromDotNetByteOrder(bytes: Uint8Array): Uint8Array {
  return new Uint8Array([bytes[3], bytes[2], bytes[1], bytes[0], bytes[5], bytes[4], bytes[7], bytes[6], bytes[8], bytes[9], bytes[10], bytes[11], bytes[12], bytes[13], bytes[14], bytes[15]]);
}

export function parseUuid64(input: Uuid64): Uuid | null {
  const bytes = toByteArray(input.replace(/ /g, "").replace(/_/g, "/").replace(/‐/g, "-").replace(/-/g, "+") + "==");

  if (bytes.length != 16) return null;

  return uuid(uuidToString(fromDotNetByteOrder(bytes) as any));
}

export function toUuid64(input: Uuid): Uuid64 {
  const bytes: Uint8Array = parseUuid(input);

  return uuid64(fromByteArray(toDotNetByteOrder(bytes)).substr(0, 22).replace(/\//g, "_").replace(/\+/g, "-"))!;
}

export function parseUuid32(input: Uuid32): Uuid | null {
  return uuid(crockford32ToHex(input));
}

function hexToCrockford32(bytes: Uint8Array): string {
  const mask = 0b11111;
  const alphabet = '0123456789abcdefghjkmnpqrstvwxyz';
  const chars: string[] = [];
  for (let i = 0; i < 26; ++i) {
    const ix = Math.floor(i * 5 / 8);
    const offset = 16 - (i * 5 % 8) - 5;
    const currByte = (bytes[ix] << 8) + (bytes[ix + 1] || 0);
    const alphaIndex = (currByte & (mask << offset)) >> offset;
    chars.push(alphabet[alphaIndex]);
  }
  return chars.join('');
}

export function toUuid32(input: Uuid): Uuid32 {
  const bytes: Uint8Array = parseUuid(input);
  return uuid32(hexToCrockford32(bytes))!;
}

export function parse(input: string): Uuid | null {
  if (uuid64(input)) return parseUuid64(input);
  if (uuid32(input)) return parseUuid32(input);
  return uuid(input);
}

export function commonId(input: string): Uuid32 | null {
  const parsed = parse(input);
  return parsed && toUuid32(parsed);
}

export function withDashes(input: Uuid): Uuid {
  return input.replace(/([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12})/, '$1-$2-$3-$4-$5')
}
