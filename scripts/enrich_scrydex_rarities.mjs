import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const targetPath = path.join(__dirname, '..', 'data', 'scrydex', 'sets.json');
const targetSetId = process.argv[2];
if (!targetSetId) throw new Error('Pass a set id, for example: node scripts/enrich_scrydex_rarities.mjs me5');

const payload = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
const set = payload.sets.find((item) => item.id === targetSetId);
if (!set) throw new Error(`Set ${targetSetId} was not found.`);

const cardsByCardId = new Map();
for (const card of set.cards) if (!cardsByCardId.has(card.cardId)) cardsByCardId.set(card.cardId, card);
const cards = [...cardsByCardId.values()];
const rarities = new Map();
let cursor = 0;

const decodeHtml = (value = '') => value.replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"');
async function worker() {
  while (cursor < cards.length) {
    const card = cards[cursor++];
    const response = await fetch(card.sourceUrl, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/126 Safari/537.36' } });
    if (!response.ok) throw new Error(`${response.status} for ${card.sourceUrl}`);
    const html = await response.text();
    const description = decodeHtml(html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1] || '');
    const rarity = description.match(/\s-\sAn?\s+(.+?)\s+(?:Pok[eé]mon|Trainer|Energy) card from\s/i)?.[1]?.trim();
    if (rarity) rarities.set(card.cardId, rarity);
  }
}

await Promise.all(Array.from({ length: Math.min(10, cards.length) }, worker));
for (const card of set.cards) card.rarity = rarities.get(card.cardId) || card.rarity || 'Unknown';
payload.generatedAt = new Date().toISOString();
fs.writeFileSync(targetPath, `${JSON.stringify(payload)}\n`, 'utf8');
console.log(`Updated ${rarities.size}/${cards.length} unique cards in ${set.name}.`);
console.log([...new Set(set.cards.map((card) => card.rarity))].sort().join(', '));
