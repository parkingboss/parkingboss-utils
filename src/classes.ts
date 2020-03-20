export type DomClass = null | false | undefined | string;

export function classes(...list: Array<DomClass|DomClass[]>) {
  return list.flat().filter(x => x).join(' ');
}
