import assert from "node:assert/strict";
import test from "node:test";
import { objectToCamel, objectToSnake, toSnakeCase } from "./casing";

test("toSnakeCase converts camelCase keys", () => {
  assert.equal(toSnakeCase("publishedAt"), "published_at");
  assert.equal(toSnakeCase("URLValue"), "_u_r_l_value");
});

test("objectToSnake converts nested object keys", () => {
  assert.deepEqual(
    objectToSnake({
      imageUrl: "cover.png",
      relatedLinks: [{ targetUrl: "https://example.com" }],
    }),
    {
      image_url: "cover.png",
      related_links: [{ target_url: "https://example.com" }],
    }
  );
});

test("objectToCamel converts nested object keys", () => {
  assert.deepEqual(
    objectToCamel({
      image_url: "cover.png",
      related_links: [{ target_url: "https://example.com" }],
    }),
    {
      imageUrl: "cover.png",
      relatedLinks: [{ targetUrl: "https://example.com" }],
    }
  );
});
