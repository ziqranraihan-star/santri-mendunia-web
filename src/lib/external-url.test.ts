import assert from "node:assert/strict";
import test from "node:test";
import { isValidExternalUrl, normalizeExternalUrl } from "./external-url";

test("normalizeExternalUrl adds https to a domain", () => {
  assert.equal(normalizeExternalUrl("santrimendunia.org/daftar"), "https://santrimendunia.org/daftar");
});

test("normalizeExternalUrl preserves an absolute https URL", () => {
  assert.equal(normalizeExternalUrl("https://example.com/apply?q=1"), "https://example.com/apply?q=1");
});

test("external URL validation rejects captions and unsafe schemes", () => {
  assert.equal(isValidExternalUrl("OXFORD MENUNGGUMU! Bagaimana jika tahun 2027"), false);
  assert.equal(normalizeExternalUrl("javascript:alert(1)"), "");
});

test("an empty optional URL is valid", () => {
  assert.equal(isValidExternalUrl(""), true);
});
