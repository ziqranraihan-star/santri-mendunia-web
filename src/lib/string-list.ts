export function normalizeStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value !== "string") return [];

  const trimmed = value.trim();
  if (!trimmed) return [];

  try {
    const decoded = JSON.parse(trimmed);
    if (decoded !== value) return normalizeStringList(decoded);
  } catch {
    // Legacy rows may contain newline/comma-separated text instead of JSON.
  }

  const withoutPostgresBraces =
    trimmed.startsWith("{") && trimmed.endsWith("}")
      ? trimmed.slice(1, -1)
      : trimmed;

  return withoutPostgresBraces
    .split(/\r?\n|,/)
    .map((item) => item.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

export function stringListToText(value: unknown): string {
  return normalizeStringList(value).join("\n");
}
