const imageTypes = new Set(['video', 'image']);

export function isImage(file: null | { format: string }) {
  return file
    && typeof file.format === 'string'
    && formatIsImage(file.format);
}

function formatIsImage(format: string) {
  const mimetype = format.split("/").shift();
  const type = mimetype && mimetype.toLowerCase();

  return imageTypes.has(type as string);
}
