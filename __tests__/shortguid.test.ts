import * as uuid from '../src/uuid';

const base64 = 'phKzGyZcq0WTy-KElkMWDw';
const base32 = '3esh59jw4s2tq4ybwa29cgrp1w';
const base32Upper = '3ESH59JW4S2TQ4YBWA29CGRP1W';
const uuidStr = '1bb312a65c2645ab93cbe2849643160f';
const uuidDashes = '1bb312a6-5c26-45ab-93cb-e2849643160f';
const uuidUpper = '1BB312A65C2645AB93CBE2849643160F';
const uuidUpperDashes = '1BB312A6-5C26-45AB-93CB-E2849643160F';

describe('uuid', () => {
  test('returns null for base 64', () => {
    expect(uuid.uuid(base64)).toBeNull();
  });

  test('returns null for base 32', () => {
    expect(uuid.uuid(base32)).toBeNull();
  });

  test('returns null for base 32 upper', () => {
    expect(uuid.uuid(base32Upper)).toBeNull();
  });

  test('returns uuid for uuid', () => {
    expect(uuid.uuid(uuidStr)).toBe(uuidStr);
  });

  test('returns uuid for uuid with dashes', () => {
    expect(uuid.uuid(uuidDashes)).toBe(uuidStr);
  });

  test('returns uuid for upper case uuid', () => {
    expect(uuid.uuid(uuidUpper)).toBe(uuidStr);
  });

  test('returns uuid for upper case uuid with dashes', () => {
    expect(uuid.uuid(uuidUpperDashes)).toBe(uuidStr);
  });
});

describe('uuid32', () => {
  test('returns null for base 64', () => {
    expect(uuid.uuid32(base64)).toBeNull();
  });

  test('returns base32 for base 32', () => {
    expect(uuid.uuid32(base32)).toBe(base32);
  });

  test('returns base32 for base 32 upper', () => {
    expect(uuid.uuid32(base32Upper)).toBe(base32);
  });

  test('returns null for uuid', () => {
    expect(uuid.uuid32(uuidStr)).toBeNull();
  });

  test('returns null for uuid with dashes', () => {
    expect(uuid.uuid32(uuidDashes)).toBeNull();
  });

  test('returns null for upper case uuid', () => {
    expect(uuid.uuid32(uuidUpper)).toBeNull();
  });

  test('returns null for upper case uuid with dashes', () => {
    expect(uuid.uuid32(uuidUpperDashes)).toBeNull();
  });
});

describe('uuid64', () => {
  test('returns base64 for base 64', () => {
    expect(uuid.uuid64(base64)).toBe(base64);
  });

  test('returns null for base 32', () => {
    expect(uuid.uuid64(base32)).toBeNull();
  });

  test('returns null for base 32 upper', () => {
    expect(uuid.uuid64(base32Upper)).toBeNull();
  });

  test('returns null for uuid', () => {
    expect(uuid.uuid64(uuidStr)).toBeNull();
  });

  test('returns null for uuid with dashes', () => {
    expect(uuid.uuid64(uuidDashes)).toBeNull();
  });

  test('returns null for upper case uuid', () => {
    expect(uuid.uuid64(uuidUpper)).toBeNull();
  });

  test('returns null for upper case uuid with dashes', () => {
    expect(uuid.uuid64(uuidUpperDashes)).toBeNull();
  });
});

describe('withDashes', () => {
  test('returns uuid with dashes for uuid', () => {
    expect(uuid.withDashes(uuidStr)).toBe(uuidDashes);
  });
});


describe('parseUuid64', () => {
  test('returns uuid for uuid64', () => {
    expect(uuid.parseUuid64(base64)).toBe(uuidStr);
  });
});

describe('toUuid64', () => {
  test('returns uuid64 for uuid', () => {
    expect(uuid.toUuid64(uuid.uuid(uuidStr)!)).toBe(base64);
  });
});

describe('parseUuid32', () => {
  test('returns uuid for uuid32', () => {
    expect(uuid.parseUuid32(base32)).toBe(uuidStr);
  });

  test('returns uuid for upper base 32', () => {
    expect(uuid.parseUuid32(base32Upper)).toBe(uuidStr);
  });
});

describe('toUuid32', () => {
  test('returns base 32 for uuid', () => {
    expect(uuid.toUuid32(uuid.uuid(uuidStr)!)).toBe(base32);
  });
});

describe('parse', () => {
  test('parses base64', () => {
    expect(uuid.parse(base64)).toBe(uuidStr);
  });
  test('parses base32', () => {
    expect(uuid.parse(base32)).toBe(uuidStr);
  });
  test('parses base32Upper', () => {
    expect(uuid.parse(base32Upper)).toBe(uuidStr);
  });
  test('parses uuidStr', () => {
    expect(uuid.parse(uuidStr)).toBe(uuidStr);
  });
  test('parses uuidDashes', () => {
    expect(uuid.parse(uuidDashes)).toBe(uuidStr);
  });
  test('parses uuidUpper', () => {
    expect(uuid.parse(uuidUpper)).toBe(uuidStr);
  });
  test('parses uuidUpperDashes', () => {
    expect(uuid.parse(uuidUpperDashes)).toBe(uuidStr);
  });
});
