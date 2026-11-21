export function sanitizeCallbackUrl(
  rawUrl?: string | null,
  allowedOrigin?: string,
  fallback: string = '/',
): string {
  if (!rawUrl) {
    return fallback;
  }

  const trimmed = rawUrl.trim();

  if (!trimmed) {
    return fallback;
  }

  if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.startsWith('/\\')) {
    try {
      const parsed = new URL(trimmed, 'http://localhost');
      if (parsed.origin === 'http://localhost') {
        return `${parsed.pathname}${parsed.search}${parsed.hash}`;
      }
    } catch {
      return fallback;
    }
  }

  if (allowedOrigin) {
    try {
      const trusted = new URL(allowedOrigin);
      const parsed = new URL(trimmed);

      if (
        (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
        parsed.origin === trusted.origin
      ) {
        return `${parsed.pathname}${parsed.search}${parsed.hash}`;
      }
    } catch {
      return fallback;
    }
  }

  return fallback;
}
