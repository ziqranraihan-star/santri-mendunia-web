import assert from "node:assert/strict";
import test from "node:test";
import { normalizeStringList, stringListToText } from "./string-list";

test("normalizes native arrays", () => {
  assert.deepEqual(normalizeStringList([" Biaya kuliah ", "", "Akomodasi"]), [
    "Biaya kuliah",
    "Akomodasi",
  ]);
});

test("normalizes JSON strings returned by legacy text columns", () => {
  assert.deepEqual(normalizeStringList('["Biaya kuliah","Akomodasi"]'), [
    "Biaya kuliah",
    "Akomodasi",
  ]);
});

test("normalizes newline and PostgreSQL array text", () => {
  assert.deepEqual(normalizeStringList("Biaya kuliah\nAkomodasi"), [
    "Biaya kuliah",
    "Akomodasi",
  ]);
  assert.deepEqual(normalizeStringList('{"Biaya kuliah","Akomodasi"}'), [
    "Biaya kuliah",
    "Akomodasi",
  ]);
});

test("converts any supported list shape into textarea text", () => {
  assert.equal(stringListToText('["Syarat satu","Syarat dua"]'), "Syarat satu\nSyarat dua");
});
