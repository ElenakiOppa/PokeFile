export const normalizeTcgdexSet = (set, cards) => ({
  provider: 'tcgdex',
  providerSetId: set.id,
  name: set.name,
  officialCount: Number(set.cardCount?.official || 0),
  totalCount: Number(set.cardCount?.total || cards.length),
  logo: set.logo || null,
  symbol: set.symbol || null,
  cardCount: set.cardCount,
  cards: cards.map((card) => ({
    provider: 'tcgdex',
    providerId: card.id,
    baseCardId: card.id,
    localId: String(card.localId),
    name: card.name,
    image: card.image || null,
    rarity: card.rarity || null,
    updated: card.updated || null,
    variants: {
      normal: card.variants?.normal === true ? true : null,
      holo: card.variants?.holo === true ? true : null,
      reverse: card.variants?.reverse === true ? true : null,
      firstEdition: card.variants?.firstEdition === true ? true : null,
    },
    variantsDetailed: card.variants_detailed || null,
  })),
});

export const fetchTcgdexSet = async (setId, language = 'en') => {
  const root = `https://api.tcgdex.net/v2/${language}`;
  const setResponse = await fetch(`${root}/sets/${setId}`);
  if (!setResponse.ok) throw new Error(`TCGdex set request failed: ${setResponse.status}`);
  const set = await setResponse.json();
  const cards = await Promise.all((set.cards || []).map(async (brief) => {
    const response = await fetch(`${root}/cards/${brief.id}`);
    if (!response.ok) throw new Error(`TCGdex card request failed for ${brief.id}: ${response.status}`);
    return response.json();
  }));
  return { set, cards };
};
