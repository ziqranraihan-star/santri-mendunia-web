export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function objectToSnake(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(objectToSnake);
  if (obj !== null && typeof obj === "object" && !(obj instanceof Date)) {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [toSnakeCase(k), objectToSnake(v)])
    );
  }
  return obj;
}

export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function objectToCamel(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(objectToCamel);
  if (obj !== null && typeof obj === "object" && !(obj instanceof Date)) {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [toCamelCase(k), objectToCamel(v)])
    );
  }
  return obj;
}
