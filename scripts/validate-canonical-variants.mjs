import fs from 'node:fs';
import assert from 'node:assert/strict';

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

const tcgdex = readJson(new URL('../data/providers/tcgdex/me02.5.json', import.meta.url));
const guides = readJson(new URL('../data/providers/pokecottage/set-guides.json', import.meta.url));

const cards = Array.isArray(tcgdex.cards) ? tcgdex.cards : [];
const baseCardCount = cards.length;
const uniqueLocalIds = new Set(cards.map((card) => String(card.localId || '').padStart(3, '0'))).size;
const allVariants = cards.flatMap((card) => Array.isArray(card.variants_detailed) ? card.variants_detailed : []);
const totalPhysicalCollectibles = allVariants.length;
const additionalVariants = totalPhysicalCollectibles - uniqueLocalIds;

assert.equal(baseCardCount, 295, 'Expected 295 numbered cards in Ascended Heroes');
assert.equal(uniqueLocalIds, 295, 'Expected 295 unique localIds in Ascended Heroes');
assert.equal(totalPhysicalCollectibles, 613, 'Expected 613 physical collectibles from TCGdex variants');
assert.equal(additionalVariants, 318, 'Expected 318 additional variants beyond the numbered base cards');

const numelVariants = cards.find((card) => String(card.localId || '').padStart(3, '0') === '027')?.variants_detailed || [];
const acerolaVariants = cards.find((card) => String(card.localId || '').padStart(3, '0') === '180')?.variants_detailed || [];

assert.equal(numelVariants.length, 3, 'Numel #027 should have 3 physical printings');
assert.deepEqual(
  numelVariants.map((variant) => ({ type: variant.type, foil: variant.foil ?? null })).sort((a, b) => a.type.localeCompare(b.type) || String(a.foil ?? '').localeCompare(String(b.foil ?? ''))),
  [
    { type: 'normal', foil: null },
    { type: 'reverse', foil: 'energy' },
    { type: 'reverse', foil: 'quickball' },
  ],
  'Numel #027 variant distribution must match the raw cached TCGdex set',
);
assert.equal(acerolaVariants.length, 2, 'Acerola\'s Mischief #180 should have 2 physical printings');
assert.deepEqual(
  acerolaVariants.map((variant) => ({ type: variant.type, foil: variant.foil ?? null })),
  [
    { type: 'normal', foil: null },
    { type: 'reverse', foil: null },
  ],
  'Acerola\'s Mischief #180 should be normal + reverse without special foil variants',
);

const mepRecord = (guides.guides || []).flatMap((guide) => guide.records || []).find(
  (record) => /MEP\s*091/i.test(String(record.number || '')) && /Mega Dragonite ex/i.test(String(record.name || '')),
);
assert.ok(mepRecord, 'Expected the PokéCottage guide to include MEP 091 Mega Dragonite ex');
const masterTotal = baseCardCount + additionalVariants + 1;
assert.equal(masterTotal, 614, 'Expected the master checklist total to be 614 including MEP 091');

console.log(JSON.stringify({
  numberedCards: baseCardCount,
  uniqueLocalIds,
  totalPhysicalCollectibles,
  additionalVariants,
  numelVariantCount: numelVariants.length,
  acerolaVariantCount: acerolaVariants.length,
  mep091: mepRecord.number,
  masterChecklistTotal: masterTotal,
}, null, 2));
