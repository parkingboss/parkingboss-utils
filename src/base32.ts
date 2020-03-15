export type HexVariants = 'RFC3548' | 'RFC4648' | 'RFC4648-HEX' | 'Crockford';

const RFC4648 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const RFC4648_HEX = '0123456789ABCDEFGHIJKLMNOPQRSTUV';
const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

const toAlphabet: { [key in HexVariants]: string } = {
  RFC3548: RFC4648,
  RFC4648: RFC4648,
  'RFC4648-HEX': RFC4648_HEX,
  Crockford: CROCKFORD,
};

export function toHex(variant: HexVariants = "Crockford") {
  const alphabet: string | undefined = toAlphabet[variant];
  if (!alphabet) {
    throw new Error('Unknown base32 variant: ' + variant);
  }

  function readChar(alphabet: string, char: string): number {
    const idx = alphabet.indexOf(char);
    if (idx === -1) {
      throw new Error('Invalid character found: ' + char);
    }
    return idx;
  }

  function toHexString(byteArray: Uint8Array): string {
    return Array.from(byteArray, byte => ('0' + (byte & 0xFF).toString(16)).slice(-2))
      .join('');
  }

  return function base32Decode(input: string) {
    switch (variant) {
      case 'RFC4648-HEX':
        input = input.replace(/=+$/, '');
        break;
      case 'Crockford':
        input = input.toUpperCase().replace(/O/g, '0').replace(/[IL]/g, '1');
        break;
      default:
        input = input.replace(/=+$/, '');
    }

    const length = input.length;

    let bits = 0;
    let value = 0;

    let index = 0;
    const output = new Uint8Array((length * 5 / 8) | 0);

    for (let i = 0; i < length; i++) {
      value = (value << 5) | readChar(alphabet, input[i]);
      bits += 5;
      if (bits >= 8) {
        output[index++] = (value >>> (bits - 8)) & 255;
        bits -= 8;
      }
    }

    return toHexString(output);
  }
}

export const crockford32ToHex = toHex('Crockford');
