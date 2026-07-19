import assert from "node:assert/strict";
import test from "node:test";
import { getMutationErrorMessage } from "./supabase-error";

test("mutation errors explain missing database columns", () => {
  const result = getMutationErrorMessage({ code: "PGRST204", message: "column not in schema cache" }, "beasiswa");
  assert.match(result, /client_requested_fixes\.sql/);
});

test("mutation errors explain RLS permissions", () => {
  const result = getMutationErrorMessage({ code: "42501", message: "row-level security" }, "beasiswa");
  assert.match(result, /izin/);
});
