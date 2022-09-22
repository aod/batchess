export function nxtChr(chr: string, n = 1): string {
  return String.fromCharCode(chr.charCodeAt(0) + n);
}
