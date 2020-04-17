export function tryDate(d: any): null | Date {
  d = new Date(d);
  return isNaN(d) ? null : d;
}

export function tryInterval(d: any): null | [ Date, null|Date ] {
  if (!d) return null;

  if (Array.isArray(d)) {
    const start = tryDate(d[0]);
    if (start) {
      return [ start, tryDate(d[1]) ];
    }
  }

  if ('start' in d) {
    const start = tryDate(d.start);
    if (start) {
      return [ start, tryDate(d.end) ];
    }
  }

  if (typeof d === 'string') {
    const [ startStr, end ] = d.split('/');
    const start = tryDate(startStr);
    if (start) {
      return [ start, tryDate(end) ];
    }
  }

  return null;
}
