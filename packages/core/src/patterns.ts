export function buildRegex(pattern: string): RegExp {
  if (pattern.startsWith('(?i)')) {
    return new RegExp(pattern.slice(4), 'i');
  }
  return new RegExp(pattern);
}
