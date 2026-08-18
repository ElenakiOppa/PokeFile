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

const normalizeMarketplaceFinish = (key = '', value = null) => {
  const rawKey = String(key ?? '').trim();
  const normalized = normalizeKey(rawKey);

  if (!normalized || normalized === 'unit' || normalized === 'updated') {
    return null;
  }

  if (normalized === 'normal') return 'normal';
  if (normalized === 'holofoil') return 'holo';
  if (normalized === 'reverse-holofoil') return 'reverse';
  if (normalized.includes('reverse') && normalized.includes('holo')) return 'reverse';
  if (normalized.includes('holo')) return 'holo';
  if (normalized.includes('normal')) return 'normal';

  return normalized;
};

const cardVariantEntries = (card = []) => {
  const detailed = Array.isArray(card?.variants_detailed) ? card.variants_detailed : [];
  if (detailed.length) return detailed;
  if (Array.isArray(card?.variants) && card.variants.length) return card.variants;
  return [{ type: 'normal' }];
};

export const auditTcgdexMarketplaceVariants = (set, rawCardsOverride = null) => {
  const setId = String(set?.id || '');
  const setName = String(set?.name || '');
  const rawCards = Array.isArray(rawCardsOverride)
    ? rawCardsOverride
    : Array.isArray(set?.tcgdexRawCards)
      ? set.tcgdexRawCards
      : Array.isArray(set?.cards)
        ? set.cards
        : [];

  const cardReports = [];
  const missingByFinish = {};
  let structuralCollectibleCount = 0;
  const cardsWithMissingFinishes = [];

  for (const card of rawCards) {
    const localId = String(card?.localId ?? card?.number ?? '').trim() || 'unknown';
    const rarity = String(card?.rarity || 'Unknown').trim() || 'Unknown';
    const structuralSet = new Set();
    for (const variant of cardVariantEntries(card)) {
      const finish = normalizeStructuralFinish(variant);
      structuralSet.add(finish);
      structuralCollectibleCount += 1;
    }

    const marketplaceMap = {};
    const tcgplayer = card?.pricing?.tcgplayer && typeof card.pricing.tcgplayer === 'object' ? card.pricing.tcgplayer : {};
    Object.entries(tcgplayer).forEach(([key, value]) => {
      const finish = normalizeMarketplaceFinish(key, value);
      if (!finish || finish === 'updated' || finish === 'unit') return;
      marketplaceMap[finish] = value && typeof value === 'object' ? value : { marketPrice: value ?? null, productId: null };
    });

    const marketplaceFinishes = Object.keys(marketplaceMap).sort();
    const missingFinishes = marketplaceFinishes.filter((finish) => !structuralSet.has(finish));

    if (missingFinishes.length) {
      const reportEntries = missingFinishes.map((missingFinish) => {
        const details = marketplaceMap[missingFinish] || {};
        const record = {
          cardId: String(card?.id || ''),
          localId,
          name: String(card?.name || ''),
          rarity,
          missingFinish,
          tcgplayerProductId: details.productId ?? details.idProduct ?? details.id ?? null,
          marketPrice: Number.isFinite(Number(details.marketPrice)) ? Number(details.marketPrice) : Number.isFinite(Number(details.midPrice)) ? Number(details.midPrice) : Number.isFinite(Number(details.lowPrice)) ? Number(details.lowPrice) : null,
          structuralFinishes: [...structuralSet].sort(),
          marketplaceFinishes,
        };

        missingByFinish[missingFinish] = (missingByFinish[missingFinish] || 0) + 1;
        return record;
      });

      cardReports.push(...reportEntries);
      cardsWithMissingFinishes.push({
        cardId: String(card?.id || ''),
        localId,
        name: String(card?.name || ''),
        rarity,
        missingFinishes: missingFinishes.slice(),
      });
    }
  }

  const uniqueMissingFinishes = new Set(cardReports.map((entry) => entry.missingFinish));
  const summary = {
    setId,
    setName,
    cardCount: rawCards.length,
    structuralCollectibleCount,
    marketplaceMissingFinishCount: cardReports.length,
    reconciledCandidateCount: structuralCollectibleCount + uniqueMissingFinishes.size,
    missingByFinish: Object.fromEntries(
      Object.entries(missingByFinish).sort(([left], [right]) => left.localeCompare(right)),
    ),
    cardsWithMissingFinishes,
    missingCards: cardReports,
  };

  return summary;
};

export const logTcgdexMarketplaceAudit = (set, rawCardsOverride = null) => {
  const summary = auditTcgdexMarketplaceVariants(set, rawCardsOverride);
  console.log('TCGDEX MARKETPLACE VARIANT AUDIT', {
    setId: summary.setId,
    setName: summary.setName,
    cardCount: summary.cardCount,
    structuralCollectibleCount: summary.structuralCollectibleCount,
    marketplaceMissingFinishCount: summary.marketplaceMissingFinishCount,
    reconciledCandidateCount: summary.reconciledCandidateCount,
    missingByFinish: summary.missingByFinish,
    cardsWithMissingFinishes: summary.cardsWithMissingFinishes,
  });
  if (summary.missingCards.length) {
    console.log('TCGDEX MARKETPLACE CANDIDATE VARIANTS', summary.missingCards);
  }
  return summary;
};

export const auditTcgdexSet = (set, rawCardsOverride = null) => auditTcgdexMarketplaceVariants(set, rawCardsOverride);
export const logTcgdexAudit = (set, rawCardsOverride = null) => logTcgdexMarketplaceAudit(set, rawCardsOverride);
