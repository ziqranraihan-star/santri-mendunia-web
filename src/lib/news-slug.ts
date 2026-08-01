type NewsRouteItem = { id: string; slug?: string | null };

const MAX_SLUG_LENGTH = 96;

export function createNewsSlug(title: string, suffix?: string): string {
  const base = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/<[^>]*>/g, " ").replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "").slice(0, 78).replace(/-+$/g, "") || "berita";
  const unique = (suffix || Math.random().toString(36).slice(2, 8))
    .toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8);
  return `${base}-${unique || "artikel"}`;
}

export function isSafeNewsSlug(slug?: string | null): slug is string {
  return Boolean(slug && slug.length <= MAX_SLUG_LENGTH && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug));
}

export function getNewsHref(item: NewsRouteItem): string {
  return `/berita/${isSafeNewsSlug(item.slug) ? item.slug : item.id}`;
}
