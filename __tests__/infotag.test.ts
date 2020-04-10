import { parse } from '../src/infotag';

const newStyleDecal = 'https://scanme.io/1/QSJBZJRREN2FXAV94HN5N2YX04/2312001/D';
const warningSticker = 'https://scanme.io?w=zTLLo8byeEOwdDi6cVgUTg';
const inactiveDecal = 'https://scanme.io?d=yeAI2vMQrECBwYfkfi1nXg';
const signAttendant = 'https://scanme.io?l=lvt1vBSAyUmxZTowNPJURQ&qr=sign';
const magnetAttendant = 'http://qr.parkiq.io/l/hmdqSVlQ0USCMBdbR1myBA?qr=magn';
const shortId = 'http://qr.parkiq.io/l/507northgate?qr=magn';
const relativeNewStyleDecal = '/1/QSJBZJRREN2FXAV94HN5N2YX04/2312001/D';
const relativeWarningSticker = '?w=zTLLo8byeEOwdDi6cVgUTg';

test('all samples parse', () => {
  [newStyleDecal, warningSticker, inactiveDecal, signAttendant, magnetAttendant].forEach(sample => {
    const tag = parse(sample);
    expect(tag).not.toBeNull();
  });
});

test('new decal works as expected', () => {
  const tag = parse(newStyleDecal);
  expect(tag).toStrictEqual({
    format: 'media',
    id: 'be64bfcb187544feab69246a5a8bdd01',
    ref: 'media',
    serial: '2312001',
    type: 'infotag',
    version: '1',
  });
});

test('warning sticker works as expected', () => {
  const tag = parse(warningSticker);
  expect(tag).toStrictEqual({
    format: 'warning',
    id: 'zTLLo8byeEOwdDi6cVgUTg',
    ref: 'violation',
  });
});

test('inactive decal works as expected', () => {
  const tag = parse(inactiveDecal);
  expect(tag).toStrictEqual({
    format: 'media',
    id: 'yeAI2vMQrECBwYfkfi1nXg',
    ref: 'media',
  });
});

test('attendant sign works as expected', () => {
  const tag = parse(signAttendant);
  expect(tag).toStrictEqual({
    format: 'sign',
    id: 'lvt1vBSAyUmxZTowNPJURQ',
    ref: 'location',
  });
});

test('attendant magnet works as expected', () => {
  const tag = parse(magnetAttendant);
  expect(tag).toStrictEqual({
    format: 'magn',
    id: 'hmdqSVlQ0USCMBdbR1myBA',
    ref: 'location',
  });
});


test('shortId works as expected', () => {
  const tag = parse(shortId);
  expect(tag).toStrictEqual({
    format: 'magn',
    id: '507northgate',
    ref: 'location',
  });
});

test('relative new decal works as expected', () => {
  const tag = parse(relativeNewStyleDecal);
  expect(tag).toStrictEqual({
    format: 'media',
    id: 'be64bfcb187544feab69246a5a8bdd01',
    ref: 'media',
    serial: '2312001',
    type: 'infotag',
    version: '1',
  });
});

test('relative warning sticker works as expected', () => {
  const tag = parse(relativeWarningSticker);
  expect(tag).toStrictEqual({
    format: 'warning',
    id: 'zTLLo8byeEOwdDi6cVgUTg',
    ref: 'violation',
  });
});
