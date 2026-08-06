export const PRODUCT_CATEGORIES = [
  ["makanan", "Makanan & Minuman"],
  ["kerajinan", "Kerajinan"],
  ["fashion", "Fashion"],
  ["herbal", "Herbal"],
  ["lainnya", "Lainnya"],
] as const;

export const LEGALITY_OPTIONS = [
  ["halal", "Sertifikasi Halal"],
  ["pirt", "P-IRT"],
  ["bpom", "BPOM MD"],
  ["other", "Lainnya"],
] as const;

export interface ProductVariant {
  name: string;
  price: number;
  stock: number;
}

export interface ProductRecord {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl?: string;
  imageUrls?: string[];
  price: number;
  originalPrice?: number | null;
  basePrice?: number;
  platformMargin?: number;
  stock: number;
  weight?: number | null;
  lengthCm?: number | null;
  widthCm?: number | null;
  heightCm?: number | null;
  pesantrenName: string;
  purchaseUrl?: string;
  legalities?: string[];
  legalityNumber?: string;
  isSantriMade?: boolean;
  variants?: ProductVariant[];
  soldCount?: number;
  rating?: number;
  isActive?: boolean;
}

export function productImages(product: Pick<ProductRecord, "imageUrl" | "imageUrls">) {
  const images = (product.imageUrls || []).filter(Boolean);
  if (images.length) return images.slice(0, 5);
  return product.imageUrl ? [product.imageUrl] : [];
}

export function formatRupiah(value?: number | null) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

export function productWhatsAppUrl(product: ProductRecord, variant?: ProductVariant) {
  if (!product.purchaseUrl) return "";
  const selected = variant ? ` varian ${variant.name}` : "";
  const message = `Assalamu'alaikum, saya ingin memesan ${product.name}${selected}. Mohon informasi ketersediaan dan cara pemesanannya.`;
  try {
    const url = new URL(product.purchaseUrl);
    if (url.hostname === "wa.me" || url.hostname.endsWith("whatsapp.com")) {
      url.searchParams.set("text", message);
      return url.toString();
    }
  } catch {
    return "";
  }
  return product.purchaseUrl;
}
