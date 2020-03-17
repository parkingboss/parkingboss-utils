import { hasCanvasSupport, hasBlobSupport, hasReaderSupport, hasToBlobSupport, hasBlobConstructor, hasArrayBufferViewSupport } from './support';

// -2: Not a JPEG, -1: Not defined, 1-8 standard EXIF Orientations
type ExifOrientation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type ExtendedExif = -2 | -1 | ExifOrientation;

function filterExtended(ext: ExtendedExif): ExifOrientation {
  if (ext <= 0) {
    console.warn(`Exif Value of ${ext} indicates an error state.`);
    return 1;
  }

  return ext as ExifOrientation;
}

function getOrientation(file: File, callback: (orientation: ExtendedExif) => void) {
  var reader = new FileReader();

  reader.onload = (event: ProgressEvent) => {

    if (!event.target) {
      return callback(-1);
    }

    const file = event.target as FileReader;
    const view = new DataView(file.result as ArrayBuffer);

    if (view.getUint16(0, false) != 0xFFD8) {
      return callback(-2);
    }

    const length = view.byteLength
    let offset = 2;

    while (offset < length) {
      if (view.getUint16(offset + 2, false) <= 8) return callback(-1);
      let marker = view.getUint16(offset, false);
      offset += 2;

      if (marker == 0xFFE1) {
        if (view.getUint32(offset += 2, false) != 0x45786966) {
          return callback(-1);
        }

        let little = view.getUint16(offset += 6, false) == 0x4949;
        offset += view.getUint32(offset + 4, little);
        let tags = view.getUint16(offset, little);
        offset += 2;
        for (let i = 0; i < tags; i++) {
          if (view.getUint16(offset + (i * 12), little) == 0x0112) {
            return callback(view.getUint16(offset + (i * 12) + 8, little) as ExtendedExif);
          }
        }
      } else if ((marker & 0xFF00) != 0xFF00) {
        break;
      }
      else {
        offset += view.getUint16(offset, false);
      }
    }
    return callback(-1);
  };

  reader.readAsArrayBuffer(file);
}

function orientation(file: File): Promise<ExtendedExif> {
  return new Promise(resolve => getOrientation(file, resolve));
}

export const browserSupport = hasCanvasSupport && hasBlobSupport && hasReaderSupport;

export interface Dimensions {
  width: number;
  height: number;
}

export function resize(file: File, maxDimensions: Dimensions, type?: string, detail?: number): Promise<File> {
  return new Promise((resolve, reject) => {
    if (!browserSupport || !file.type.match(/image.*/)) return resolve(file); // early exit - not supported

    if (file.type.match(/image\/gif/)) return resolve(file); // early exit - could be an animated gif

    const image = document.createElement('img');

    const o = orientation(file);

    image.onload = async () => {
      let width = image.width;
      let height = image.height;

      if (width >= height && width > maxDimensions.width) {
        height *= maxDimensions.width / width;
        width = maxDimensions.width;
      } else if (height > maxDimensions.height) {
        width *= maxDimensions.height / height;
        height = maxDimensions.height;
      } else return resolve(file); // early exit; no need to resize

      const exifOrientation = await o;
      const imageCanvas = drawImageToCanvas(image, filterExtended(exifOrientation), 0, 0, width, height, 'contain');
      if (hasToBlobSupport) imageCanvas.toBlob(blob => blob ? resolve(blob as File) : reject(), type || file.type, detail);
      else resolve(toBlob(imageCanvas, file.type) as File);
    };

    loadImage(image, file);

    return true;
  });
}

export function crop(file: File, dimensions: Dimensions, type?: string, detail?: number): Promise<File> {
  return new Promise((resolve, reject) => {
    if (!browserSupport || !file.type.match(/image.*/)) return resolve(file); // early exit - not supported

    if (file.type.match(/image\/gif/)) return resolve(file); // early exit - could be an animated gif

    const image = document.createElement('img');

    const o = orientation(file);

    image.onload = async () => {

      if (dimensions.width > image.width && dimensions.height > image.height) return resolve(file); // early exit - no need to resize

      const width = Math.min(dimensions.width, image.width);
      const height = Math.min(dimensions.height, image.height);

      if (image.width > dimensions.width * 2 || image.height > dimensions.height * 2) {
        return resize(file, { width: dimensions.width * 2, height: dimensions.height * 2 })
          .then((zoomedOutImage) => {
            crop(zoomedOutImage, { width, height }).then(resolve);
          });
      }

      const exifOrientation = await o;
      const imageCanvas = drawImageToCanvas(image, filterExtended(exifOrientation), 0, 0, width, height, 'crop');
      if (hasToBlobSupport) imageCanvas.toBlob(blob => blob ? resolve(blob as File) : reject(), type || file.type, detail);
      else resolve(toBlob(imageCanvas, file.type) as File);
    };

    loadImage(image, file);

    return true;
  });
}

function drawImageToCanvas(img: CanvasImageSource, orientation: ExifOrientation = 1, x: number = 0, y: number = 0, width?: number, height?: number, method?: string) {
  width = width || img.width as number;
  height = height || img.height as number;
  method = method || 'contain';

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return canvas;

  canvas.width = width;
  canvas.height = height;

  ctx.save();
  switch (Number(orientation)) {
    // explained here: https://i.stack.imgur.com/6cJTP.gif
    case 1:
      break;

    case 2:
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      break;

    case 3:
      ctx.translate(width, height);
      ctx.rotate((180 / 180) * Math.PI); // 180/180 is 1? No shit, but how else will you know its need 180 rotation?
      break;

    case 4:
      ctx.translate(0, height);
      ctx.scale(1, -1);
      break;

    case 5:
      canvas.width = height;
      canvas.height = width;
      ctx.rotate((90 / 180) * Math.PI);
      ctx.scale(1, -1);
      break;

    case 6:
      canvas.width = height;
      canvas.height = width;
      ctx.rotate((90 / 180) * Math.PI);
      ctx.translate(0, -height);
      break;

    case 7:
      canvas.width = height;
      canvas.height = width;
      ctx.rotate((270 / 180) * Math.PI);
      ctx.translate(-width, height);
      ctx.scale(1, -1);
      break;

    case 8:
      canvas.width = height;
      canvas.height = width;
      ctx.translate(0, width);
      ctx.rotate((270 / 180) * Math.PI);
      break;

    default:
      break;
  }

  if (method === 'crop') {
    ctx.drawImage(img, (img.width as number / 2) - (width / 2), (img.height as number / 2) - (height / 2), width, height, 0, 0, width, height);
  }
  else {
    ctx.drawImage(img, x, y, width, height);
  }
  ctx.restore();

  return canvas;
}

function toBlob(canvas: HTMLCanvasElement, type: string) {
  const dataURI = canvas.toDataURL(type);
  const dataURIParts = dataURI.split(',');
  let byteString;
  if (dataURIParts[0].indexOf('base64') >= 0) {
    byteString = atob(dataURIParts[1]);
  } else {
    byteString = decodeURIComponent(dataURIParts[1]);
  }
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const intArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i += 1) {
    intArray[i] = byteString.charCodeAt(i);
  }

  const mimeString = dataURIParts[0].split(':')[1].split(';')[0];
  let blob = null;

  if (hasBlobConstructor) {
    blob = new Blob([hasArrayBufferViewSupport ? intArray : arrayBuffer], { type: mimeString });
  } else {
    throw new Error("Browser not supported!");
  }

  return blob;
}

function loadImage(image: HTMLImageElement, file: File) {
  if (typeof (URL) === 'undefined') {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        image.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  } else {
    image.src = URL.createObjectURL(file);
  }
}
