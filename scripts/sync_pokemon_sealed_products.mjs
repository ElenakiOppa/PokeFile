import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const setsPath = path.join(root, "data", "scrydex", "sets.json");
const curatedSourcesPath = path.join(root, "data", "curated", "pokemon-sealed-sources.json");
const catalogPath = path.join(root, "data", "providers", "pokemon", "sealed-products.json");
const registryPath = path.join(root, "data", "sealedProductCatalog.js");
const assetsRoot = path.join(root, "assets", "sealed-products");
const sitemapUrl = "https://www.pokemon.com/us/sitemap.xml";
const galleryMarker = "/us/pokemon-tcg/product-gallery/";

const slug = (value) => String(value || "")
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/&/g, " and ")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const PRODUCT_TYPES = [
  ["Pokemon Center ETB", /pokemon-center-(?:elite-trainer-box|etb)/],
  ["Elite Trainer Box", /(?:elite-trainer-box|etb)/],
  ["Booster Box", /booster-(?:display-)?box/],
  ["Booster Bundle", /booster-bundle/],
  ["Build & Battle Box", /build-and-battle(?:-stadium|-box)?/],
  ["Sleeved Booster", /sleeved-booster/],
  ["Booster Pack", /booster-pack/],
  ["Ultra-Premium Collection", /ultra-premium-collection/],
  ["Premium Collection", /premium-collection/],
  ["Collection Box", /(?:collection|collector-chest|binder-collection|poster-collection|sticker-collection|tech-sticker-collection)/],
  ["Mini Tin", /mini-tin/],
  ["Tin", /(?:tin|stacking-tins)/],
  ["Blister", /(?:blister|checklane)/],
  ["Theme/Battle Deck", /(?:battle-deck|theme-deck|ex-battle-deck|league-battle-deck|build-and-battle)/],
];

const typeSlug = {
  "Pokemon Center ETB": "pokemon-center-etb",
  "Elite Trainer Box": "elite-trainer-box",
  "Booster Box": "booster-box",
  "Booster Bundle": "booster-bundle",
  "Build & Battle Box": "build-and-battle-box",
  "Sleeved Booster": "sleeved-booster",
  "Booster Pack": "booster-pack",
  "Ultra-Premium Collection": "ultra-premium-collection",
  "Premium Collection": "premium-collection",
  "Collection Box": "collection-box",
  "Mini Tin": "mini-tin",
  Tin: "tin",
  Blister: "blister",
  "Theme/Battle Deck": "battle-deck",
};

