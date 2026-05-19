import { createClient } from "@supabase/supabase-js";

// Ganti URL dan Key ini dengan yang asli dari dashboard Supabase Anda.
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

export async function getDocuments<T = any>(
  collectionName: string,
  constraints: any[] = [],
  limitCount?: number
): Promise<any[]> {
  let query: any = supabase.from(collectionName).select("*");
  
  for (const c of constraints) {
    if (c.type === "orderBy") query = query.order(c.field, { ascending: c.direction === "asc" });
    if (c.type === "where") query = query.eq(c.field, c.value);
  }
  
  if (limitCount) query = query.limit(limitCount);

  const { data, error } = await query;
  if (error) throw error;
  return data as any[];
}

export async function getDocument<T = any>(collectionName: string, id: string): Promise<any | null> {
  const { data, error } = await supabase.from(collectionName).select("*").eq("id", id).single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

export async function createDocument(collectionName: string, data: any): Promise<string> {
  const { data: result, error } = await supabase.from(collectionName).insert(data).select().single();
  if (error) throw error;
  return result.id;
}

export async function updateDocument(collectionName: string, id: string, data: any): Promise<void> {
  const { error } = await supabase.from(collectionName).update(data).eq("id", id);
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

export const orderBy = (field: string, direction: "asc" | "desc" = "asc") => ({ type: "orderBy", field, direction });
export const where = (field: string, op: string, value: any) => ({ type: "where", field, value });
