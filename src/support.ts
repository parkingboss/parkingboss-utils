function checkBlobConstructor() {
  try {
    return Boolean(new Blob());
  } catch (error) {
    return false;
  }
}

function checkArrayBufferView() {
  try {
    return new Blob([new Uint8Array(100)]).size === 100;
  } catch (error) {
    return false;
  }
}

export const hasBlobConstructor = (typeof (Blob) !== 'undefined' && checkBlobConstructor());

export const hasArrayBufferViewSupport = (hasBlobConstructor && typeof (Uint8Array) !== 'undefined' && checkArrayBufferView());

export const hasToBlobSupport = (typeof HTMLCanvasElement !== 'undefined' && Boolean(HTMLCanvasElement.prototype.toBlob));

export const hasBlobSupport = (hasToBlobSupport || (typeof Uint8Array !== 'undefined' && typeof ArrayBuffer !== 'undefined' && typeof atob !== 'undefined'));

export const hasReaderSupport = (typeof FileReader !== 'undefined' || typeof URL !== 'undefined');

export const hasCanvasSupport = (typeof HTMLCanvasElement !== 'undefined');
