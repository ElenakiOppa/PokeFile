import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(
  fs.readFileSync(path.join(root, "data", "providers", "pokemon", "sealed-products.json"), "utf8"),
);
const ids = new Set();
for (const record of catalog.records) {
  assert(record.verified, `${record.id} must be verified`);
  assert.equal(record.imageProvider, "pokemon-official");
  assert(record.sourceUrl.startsWith("https://www.pokemon.com/"));
  assert(record.officialImageUrl.startsWith("https://www.pokemon.com/static-assets/"));
  assert(!ids.has(record.id), `Duplicate product ID ${record.id}`);
  ids.add(record.id);
  const asset = path.resolve(root, record.localPath);
  assert(asset.startsWith(path.resolve(root, "assets", "sealed-products")));
  assert(fs.existsSync(asset), `Missing local product image ${record.localPath}`);
  assert(fs.statSync(asset).size > 1000, `Invalid image ${record.localPath}`);
}
assert(catalog.records.length > 0, "Catalog must contain at least one verified product");
console.log(`Official sealed catalog validation passed: ${catalog.records.length} products.`);
