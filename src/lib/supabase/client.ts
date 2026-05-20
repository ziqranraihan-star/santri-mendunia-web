import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qksagkeydvcewlujfyqs.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrc2Fna2V5ZHZjZXdsdWpmeXFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMzE3MjcsImV4cCI6MjA5NDcwNzcyN30.ETjdbiQFBSv3uiZvB5ymSQ_ltp9qpjBqoWOYnTsQySQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const COLLECTIONS = {
  users: "users",
  scholarships: "scholarships",
  courses: "courses",
  lessons: "lessons",
  news: "news",
  products: "products",
  jobs: "jobs",
  trips: "trips",
  tests: "tests",
  ebooks: "ebooks",
  mentors: "mentors",
  banners: "banners",
  notifications: "notifications",
  orders: "orders",
  donations: "donations",
} as const;

// ─── Konverter camelCase ↔ snake_case ────────────────────────────────────────
// Semua kolom di database Supabase menggunakan snake_case.
// Fungsi ini memastikan data yang dikirim dan diterima selalu konsisten.

/** Ubah satu kata camelCase → snake_case, contoh: "imageUrl" → "image_url" */
function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/** Rekursif: ubah semua key object dari camelCase ke snake_case */
function objectToSnake(obj: any): any {
  if (Array.isArray(obj)) return obj.map(objectToSnake);
  if (obj !== null && typeof obj === "object" && !(obj instanceof Date)) {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [toSnakeCase(k), objectToSnake(v)])
    );
  }
  return obj;
}

/** Ubah satu kata snake_case → camelCase, contoh: "image_url" → "imageUrl" */
function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/** Rekursif: ubah semua key object dari snake_case ke camelCase */
function objectToCamel(obj: any): any {
  if (Array.isArray(obj)) return obj.map(objectToCamel);
  if (obj !== null && typeof obj === "object" && !(obj instanceof Date)) {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [toCamelCase(k), objectToCamel(v)])
    );
  }
  return obj;
}
// ─────────────────────────────────────────────────────────────────────────────

export async function getDocuments<T = any>(
  collectionName: string,
  constraints: any[] = [],
  limitCount?: number
): Promise<any[]> {
  let query: any = supabase.from(collectionName).select("*");

  for (const c of constraints) {
    if (c.type === "orderBy") {
      // Auto-konversi field name ke snake_case saat query
      query = query.order(toSnakeCase(c.field), { ascending: c.direction === "asc" });
    }
    if (c.type === "where") {
      query = query.eq(toSnakeCase(c.field), c.value);
    }
  }

  if (limitCount) query = query.limit(limitCount);

  const { data, error } = await query;
  if (error) throw error;
  // Konversi hasil dari snake_case ke camelCase agar komponen UI tetap bisa pakai camelCase
  return objectToCamel(data) as any[];
}

export async function getDocument<T = any>(collectionName: string, id: string): Promise<any | null> {
  const { data, error } = await supabase.from(collectionName).select("*").eq("id", id).single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return objectToCamel(data);
}

export async function createDocument(collectionName: string, data: any): Promise<string> {
  // Konversi data dari camelCase ke snake_case sebelum dikirim ke Supabase
  const snakeData = objectToSnake(data);
  const { data: result, error } = await supabase.from(collectionName).insert(snakeData).select().single();
  if (error) throw error;
  return result.id;
}

export async function updateDocument(collectionName: string, id: string, data: any): Promise<void> {
  // Konversi data dari camelCase ke snake_case sebelum dikirim ke Supabase
  const snakeData = objectToSnake(data);
  const { error } = await supabase.from(collectionName).update(snakeData).eq("id", id);
  if (error) throw error;
}

export async function deleteDocument(collectionName: string, id: string): Promise<void> {
  const { error } = await supabase.from(collectionName).delete().eq("id", id);
  if (error) throw error;
}

export async function countDocuments(collectionName: string): Promise<number> {
  const { count, error } = await supabase.from(collectionName).select('*', { count: 'exact', head: true });
  if (error) throw error;
  return count || 0;
}

// Helper builders — field name di sini akan di-konversi otomatis di getDocuments()
export const orderBy = (field: string, direction: "asc" | "desc" = "asc") => ({ type: "orderBy", field, direction });
export const where = (field: string, op: string, value: any) => ({ type: "where", field, value });
