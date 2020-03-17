import { makeToHex, crockford32ToHex, HexVariants } from '../src/base32';

test('makeToHex returns function', () => {
  ['Crockford', 'RFC3548', 'RFC4648', 'RFC4648-HEX'].forEach(val => {
    expect(makeToHex(val as HexVariants)).toBeInstanceOf(Function);
  });
});

test('makeToHex function decodes', () => {
  expect(crockford32ToHex('nkzm53jy9s5h34t4eay3twp4gm')).toBe("acff428e5e4e4b11934472bc3d72c485");
});

test('bad hex variant throws error', () => {
  const makeBadHexVariant = () => makeToHex('test' as HexVariants);
  expect(makeBadHexVariant).toThrow();
});