const fetchText = async (url) => {
  const response = await fetch(url, { headers: { "User-Agent": "PokeFile official asset sync/1.0" } });
  const text = response.ok ? await response.text() : "";
  if (text && !/Pardon Our Interruption/i.test(text)) return text;
  if (process.platform === "win32") {
    const escaped = url.replaceAll("'", "''");
    return execFileSync("powershell.exe", [
      "-NoProfile",
      "-Command",
      `(Invoke-WebRequest -Uri '${escaped}' -UseBasicParsing -TimeoutSec 30).Content`,
    ], { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
  }
  throw new Error(`${response.status} ${url}`);
};

const setsPayload = JSON.parse(await fs.readFile(setsPath, "utf8"));
const curatedSources = JSON.parse(await fs.readFile(curatedSourcesPath, "utf8")).sources || [];
const englishSets = (setsPayload.sets || []).filter((set) =>
  String(set.language || "").toLowerCase() === "english" && set.id !== "mep"
);
const aliases = englishSets.flatMap((set) => {
  const name = slug(set.name);
  const series = slug(set.series || "");
  return [...new Set([name, series && `${series}-${name}`].filter(Boolean))]
    .map((alias) => ({ alias, set }))
    .sort((a, b) => b.alias.length - a.alias.length);
}).sort((a, b) => b.alias.length - a.alias.length);

const sitemap = await fetchText(sitemapUrl);
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => match[1].replace(/&amp;/g, "&"))
  .filter((url) => url.includes(galleryMarker));
console.log(`Found ${urls.length} official product-gallery URLs.`);

const candidates = [];
const review = [];
for (const sourceUrl of urls) {
  const pageSlug = sourceUrl.split(galleryMarker)[1].replace(/\/$/, "");
  const matches = aliases.filter(({ alias }) =>
    pageSlug === alias || pageSlug.startsWith(`${alias}-`) || pageSlug.includes(`-${alias}-`)
  );
  const bestLength = matches[0]?.alias.length || 0;
  const best = matches.filter((match) => match.alias.length === bestLength);
  if (best.length !== 1) continue;
  const matched = best[0];
  const remaining = pageSlug.replace(matched.alias, "").replace(/^-|-$/g, "");
  const productMatches = PRODUCT_TYPES.filter(([, pattern]) => pattern.test(remaining || pageSlug));
  if (!productMatches.length) {
    review.push({ sourceUrl, setId: matched.set.id, reason: "unknown-product-type" });
    continue;
  }
  candidates.push({ sourceUrl, pageSlug, remaining, set: matched.set, productType: productMatches[0][0] });
}
for (const source of curatedSources) {
  if (candidates.some((candidate) => candidate.sourceUrl === source.sourceUrl)) continue;
  const set = englishSets.find((item) => item.id === source.setId);
  if (!set) {
    review.push({ sourceUrl: source.sourceUrl, setId: source.setId, reason: "curated-set-not-found" });
    continue;
  }
  candidates.push({
    sourceUrl: source.sourceUrl,
    pageSlug: source.sourceUrl.split("/").filter(Boolean).at(-1),
    remaining: slug(source.productName),
    set,
    productType: source.productType,
    curatedProductName: source.productName,
    curatedImageUrl: source.officialImageUrl,
    curatedAssetName: source.assetName,
  });
}
console.log(`Matched ${candidates.length} products to Pokefile sets; ${review.length} need type review.`);

await fs.mkdir(assetsRoot, { recursive: true });
const records = [];
const importCandidate = async (candidate) => {
  try {
    const html = candidate.curatedImageUrl ? "" : await fetchText(candidate.sourceUrl);
    const imageMatches = [...html.matchAll(/https:\/\/www\.pokemon\.com\/static-assets\/[^"'<> ]+\.(?:png|jpe?g|webp)/gi)]
      .map((match) => match[0].replaceAll("&amp;", "&"));
    const officialImageUrl = candidate.curatedImageUrl || [...new Set(imageMatches)].find((url) => /trading-card-game/i.test(url));
    const title = candidate.curatedProductName || html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]
      ?.replace(/<[^>]+>/g, " ").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim() || candidate.pageSlug;
    if (!officialImageUrl) {
      review.push({ sourceUrl: candidate.sourceUrl, setId: candidate.set.id, reason: "official-image-not-found" });
      return;
    }
    const extension = officialImageUrl.match(/\.(png|jpe?g|webp)(?:$|\?)/i)?.[1]?.toLowerCase() || "png";
    const base = typeSlug[candidate.productType];
    const suffix = slug(candidate.remaining)
      .replace(new RegExp(`(^|-)${base.replaceAll("-", "-")}($|-)`), "-")
      .replace(/^-|-$/g, "");
    const fileBase = candidate.curatedAssetName || (suffix && suffix !== base ? `${base}-${suffix}` : base);
    const directory = path.join(assetsRoot, candidate.set.id);
    await fs.mkdir(directory, { recursive: true });
    let fileName = `${fileBase}.${extension}`;
    let destination = path.join(directory, fileName);
    let copy = 2;
    while (records.some((record) => record.localPath === `assets/sealed-products/${candidate.set.id}/${fileName}`)) {
      fileName = `${fileBase}-${copy++}.${extension}`;
      destination = path.join(directory, fileName);
    }
    const imageResponse = await fetch(officialImageUrl, { headers: { "User-Agent": "PokeFile official asset sync/1.0" } });
    if (!imageResponse.ok) throw new Error(`image ${imageResponse.status}`);
    await fs.writeFile(destination, Buffer.from(await imageResponse.arrayBuffer()));
    records.push({
      id: `pokemon-${candidate.set.id}-${fileName.replace(/\.[^.]+$/, "")}`,
      setId: candidate.set.id,
      setName: candidate.set.name,
      productName: title,
      productType: candidate.productType,
      imageProvider: "pokemon-official",
      sourceUrl: candidate.sourceUrl,
      officialImageUrl,
      localPath: `assets/sealed-products/${candidate.set.id}/${fileName}`,
      retrievedAt: new Date().toISOString(),
      verified: true,
    });
    process.stdout.write(`\rImported ${records.length}/${candidates.length}`);
  } catch (error) {
    review.push({ sourceUrl: candidate.sourceUrl, setId: candidate.set.id, reason: String(error.message || error) });
  }
};
const pending = [...candidates];
const workers = Array.from({ length: 8 }, async () => {
  while (pending.length) {
    const candidate = pending.shift();
    if (candidate) await importCandidate(candidate);
  }
});
await Promise.all(workers);

await fs.mkdir(path.dirname(catalogPath), { recursive: true });
await fs.writeFile(catalogPath, `${JSON.stringify({
  provider: "pokemon-official",
  source: sitemapUrl,
  generatedAt: new Date().toISOString(),
  records,
  review,
}, null, 2)}\n`);

const registry = `// Generated by scripts/sync_pokemon_sealed_products.mjs\n` +
  `import catalog from "./providers/pokemon/sealed-products.json";\n\n` +
  `const images = {\n${records.map((record) => `  ${JSON.stringify(record.id)}: require("../${record.localPath.replaceAll("\\", "/")}"),`).join("\n")}\n};\n\n` +
  `export const SEALED_PRODUCT_CATALOG = catalog.records.map((record) => ({ ...record, image: images[record.id] }));\n` +
  `export const getSealedProductsForSet = (setId) => SEALED_PRODUCT_CATALOG.filter((product) => product.setId === setId);\n` +
  `export const getSealedProductById = (id) => SEALED_PRODUCT_CATALOG.find((product) => product.id === id) || null;\n` +
  `export const sealedAssetImageSource = (asset) => getSealedProductById(asset?.imageCatalogId)?.image || (typeof asset?.image === "string" && asset.image ? { uri: asset.image } : asset?.image || null);\n` +
  `export default SEALED_PRODUCT_CATALOG;\n`;
await fs.writeFile(registryPath, registry);
console.log(`\nWrote ${records.length} verified products; ${review.length} entries need review.`);
