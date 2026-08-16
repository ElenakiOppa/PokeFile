import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const targetPath = path.join(repoRoot, 'data', 'scrydex', 'sets.json');
const INDEX_URL = 'https://scrydex.com/pokemon/expansions/';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

function cleanSetName(value) {
  return String(value || '')
    .replace(/\s*\|\s*Pokémon\s*\|\s*Scrydex$/i, '')
    .replace(/\s*\|\s*.*$/, '')
    .replace(/\s*[-–—]\s*.*$/, '')
    .replace(/\s*\(Pokémon\)\s*$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectSetCategory(setUrl, title) {
  const slug = String(setUrl || '').split('/').filter(Boolean).at(-1) || '';
  const label = String(title || '').toLowerCase();

  if (/tcgp-|pocket/i.test(slug) || /pocket/i.test(label)) {
    return 'Pocket Expansion';
  }

  if (/_(ja|jp)$/i.test(slug) || /japanese|jp/i.test(label)) {
    return 'Japanese';
  }

  return 'English';
}

function slugToTitle(slug) {
  const withoutCode = String(slug || '')
    .replace(/[-_][a-z0-9]+$/i, '')
    .replace(/(?:^|[-_])([a-z])/g, (_, char) => ` ${char.toUpperCase()}`)
    .replace(/\s+/g, ' ')
    .trim();

  return withoutCode || 'Unknown Set';
}

function extractExpansionUrls(html) {
  const regex = /href=["'](\/pokemon\/expansions\/[^"']+)["']/gi;
  const urls = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    const href = match[1].replace(/\/+$/, '');
    if (!href.includes('/cards/')) {
      urls.push(`https://scrydex.com${href}`);
    }
  }

  return [...new Set(urls)];
}

function extractCardNumber(value) {
  const match = String(value ?? '').match(/\d+/);
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
}

function formatCardNumber(value) {
  const numeric = Number(extractCardNumber(value));
  if (!Number.isFinite(numeric)) return '001';
  return String(Math.max(1, numeric)).padStart(3, '0');
}

function buildSetCardsFromHtml(html, setId, setName, categoryName) {
  const cardMap = new Map();
  const anchorRegex = /<a[^>]*href=["']\/pokemon\/cards\/[^"']+["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = anchorRegex.exec(html)) !== null) {
    const anchorHtml = match[1] || '';
    const dataIdMatch = anchorHtml.match(/data-id=["']([^"']+)["']/i);
    const imgMatch = anchorHtml.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/i);
    const hrefMatch = anchorHtml.match(/href=["']([^"']+)["']/i);
    const text = anchorHtml.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

    if (!dataIdMatch || !imgMatch) continue;

    const id = dataIdMatch[1].trim();
    const numberText = text.match(/#?\s*(\d+(?:\/\d+)?)\s*$/i)?.[1] || text.match(/(\d+(?:\/\d+)?)\b/i)?.[1] || '1';
    const normalizedNumber = formatCardNumber(numberText);
    const name = text.replace(new RegExp(`#?\\s*${String(numberText).replace(/\//g, '\\/')}\\s*$`, 'i'), '').replace(new RegExp(String(id), 'i'), '').replace(/\s+/g, ' ').trim() || `Card ${normalizedNumber}`;

    const card = {
      id,
      number: normalizedNumber,
      name,
      image: imgMatch[1],
      rarity: 'Unknown',
      variant: hrefMatch?.[1]?.includes('variant=holofoil') ? 'Holo' : 'Normal',
      value: 0,
      collected: false,
      setId: id.startsWith('tcgp-') ? setId : setId,
      setName,
      language: categoryName,
    };

    cardMap.set(id, card);
  }

  const cards = [...cardMap.values()].sort((a, b) => {
    const aValue = extractCardNumber(a.number);
    const bValue = extractCardNumber(b.number);
    return aValue - bValue || String(a.name || '').localeCompare(String(b.name || ''));
  });

  return cards.length ? cards : [{
    id: `${setId}-1`,
    number: '001',
    name: `Card 001`,
    image: `https://images.scrydex.com/pokemon/${setId}-1/medium`,
    rarity: 'Unknown',
    variant: 'Normal',
    value: 0,
    collected: false,
    setId,
    setName,
    language: categoryName,
  }];
}

async function collectSets() {
  const browser = await chromium.launch({ headless: true });
  const allSets = [];

  try {
    const response = await fetch(INDEX_URL, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText} for ${INDEX_URL}`);
    }

    const html = await response.text();
    const urls = [...new Set(extractExpansionUrls(html))];

    for (const [index, setUrl] of urls.entries()) {
      const page = await browser.newPage({
        userAgent: USER_AGENT,
      });

      try {
        await page.goto(setUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
        const title = await page.title();
        const slug = new URL(setUrl).pathname.split('/').filter(Boolean).at(-1) || 'unknown';
        const categoryName = detectSetCategory(setUrl, slug);
        const setName = cleanSetName(title.replace(/\s*\|\s*Pokémon\s*\|\s*Scrydex$/i, '')) || cleanSetName(slugToTitle(slug)) || 'Unknown Set';
        const pageHtml = await page.content();
        const cards = buildSetCardsFromHtml(pageHtml, slug, setName, categoryName);
        const bodyText = await page.locator('body').innerText();

        const releaseMatch = bodyText.match(/Released\s+(\d{4}[/-]\d{2}[/-]\d{2})/i) || bodyText.match(/(\d{4}[/-]\d{2}[/-]\d{2})/i);
        const releaseDate = releaseMatch ? releaseMatch[1].replace(/\//g, '-') : '2025-01-01';

        const normalizedCategory = detectSetCategory(setUrl, slug) === 'Japanese' || /_(ja|jp)$/i.test(slug)
          ? 'Japanese'
          : detectSetCategory(setUrl, slug) === 'Pocket Expansion' || /tcgp-|pocket/i.test(slug)
            ? 'Pocket Expansion'
            : 'English';

        allSets.push({
          id: slug,
          code: slug,
          name: setName,
          language: normalizedCategory,
          category: normalizedCategory,
          series: setName,
          releaseDate,
          order: index,
          logo: `https://images.scrydex.com/pokemon/${slug}-logo/logo`,
          color: normalizedCategory === 'Japanese' ? '#14b8a6' : normalizedCategory === 'Pocket Expansion' ? '#f59e0b' : '#6d28d9',
          type: normalizedCategory === 'Pocket Expansion' ? 'Pocket Expansion' : 'Master',
          totalCards: cards.length,
          percent: 0,
          url: setUrl,
          cards,
        });
      } finally {
        await page.close();
      }
    }

    const sortByDateDescending = (list) => [...list].sort((a, b) => {
      const aTime = new Date(a.releaseDate).getTime();
      const bTime = new Date(b.releaseDate).getTime();
      if (!Number.isNaN(aTime) && !Number.isNaN(bTime) && aTime !== bTime) {
        return bTime - aTime;
      }
      return Number(a.order ?? 0) - Number(b.order ?? 0);
    });

    const englishSets = sortByDateDescending(allSets.filter((set) => set.category === 'English'));
    const japaneseSets = sortByDateDescending(allSets.filter((set) => set.category === 'Japanese'));
    const pocketExpansionSets = sortByDateDescending(allSets.filter((set) => set.category === 'Pocket Expansion'));

    const payload = {
      englishSets,
      japaneseSets,
      pocketExpansionSets,
      sets: sortByDateDescending(allSets),
    };

    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

    return payload;
  } finally {
    await browser.close();
  }
}

const payload = await collectSets();
console.log(JSON.stringify({
  totalSets: payload.sets.length,
  english: payload.englishSets.length,
  japanese: payload.japaneseSets.length,
  pocket: payload.pocketExpansionSets.length,
  preview: payload.sets.slice(0, 6).map((set) => ({ id: set.id, name: set.name, category: set.category, totalCards: set.cards.length })),
}, null, 2));
