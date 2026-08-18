const VARIANT_KEYS = {
  normal: 'normal',
  holo: 'holofoil',
  reverse: 'reverseHolofoil',
  firstEdition: 'firstEdition',
};

export const normalizeScrydexSet = (set) => {
  const groups = (set.cards || []).reduce((result, card) => {
    const id = String(card.cardId || card.id).split(':')[0];
    if (!result[id]) result[id] = [];
    result[id].push(card);
    return result;
  }, {});

  return {
    provider: 'scrydex',
    providerSetId: set.id,
    name: set.name,
    officialCount: Number(set.printedTotal || set.totalCards || 0),
    totalCount: Object.keys(groups).length,
    logo: set.logo || null,
    symbol: set.symbol || null,
    cards: Object.entries(groups).map(([baseCardId, records]) => ({
      provider: 'scrydex',
      providerId: baseCardId,
      baseCardId,
      localId: String(records[0].number),
      name: records[0].name,
      image: records[0].image || null,
      rarity: records[0].rarity || null,
      variants: Object.fromEntries(Object.entries(VARIANT_KEYS).map(([fact, key]) => [
        fact,
        records.some((record) => record.variantKey === key) ? true : null,
      ])),
      records,
    })),
  };
};
