import { build } from './urls';

const parkingBossUploadRex = /upload\.parkingboss\.com(\/files)?/i;
const imgxRoot = 'parking-uploads.imgix.net';
const hrefSearch = { auto: "compress,enhance" };
const srcSearch = Object.assign({}, hrefSearch, { w: 60, h: 60, fit: 'crop', crop: 'entropy' })

export function imgx(url: string, opts: {}) {
  return build(url.replace(parkingBossUploadRex, imgxRoot), opts);
}

export function compressed(url: string) {
  return imgx(url, hrefSearch);
}

export function thumbnail(url: string) {
  return imgx(url, srcSearch);
}
