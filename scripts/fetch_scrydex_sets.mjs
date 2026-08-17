import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const targetPath = path.join(__dirname, '..', 'data', 'scrydex', 'sets.json');
const BASE_URL = 'https://scrydex.com';
const CATALOGS = [
  { category: 'English', url: `${BASE_URL}/pokemon/expansions?show_all_variants=true&show_expansion_variants_only=false` },
  { category: 'Japanese', url: `${BASE_URL}/pokemon/jp/expansions?show_all_variants=true&show_expansion_variants_only=false` },
  { category: 'Pocket Expansion', url: `${BASE_URL}/pokemon/tcg-pocket/expansions?show_all_variants=true&show_expansion_variants_only=false` },
];
const REQUEST_HEADERS = { Accept: 'text/html,application/xhtml+xml', 'User-Agent': 'Mozilla/5.0 Chrome/126 Safari/537.36' };

const decodeHtml = (value = '') => String(value)
  .replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
const plainText = (html = '') => decodeHtml(String(html).replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
const collectorValue = (value) => Number(String(value ?? '').match(/\d+/)?.[0] ?? Number.MAX_SAFE_INTEGER);
const variantFromHref = (href) => decodeURIComponent(new URL(href, BASE_URL).searchParams.get('variant') || 'normal');
const humanizeVariant = (value) => String(value || 'normal').replace(/([a-z\d])([A-Z])/g, '$1 $2').replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const isGrandmasterVariant = (value) => /stamp|promo|pre.?release|staff|league|championship|winner|tournament|regional|national|worlds?|event|pokemon center|play pokemon|first place|second place|third place/i.test(value);
const baseVariantRank = (value) => ({ normal: 0, holofoil: 1, reverseHolofoil: 2 }[value] ?? 10);
const displayVariantRank = (card) => {
  const variant = String(card.variantKey || '').toLowerCase();
  if (variant === 'normal') return 0;
  if (variant === 'holofoil') return 1;
  if (variant === 'reverseholofoil') return 2;
  if (/pok[eé]ball/.test(variant)) return 3;
  if (/masterball/.test(variant)) return 4;
  if (card.isPromoOrStamped) return 100;
  return 10;
};

async function fetchHtml(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { headers: REQUEST_HEADERS, signal: AbortSignal.timeout(45000) });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, attempt * 750));
    }
  }
  throw new Error(`Unable to fetch ${url}: ${lastError?.message || lastError}`);
}

