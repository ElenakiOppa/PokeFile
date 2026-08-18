import fs from 'node:fs';

const setId = 'me04';
const data = JSON.parse(fs.readFileSync(new URL(`../data/providers/tcgdex/${setId}.json`, import.meta.url), 'utf8'));
const cards = Array.isArray(data.cards) ? data.cards : Array.isArray(data.set?.cards) ? data.set.cards : [];
const officialSetCount = Number(data?.cardCount?.official ?? data?.officialCount ?? data?.set?.cardCount?.official ?? data?.set?.officialCount ?? 0);
const totalCount = Number(data?.cardCount?.total ?? data?.totalCount ?? data?.set?.cardCount?.total ?? data?.set?.totalCount ?? cards.length ?? 0);

console.log('SET METADATA');
console.log(`officialCount: ${officialSetCount}`);
console.log(`totalCount: ${totalCount}`);
console.log('');

const normalizeKey = (value = '') => String(value ?? '')
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const normalizeStructuralFinish = (variant = {}) => {
  const rawType = String(variant?.type || variant?.variantType || variant?.variant || 'normal').trim();
  const rawFoil = String(variant?.foil || variant?.finish || '').trim();
  const normalizedType = normalizeKey(rawType || 'normal');
  const normalizedFoil = normalizeKey(rawFoil);

  if (normalizedType === 'normal' && !normalizedFoil) return 'normal';
  if (normalizedType === 'holo' && !normalizedFoil) return 'holo';
  if (normalizedType === 'reverse' && !normalizedFoil) return 'reverse';
  if (!normalizedFoil) return normalizedType || 'normal';
  return `${normalizedType || 'normal'}-${normalizedFoil}`;
};

const cardVariantEntries = (card = []) => {
  const detailed = Array.isArray(card?.variants_detailed) ? card.variants_detailed : [];
  if (detailed.length) return detailed;
  if (Array.isArray(card?.variants) && card.variants.length) return card.variants;
  return [{ type: 'normal' }];
};

const getStructuralSet = (card = {}) => {
  const set = new Set();
  for (const variant of cardVariantEntries(card)) {
    set.add(normalizeStructuralFinish(variant));
  }
  return [...set].sort();
};

const getTcgplayerReverseEntries = (card = {}) => {
  const tcgplayer = card?.pricing?.tcgplayer && typeof card.pricing.tcgplayer === 'object'
    ? card.pricing.tcgplayer
    : {};

  return Object.entries(tcgplayer).filter(([key]) => {
    const normalized = normalizeKey(key);
    return normalized.includes('reverse') || normalized.includes('holofoil');
  });
};

const getExistingStructuralKinds = (card = {}) => {
  const variants = getStructuralSet(card);
  if (variants.length === 0) return ['normal'];
  return variants;
};

const candidates = [];

for (const card of cards) {
  const localId = String(card?.localId ?? card?.number ?? '').trim() || 'unknown';
  const localIdNumber = Number(localId);
  const rarity = String(card?.rarity || 'Unknown').trim() || 'Unknown';
  const category = String(card?.category || 'Unknown').trim() || 'Unknown';
  const structural = getExistingStructuralKinds(card);

  const reverseEntries = getTcgplayerReverseEntries(card);
  const hasReverseFacing = reverseEntries.some(([key]) => normalizeKey(key).includes('reverse'));

  if (!hasReverseFacing || structural.includes('reverse')) continue;

  const reverseEntry = reverseEntries.find(([key]) => normalizeKey(key).includes('reverse')) || reverseEntries[0];
  const reverseValue = reverseEntry ? reverseEntry[1] : null;
  const tcgplayerFinishKeys = reverseEntries.map(([key]) => key);
  const cardmarket = card?.pricing?.cardmarket && typeof card.pricing.cardmarket === 'object'
    ? card.pricing.cardmarket
    : {};

  const record = {
    cardId: String(card?.id || ''),
    localId,
    name: String(card?.name || ''),
    rarity,
    category,
    regulationMark: card?.regulationMark ?? null,
    tcgdexVariants: structural,
    tcgdexDetailedVariants: cardVariantEntries(card).map((variant) => ({
      type: variant?.type ?? null,
      variantType: variant?.variantType ?? null,
      foil: variant?.foil ?? null,
      finish: variant?.finish ?? null,
      variantId: variant?.variantId ?? null,
      size: variant?.size ?? null,
    })),
    tcgplayerFinishKeys,
    tcgplayerProductId: reverseValue && typeof reverseValue === 'object' ? reverseValue.productId ?? reverseValue.id ?? null : null,
    reverseMarketPrice: reverseValue && typeof reverseValue === 'object' ? reverseValue.marketPrice ?? reverseValue.midPrice ?? reverseValue.lowPrice ?? null : null,
    cardmarketProductId: cardmarket && typeof cardmarket === 'object' ? (cardmarket.idProduct ?? cardmarket.id ?? null) : null,
    withinOfficialRange: !Number.isNaN(localIdNumber) && localIdNumber <= officialSetCount,
    isAboveOfficialRange: !Number.isNaN(localIdNumber) && localIdNumber > officialSetCount,
    isSecretAlternate: !Number.isNaN(localIdNumber) && localIdNumber > officialSetCount,
    officialSetCount,
  };

  candidates.push(record);
}

