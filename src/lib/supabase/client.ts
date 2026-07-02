import { createClient } from "@supabase/supabase-js";
import { objectToCamel, objectToSnake, toSnakeCase } from "@/lib/casing";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase public configuration. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
}

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
  samawaProfiles: "samawa_profiles",
  taarufRequests: "taaruf_requests",
  taarufMessages: "taaruf_messages",
  pesantren: "pesantren",
} as const;

export { objectToCamel, objectToSnake, toCamelCase, toSnakeCase } from "@/lib/casing";

type QueryConstraint =
  | { type: "orderBy"; field: string; direction: "asc" | "desc" }
  | { type: "where"; field: string; op: string; value: unknown };

export async function getDocuments<T = any>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  limitCount?: number
): Promise<T[]> {
  let query: any = supabase.from(collectionName).select("*");

  for (const c of constraints) {
    if (c.type === "orderBy") {
      query = query.order(toSnakeCase(c.field), { ascending: c.direction === "asc" });
      continue;
    }

    const field = toSnakeCase(c.field);
    switch (c.op) {
      case "neq":
      case "!=":
        query = query.neq(field, c.value);
        break;
      case "gt":
        query = query.gt(field, c.value);
        break;
      case "gte":
        query = query.gte(field, c.value);
        break;
      case "lt":
        query = query.lt(field, c.value);
        break;
      case "lte":
        query = query.lte(field, c.value);
        break;
      case "in":
        query = query.in(field, c.value as any[]);
        break;
      case "contains":
        query = query.contains(field, c.value as any);
        break;
      case "eq":
      default:
        query = query.eq(field, c.value);
        break;
    }
  }

  if (limitCount) query = query.limit(limitCount);

  const { data, error } = await query;
  if (error) throw error;
  return objectToCamel(data) as T[];
}

export async function getDocument<T = any>(
  collectionName: string,
  id: string
): Promise<T | null> {
  const { data, error } = await supabase.from(collectionName).select("*").eq("id", id).single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return objectToCamel(data) as T;
}

export async function createDocument(collectionName: string, data: unknown): Promise<string> {
  const snakeData = objectToSnake(data) as Record<string, unknown>;
  const { data: result, error } = await supabase
    .from(collectionName)
    .insert(snakeData)
    .select()
    .single();
  if (error) throw error;
  return result.id;
}

export async function updateDocument(
  collectionName: string,
  id: string,
  data: unknown
): Promise<void> {
  const snakeData = objectToSnake(data) as Record<string, unknown>;
  const { error } = await supabase.from(collectionName).update(snakeData).eq("id", id);
  if (error) throw error;
}

export async function deleteDocument(collectionName: string, id: string): Promise<void> {
  const { error } = await supabase.from(collectionName).delete().eq("id", id);
  if (error) throw error;
}

export async function countDocuments(collectionName: string): Promise<number> {
  const { count, error } = await supabase
    .from(collectionName)
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count || 0;
}

export const orderBy = (field: string, direction: "asc" | "desc" = "asc") =>
  ({ type: "orderBy", field, direction }) as const;

export const where = (field: string, op: string, value: unknown) =>
  ({ type: "where", field, op, value }) as const;