function expansionUrls(html) {
  const catalogHtml = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || html;
  const matches = [...catalogHtml.matchAll(/href=["'](\/pokemon\/expansions\/[^"'?#]+)[^"']*["']/gi)];
  return [...new Set(matches.map((match) => `${BASE_URL}${match[1].replace(/\/$/, '')}`))];
}

function parseCardAnchors(html, setId, setName, category) {
  const entries = [];
  const anchorPattern = /<a\b([^>]*href=["']([^"']*\/pokemon\/cards\/[^"']+)["'][^>]*)>([\s\S]*?)<\/a>/gi;
  let match;
  let sourceOrder = 0;
  while ((match = anchorPattern.exec(html)) !== null) {
    const href = decodeHtml(match[2]);
    const body = match[3];
    const id = body.match(/data-id=["']([^"']+)["']/i)?.[1];
    if (!id || !id.toLowerCase().startsWith(`${setId.toLowerCase()}-`)) continue;
    const spanLines = [...body.matchAll(/<span\b[^>]*>([\s\S]*?)<\/span>/gi)].map((span) => plainText(span[1]));
    const nameLine = spanLines.find((line) => /\s#\S+/.test(line)) || plainText(body).replace(/^MISSING VARIANT IMAGE\s*/i, '');
    const nameMatch = nameLine.match(/^(.+?)\s+#([^\s$]+)(?:\s|$)/);
    const number = nameMatch?.[2] || id.slice(setId.length + 1);
    const name = nameMatch?.[1]?.trim() || `Card ${number}`;
    const variantKey = variantFromHref(href);
    const variant = humanizeVariant(variantKey);
    const imageTag = body.match(/<img\b[^>]*>/i)?.[0] || '';
    const image = decodeHtml(imageTag.match(/\bsrc=["']([^"']+)["']/i)?.[1] || `https://images.scrydex.com/pokemon/${id}/medium`);
    const price = Number(plainText(body).match(/\$([\d,.]+)/)?.[1]?.replace(/,/g, '') || 0);
    entries.push({
      id: `${id}:${variantKey}`, cardId: id, number: String(number), name, image,
      rarity: 'Unknown', variant, variantKey, value: price, collected: false,
      setId, setName, language: category, sourceUrl: new URL(href, BASE_URL).href,
      sourceOrder: sourceOrder++, missingVariantImage: /Missing Variant Image/i.test(body),
      isPromoOrStamped: isGrandmasterVariant(variant),
    });
  }
  const unique = [...new Map(entries.map((entry) => [entry.id, entry])).values()];
  return unique.sort((a, b) => collectorValue(a.number) - collectorValue(b.number) || a.sourceOrder - b.sourceOrder);
}

function buildTiers(variants, printedTotal = Number.MAX_SAFE_INTEGER) {
  const grouped = new Map();
  for (const entry of variants) {
    if (!grouped.has(entry.cardId)) grouped.set(entry.cardId, []);
    grouped.get(entry.cardId).push(entry);
  }
  const completeCards = [...grouped.values()]
    .filter((group) => collectorValue(group[0]?.number) <= printedTotal)
    .map((group) => group.filter((card) => !card.isPromoOrStamped).sort((a, b) => baseVariantRank(a.variantKey) - baseVariantRank(b.variantKey) || a.sourceOrder - b.sourceOrder)[0])
    .filter(Boolean);
  const masterCards = variants.filter((entry) => !entry.isPromoOrStamped);
  const sortTier = (list) => [...list].sort((a, b) => collectorValue(a.number) - collectorValue(b.number) || displayVariantRank(a) - displayVariantRank(b) || a.sourceOrder - b.sourceOrder);
  return { completeCards: sortTier(completeCards), masterCards: sortTier(masterCards), grandmasterCards: sortTier(variants) };
}

async function parseExpansion(html, url, category, order) {
  const setId = new URL(url).pathname.split('/').filter(Boolean).at(-1);
  const heading = plainText(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '');
  const title = plainText(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').replace(/\s*\|.*$/, '');
  const setName = heading || title || setId;
  const bodyText = plainText(html);
  const releaseParts = bodyText.match(/Released\s+(\d{4})[/-](\d{2})[/-](\d{2})/i);
  const releaseDate = releaseParts ? `${releaseParts[1]}-${releaseParts[2]}-${releaseParts[3]}` : '';
  const variants = parseCardAnchors(html, setId, setName, category);
  const firstStandardCard = variants.find((card) => !card.isPromoOrStamped);
  let printedTotal = Number.MAX_SAFE_INTEGER;
  if (firstStandardCard?.sourceUrl) {
    const cardHtml = await fetchHtml(firstStandardCard.sourceUrl);
    const printedNumber = cardHtml.match(/printed_number[\s\S]{0,300}?(\d{1,4})\/(\d{1,4})/i);
    if (printedNumber) printedTotal = Number(printedNumber[2]);
  }
  const tiers = buildTiers(variants, printedTotal);
  const completeIds = new Set(tiers.completeCards.map((card) => card.id));
  const masterIds = new Set(tiers.masterCards.map((card) => card.id));
  const inventory = tiers.grandmasterCards.map((card) => ({
    ...card,
    collectionTier: completeIds.has(card.id) ? 'complete' : masterIds.has(card.id) ? 'master' : 'grandmaster',
  }));
  const series = category === 'Pocket Expansion' ? 'Pokémon TCG Pocket' : 'Other';
  return {
    id: setId, code: setId, name: setName, language: category, category, series,
    releaseDate, order, url, logo: `https://images.scrydex.com/pokemon/${setId}-logo/logo`,
    color: category === 'Japanese' ? '#14b8a6' : category === 'Pocket Expansion' ? '#f59e0b' : '#6d28d9',
    type: 'Complete', percent: 0, printedTotal: Number.isFinite(printedTotal) ? printedTotal : null, totalCards: tiers.completeCards.length,
    completeTotal: tiers.completeCards.length, masterTotal: tiers.masterCards.length,
    grandmasterTotal: tiers.grandmasterCards.length, cards: inventory,
  };
}

async function mapConcurrent(items, concurrency, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
      if ((index + 1) % 25 === 0 || index + 1 === items.length) console.log(`Fetched ${index + 1}/${items.length}`);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
  return results;
}

async function collectCatalog(catalog) {
  const urls = expansionUrls(await fetchHtml(catalog.url));
  console.log(`${catalog.category}: ${urls.length} expansions`);
  const sets = await mapConcurrent(urls, 8, async (url, order) => await parseExpansion(await fetchHtml(`${url}?show_all_variants=true&show_expansion_variants_only=false`), url, catalog.category, order));
  return sets.filter((set) => set.completeTotal > 0);
}

const [englishSets, japaneseSets, pocketExpansionSets] = await Promise.all(CATALOGS.map(collectCatalog));
const sets = [...englishSets, ...japaneseSets, ...pocketExpansionSets];
const payload = {
  source: 'Scrydex public expansion pages', generatedAt: new Date().toISOString(),
  tierDefinitions: {
    complete: 'One canonical printing for every distinct numbered card.',
    master: 'Complete set plus every non-promotional card variant and special printing.',
    grandmaster: 'Master set plus promo, stamped, staff, league, event, and tournament printings.',
  },
  setIdsByCategory: {
    English: englishSets.map((set) => set.id),
    Japanese: japaneseSets.map((set) => set.id),
    'Pocket Expansion': pocketExpansionSets.map((set) => set.id),
  },
  sets,
};
fs.mkdirSync(path.dirname(targetPath), { recursive: true });
fs.writeFileSync(targetPath, `${JSON.stringify(payload)}\n`, 'utf8');
console.log(JSON.stringify({
  totalSets: sets.length, english: englishSets.length, japanese: japaneseSets.length, pocket: pocketExpansionSets.length,
  completeCards: sets.reduce((sum, set) => sum + set.completeTotal, 0),
  masterCards: sets.reduce((sum, set) => sum + set.masterTotal, 0),
  grandmasterCards: sets.reduce((sum, set) => sum + set.grandmasterTotal, 0), targetPath,
}, null, 2));