const rarityGroups = {};
const categoryGroups = {};
const officialGroups = { official: 0, aboveOfficial: 0 };
const structuralGroups = {};
const finishComboGroups = {};

for (const candidate of candidates) {
  rarityGroups[candidate.rarity] = (rarityGroups[candidate.rarity] || 0) + 1;
  categoryGroups[candidate.category] = (categoryGroups[candidate.category] || 0) + 1;
  if (candidate.withinOfficialRange) officialGroups.official += 1;
  if (candidate.isAboveOfficialRange) officialGroups.aboveOfficial += 1;

  const structuralKey = candidate.tcgdexVariants.length ? candidate.tcgdexVariants.join('+') : 'none';
  structuralGroups[structuralKey] = (structuralGroups[structuralKey] || 0) + 1;

  const finishCombo = candidate.tcgplayerFinishKeys.join(' | ');
  finishComboGroups[finishCombo] = (finishComboGroups[finishCombo] || 0) + 1;
}

const outlierGroupCandidates = [
  ['rarity', rarityGroups],
  ['category', categoryGroups],
  ['range', officialGroups],
  ['structural', structuralGroups],
  ['finishCombo', finishComboGroups],
];

const possibleOutlierGroups = outlierGroupCandidates
  .flatMap(([groupName, map]) => Object.entries(map).map(([key, count]) => ({ groupName, key, count })))
  .filter((entry) => entry.count >= 1 && entry.count <= 4)
  .sort((a, b) => a.count - b.count || a.groupName.localeCompare(b.groupName) || a.key.localeCompare(b.key));

console.log('CHAOS RISING REVERSE CANDIDATE ANALYSIS');
console.log('');
console.log(`Total candidates: ${candidates.length}`);
console.log('');
console.log('BY RARITY');
for (const [key, count] of Object.entries(rarityGroups).sort(([a], [b]) => a.localeCompare(b))) {
  console.log(`${key}: ${count}`);
}
console.log('');
console.log('BY CATEGORY');
for (const [key, count] of Object.entries(categoryGroups).sort(([a], [b]) => a.localeCompare(b))) {
  console.log(`${key}: ${count}`);
}
console.log('');
console.log('BY NUMBER RANGE');
console.log(`Official-range cards: ${officialGroups.official}`);
console.log(`Above-official cards: ${officialGroups.aboveOfficial}`);
console.log('');
console.log('BY EXISTING STRUCTURAL VARIANT');
for (const [key, count] of Object.entries(structuralGroups).sort(([a], [b]) => a.localeCompare(b))) {
  console.log(`${key}: ${count}`);
}
console.log('');
console.log('BY TCGPLAYER FINISH COMBINATION');
for (const [key, count] of Object.entries(finishComboGroups).sort(([a], [b]) => a.localeCompare(b))) {
  console.log(`${key}: ${count}`);
}
console.log('');
console.log('POSSIBLE OUTLIER GROUPS');
if (possibleOutlierGroups.length === 0) {
  console.log('No small metadata-only subgroup found at <= 4 candidates.');
} else {
  for (const entry of possibleOutlierGroups) {
    console.log(`${entry.groupName} :: ${entry.key} :: ${entry.count}`);
  }
}
console.log('');
console.log('ABOVE OFFICIAL NUMBERED RANGE CANDIDATES');
for (const candidate of candidates.filter((c) => c.isAboveOfficialRange)) {
  console.log(`${candidate.localId} | ${candidate.name} | ${candidate.rarity} | ${candidate.category} | ${candidate.tcgdexVariants.join('+')} | ${candidate.tcgplayerFinishKeys.join(', ')}`);
}
console.log('');
console.log('STRUCTURAL VARIANT HINTS');
for (const candidate of candidates.filter((c) => c.tcgdexVariants.includes('holo') || c.tcgdexVariants.includes('holo+normal') || c.tcgdexVariants.join('+') === 'holo+normal')) {
  console.log(`${candidate.localId} | ${candidate.name} | ${candidate.rarity} | ${candidate.category} | ${candidate.tcgdexVariants.join('+')} | ${candidate.tcgplayerFinishKeys.join(', ')}`);
}
console.log('');
console.log('Candidate detail records:');
for (const candidate of candidates) {
  console.log(JSON.stringify({
    cardId: candidate.cardId,
    localId: candidate.localId,
    name: candidate.name,
    rarity: candidate.rarity,
    category: candidate.category,
    regulationMark: candidate.regulationMark,
    tcgdexVariants: candidate.tcgdexVariants,
    tcgplayerFinishKeys: candidate.tcgplayerFinishKeys,
    tcgplayerProductId: candidate.tcgplayerProductId,
    reverseMarketPrice: candidate.reverseMarketPrice,
    cardmarketProductId: candidate.cardmarketProductId,
    withinOfficialRange: candidate.withinOfficialRange,
    isSecretAlternate: candidate.isSecretAlternate,
  }, null, 2));
}
console.log('');
console.log('NO GENERIC 72/76 RULE DISCOVERED');
