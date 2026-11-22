export function normalizeLinkUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return '';
  }

  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed) || /^[#/]/.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}
