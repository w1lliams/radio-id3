export function normalizeStreamUrl(url: string): string {
  return url.replace(/[;/]+$/g, '');
}
