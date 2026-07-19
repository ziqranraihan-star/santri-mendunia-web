export function normalizeExternalUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const url = new URL(candidate);
    if (!(["http:", "https:"] as string[]).includes(url.protocol) || !url.hostname) {
      return "";
    }
    return url.toString();
  } catch {
    return "";
  }
}

export function isValidExternalUrl(value: string): boolean {
  return value.trim() === "" || normalizeExternalUrl(value) !== "";
}
