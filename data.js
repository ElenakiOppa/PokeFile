import setsData from './data/scrydex/sets.json';

const fallbackSets = [
  {
    id: 'pitch-black',
    code: 'me5',
    name: 'Pitch Black',
    language: 'English',
    category: 'English',
    series: 'Mega Evolution',
    releaseDate: '2026-07-17',
    logo: 'https://images.scrydex.com/pokemon/me5-logo/logo',
    color: '#6d28d9',
    type: 'Master',
    totalCards: 3,
    percent: 0,
    cards: [
      { id: 'me5-1', number: '1', name: 'Tropius', image: 'https://images.scrydex.com/pokemon/me5-1/medium', rarity: 'Unknown', variant: 'Normal', value: 7.5, collected: false },
      { id: 'me5-2', number: '2', name: 'Grubbin', image: 'https://images.scrydex.com/pokemon/me5-2/medium', rarity: 'Unknown', variant: 'Normal', value: 3.2, collected: false },
      { id: 'me5-49', number: '49', name: 'Mew ex', image: 'https://images.scrydex.com/pokemon/me5-49/medium', rarity: 'Ultra Rare', variant: 'Normal', value: 9.5, collected: false },
    ],
  },
  {
    id: 'chaos-rising',
    code: 'me4',
    name: 'Chaos Rising',
    language: 'English',
    category: 'English',
    series: 'Mega Evolution',
    releaseDate: '2026-05-22',
    logo: 'https://images.scrydex.com/pokemon/me4-logo/logo',
    color: '#6d28d9',
    type: 'Master',
    totalCards: 3,
    percent: 0,
    cards: [
      { id: 'me4-1', number: '1', name: 'Greninja ex', image: 'https://images.scrydex.com/pokemon/me4-1/medium', rarity: 'Unknown', variant: 'Normal', value: 6.4, collected: false },
      { id: 'me4-2', number: '2', name: 'Pikachu', image: 'https://images.scrydex.com/pokemon/me4-2/medium', rarity: 'Unknown', variant: 'Normal', value: 2.9, collected: false },
      { id: 'me4-30', number: '30', name: 'Gengar ex', image: 'https://images.scrydex.com/pokemon/me4-30/medium', rarity: 'Secret Rare', variant: 'Full Art', value: 14.2, collected: false },
    ],
  },
  {
    id: 'perfect-order',
    code: 'me3',
    name: 'Perfect Order',
    language: 'English',
    category: 'English',
    series: 'Mega Evolution',
    releaseDate: '2026-03-27',
    logo: 'https://images.scrydex.com/pokemon/me3-logo/logo',
    color: '#6d28d9',
    type: 'Master',
    totalCards: 3,
    percent: 0,
    cards: [
      { id: 'me3-1', number: '1', name: 'Feraligatr ex', image: 'https://images.scrydex.com/pokemon/me3-1/medium', rarity: 'Unknown', variant: 'Normal', value: 8.1, collected: false },
      { id: 'me3-5', number: '5', name: 'Miraidon ex', image: 'https://images.scrydex.com/pokemon/me3-5/medium', rarity: 'Reverse Holo', variant: 'Reverse Holo', value: 11.4, collected: false },
      { id: 'me3-9', number: '9', name: 'Xatu', image: 'https://images.scrydex.com/pokemon/me3-9/medium', rarity: 'Unknown', variant: 'Normal', value: 2.1, collected: false },
    ],
  },
  {
    id: 'storm-emeralda',
    code: 'm6_ja',
    name: 'Storm Emeralda',
    language: 'Japanese',
    category: 'Japanese',
    series: 'Mega Evolution',
    releaseDate: '2026-07-31',
    logo: 'https://images.scrydex.com/pokemon/m6_ja-logo/logo',
    color: '#14b8a6',
    type: 'Master',
    totalCards: 3,
    percent: 0,
    cards: [
      { id: 'm6_ja-1', number: '1', name: 'グレイシア', image: 'https://images.scrydex.com/pokemon/m6_ja-1/medium', rarity: 'Unknown', variant: 'Normal', value: 8.7, collected: false },
      { id: 'm6_ja-2', number: '2', name: 'ツルギ', image: 'https://images.scrydex.com/pokemon/m6_ja-2/medium', rarity: 'Unknown', variant: 'Reverse Holo', value: 10.5, collected: false },
      { id: 'm6_ja-9', number: '9', name: 'メガザル', image: 'https://images.scrydex.com/pokemon/m6_ja-9/medium', rarity: 'Ultra Rare', variant: 'Secret Rare', value: 15.0, collected: false },
    ],
  },
  {
    id: 'abyss-eye',
    code: 'm5_ja',
    name: 'Abyss Eye',
    language: 'Japanese',
    category: 'Japanese',
    series: 'Mega Evolution',
    releaseDate: '2026-05-22',
    logo: 'https://images.scrydex.com/pokemon/m5_ja-logo/logo',
    color: '#14b8a6',
    type: 'Master',
    totalCards: 3,
    percent: 0,
    cards: [
      { id: 'm5_ja-1', number: '1', name: 'いわなみ', image: 'https://images.scrydex.com/pokemon/m5_ja-1/medium', rarity: 'Unknown', variant: 'Normal', value: 4.8, collected: false },
      { id: 'm5_ja-10', number: '10', name: 'シズク', image: 'https://images.scrydex.com/pokemon/m5_ja-10/medium', rarity: 'Reverse Holo', variant: 'Reverse Holo', value: 9.4, collected: false },
      { id: 'm5_ja-20', number: '20', name: 'ディンガ', image: 'https://images.scrydex.com/pokemon/m5_ja-20/medium', rarity: 'Ultra Rare', variant: 'Full Art', value: 12.2, collected: false },
    ],
  },
  {
    id: 'everyday-wonders',
    code: 'tcgp-B3b',
    name: 'Everyday Wonders',
    language: 'Pocket Expansion',
    category: 'Pocket Expansion',
    series: 'Pokémon TCG Pocket',
    releaseDate: '2026-06-29',
    logo: 'https://images.scrydex.com/pokemon/tcgp-B3b-logo/logo',
    color: '#f59e0b',
    type: 'Pocket Expansion',
    totalCards: 3,
    percent: 0,
    cards: [
      { id: 'tcgp-B3b-1', number: '1', name: 'Pikachu', image: 'https://images.scrydex.com/pokemon/tcgp-B3b-1/medium', rarity: 'Normal', variant: 'Normal', value: 1.8, collected: false },
      { id: 'tcgp-B3b-2', number: '2', name: 'Pichu', image: 'https://images.scrydex.com/pokemon/tcgp-B3b-2/medium', rarity: 'Reverse Holo', variant: 'Reverse Holo', value: 2.6, collected: false },
      { id: 'tcgp-B3b-14', number: '14', name: 'Mew', image: 'https://images.scrydex.com/pokemon/tcgp-B3b-14/medium', rarity: 'Ultra Rare', variant: 'Full Art', value: 6.9, collected: false },
    ],
  },
  {
    id: 'pulsing-aura',
    code: 'tcgp-B3',
    name: 'Pulsing Aura',
    language: 'Pocket Expansion',
    category: 'Pocket Expansion',
    series: 'Pokémon TCG Pocket',
    releaseDate: '2026-04-27',
    logo: 'https://images.scrydex.com/pokemon/tcgp-B3-logo/logo',
    color: '#f59e0b',
    type: 'Pocket Expansion',
    totalCards: 3,
    percent: 0,
    cards: [
      { id: 'tcgp-B3-1', number: '1', name: 'Lucario', image: 'https://images.scrydex.com/pokemon/tcgp-B3-1/medium', rarity: 'Normal', variant: 'Normal', value: 2.4, collected: false },
      { id: 'tcgp-B3-12', number: '12', name: 'Mewtwo', image: 'https://images.scrydex.com/pokemon/tcgp-B3-12/medium', rarity: 'Reverse Holo', variant: 'Reverse Holo', value: 4.3, collected: false },
      { id: 'tcgp-B3-25', number: '25', name: 'Gardevoir', image: 'https://images.scrydex.com/pokemon/tcgp-B3-25/medium', rarity: 'Ultra Rare', variant: 'Full Art', value: 7.8, collected: false },
    ],
  },
  {
    id: 'mega-shine',
    code: 'tcgp-B2b',
    name: 'Mega Shine',
    language: 'Pocket Expansion',
    category: 'Pocket Expansion',
    series: 'Pokémon TCG Pocket',
    releaseDate: '2026-03-25',
    logo: 'https://images.scrydex.com/pokemon/tcgp-B2b-logo/logo',
    color: '#f59e0b',
    type: 'Pocket Expansion',
    totalCards: 3,
    percent: 0,
    cards: [
      { id: 'tcgp-B2b-1', number: '1', name: 'Blastoise', image: 'https://images.scrydex.com/pokemon/tcgp-B2b-1/medium', rarity: 'Normal', variant: 'Normal', value: 2.1, collected: false },
      { id: 'tcgp-B2b-7', number: '7', name: 'Charizard', image: 'https://images.scrydex.com/pokemon/tcgp-B2b-7/medium', rarity: 'Reverse Holo', variant: 'Reverse Holo', value: 5.1, collected: false },
      { id: 'tcgp-B2b-20', number: '20', name: 'Venusaur', image: 'https://images.scrydex.com/pokemon/tcgp-B2b-20/medium', rarity: 'Ultra Rare', variant: 'Full Art', value: 6.8, collected: false },
    ],
  },
];

const detectSetCategory = (set = {}) => {
  const categoryHint = String(set.category || set.type || set.language || '').toLowerCase();
  const urlHint = String(set.url || set.href || set.sourceUrl || '').toLowerCase();
  const idHint = String(set.id || set.code || '').toLowerCase();
  const label = `${set.language || ''} ${set.name || ''} ${set.series || ''}`.toLowerCase();

  if (/japanese|jp|ja/i.test(categoryHint) || /\/pokemon\/jp\//i.test(urlHint) || /(?:^|_)(?:ja|jp)(?:$|_)/i.test(idHint) || /(?:^|_)(?:ja|jp)(?:$|_)/i.test(label)) {
    return 'Japanese';
  }

  if (/pocket|pocket expansion|tcg-pocket/i.test(categoryHint) || /\/pokemon\/tcg-pocket\//i.test(urlHint) || /tcgp-|pocket/i.test(idHint) || /tcgp-|pocket/i.test(label)) {
    return 'Pocket Expansion';
  }

  return 'English';
};

const rawSets = Array.isArray(setsData.sets) && setsData.sets.length ? setsData.sets : fallbackSets;
const englishSetsData = rawSets.filter((set) => detectSetCategory(set) === 'English');
const japaneseSetsData = rawSets.filter((set) => detectSetCategory(set) === 'Japanese');
const pocketExpansionSetsData = rawSets.filter((set) => detectSetCategory(set) === 'Pocket Expansion');

const makeVariantList = (card, set) => {
  const baseVariants = [
    card.variant || 'Normal',
    'Holo',
    'Reverse Holo',
    'Full Art',
    'Secret Rare',
  ];

  const uniqueVariants = [...new Set(baseVariants.map((variant) => variant.trim()).filter(Boolean))];

  return uniqueVariants.map((variantName, index) => ({
    id: `${card.id}-${variantName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`,
    cardId: card.id,
    setId: set.id,
    setName: set.name,
    label: variantName,
    number: `${card.number || index + 1}`,
    image: card.image || set.logo,
    variant: variantName,
    rarity: card.rarity || 'Unknown',
  }));
};

const cardNumberValue = (value) => {
  const match = String(value ?? '').match(/\d+/);
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
};

const formatCardNumber = (value) => {
  const numeric = Number(cardNumberValue(value));
  if (!Number.isFinite(numeric)) return '001';
  return String(Math.max(1, numeric)).padStart(3, '0');
};

const sortCardsByNumber = (cards = []) => [...cards].sort((a, b) => {
  const aNumber = cardNumberValue(a?.number ?? a?.id ?? 0);
  const bNumber = cardNumberValue(b?.number ?? b?.id ?? 0);

  if (aNumber !== bNumber) {
    return aNumber - bNumber;
  }

  return String(a?.name || '').localeCompare(String(b?.name || ''));
});

const normalizeCard = (set, card, index) => {
  const rarity = String(card.rarity || 'Unknown');
  const variant = String(card.variant || 'Normal');
  const isPromo = Boolean(card.isPromo || /promo|event|special/i.test(rarity) || /promo|event|special/i.test(String(card.category || '')) || /promo|event|special/i.test(String(card.type || '')));
  const isSpecialEvent = Boolean(card.isSpecialEvent || /event|special/i.test(String(card.name || '')) || /event|special/i.test(String(card.series || '')));

  const normalizedCard = {
    ...card,
    id: String(card.id || `${set.id}-${index + 1}`),
    number: formatCardNumber(card.number || `${index + 1}`),
    name: String(card.name || `Card ${index + 1}`),
    image: String(card.image || set.logo),
    rarity,
    variant,
    value: Number.isFinite(Number(card.value)) ? Number(card.value) : 0,
    collected: Boolean(card.collected),
    isPromo,
    isSpecialEvent,
    setId: set.id,
    setName: set.name,
    language: set.language || 'English',
  };

  return {
    ...normalizedCard,
    variants: makeVariantList(normalizedCard, set),
  };
};

const normalizeSet = (set) => {
  const explicitCards = sortCardsByNumber((set.cards || []).map((card, index) => normalizeCard(set, card, index)));
  const totalCards = Number(set.totalCards || explicitCards.length || 0);

  const cards = [...explicitCards];
  while (cards.length < totalCards) {
    const sourceCard = cards[cards.length % Math.max(explicitCards.length, 1)] || explicitCards[0] || {
      id: `${set.id}-${cards.length + 1}`,
      name: `Card ${cards.length + 1}`,
      image: set.logo,
      value: 0,
      rarity: 'Unknown',
      variant: 'Normal',
      collected: false,
    };

    cards.push({
      ...normalizeCard(set, sourceCard, cards.length),
      id: `${set.id}-${cards.length + 1}`,
      number: String(cards.length + 1),
      name: `Card ${cards.length + 1}`,
      image: String(sourceCard.image || set.logo),
      variant: String(sourceCard.variant || 'Normal'),
      collected: false,
    });
  }

  const category = detectSetCategory(set);

  return {
    ...set,
    id: String(set.id),
    code: String(set.code || set.id),
    name: String(set.name),
    series: String(set.series || 'Mega Evolution'),
    language: String(set.language || category),
    category,
    releaseDate: String(set.releaseDate || '2025-01-01'),
    logo: String(set.logo || 'https://images.scrydex.com/pokemon/me5-logo/logo'),
    color: String(set.color || '#6d28d9'),
    type: String(set.type || 'Master'),
    totalCards,
    percent: Number(set.percent || 0),
    cards: sortCardsByNumber(cards.slice(0, totalCards)),
  };
};

const sortSetsByNewest = (list) =>
  [...list].sort((a, b) => {
    const aTime = new Date(a.releaseDate).getTime();
    const bTime = new Date(b.releaseDate).getTime();

    if (!Number.isNaN(aTime) && !Number.isNaN(bTime) && aTime !== bTime) {
      return bTime - aTime;
    }

    const aOrder = Number(a.order ?? a.index ?? Number.MAX_SAFE_INTEGER);
    const bOrder = Number(b.order ?? b.index ?? Number.MAX_SAFE_INTEGER);
    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }

    return String(a.name || '').localeCompare(String(b.name || ''));
  });

const englishSets = englishSetsData.map(normalizeSet);
const japaneseSets = japaneseSetsData.map(normalizeSet);
const pocketExpansionSets = pocketExpansionSetsData.map(normalizeSet);

export const ENGLISH_SETS = sortSetsByNewest(englishSets);
export const JAPANESE_SETS = sortSetsByNewest(japaneseSets);
export const POCKET_EXPANSION_SETS = sortSetsByNewest(pocketExpansionSets);
export const SETS_BY_CATEGORY = {
  English: ENGLISH_SETS,
  Japanese: JAPANESE_SETS,
  'Pocket Expansion': POCKET_EXPANSION_SETS,
};
export const SETS = [...ENGLISH_SETS, ...JAPANESE_SETS, ...POCKET_EXPANSION_SETS];
export const SETS_BY_ID = Object.fromEntries(SETS.map((set) => [set.id, set]));
export const CARD_LIBRARY = SETS.flatMap((set) => set.cards);
export const CARD_LIBRARY_BY_ID = Object.fromEntries(CARD_LIBRARY.map((card) => [card.id, card]));

export const getSetById = (setId, fallback = SETS[0]) => SETS_BY_ID[setId] || fallback;
export const getCardById = (cardId, fallback = CARD_LIBRARY[0]) => CARD_LIBRARY_BY_ID[cardId] || fallback;
export const getCardsForSet = (setId) => (SETS_BY_ID[setId]?.cards || []);
export const getCardVariants = (cardId) => {
  const card = CARD_LIBRARY_BY_ID[cardId];
  if (!card) return [];
  return card.variants || makeVariantList(card, SETS_BY_ID[card.setId] || SETS[0] || { id: 'unknown', name: 'Unknown Set', logo: card.image });
};

export const PROFILE = {
  name: 'Elena',
  since: 'Since May 2024',
  avatar: 'https://images.scrydex.com/pokemon/me5-logo/logo',
  stats: {
    cards: 0,
    binders: 0,
    sets: SETS.length,
    wishlist: 0,
  },
  preferences: {
    theme: 'Dark',
    language: 'English',
  },
};

export const BINDERS = [];

export const PITCH_BLACK_CARDS = getCardsForSet(SETS[0]?.id || 'pitch-black');
export const CARD_DETAIL = getCardById(SETS[0]?.cards?.[0]?.id || 'me5-49') || {
  id: 'me5-49',
  name: 'Mew ex',
  number: '49',
  rarity: 'Ultra Rare',
  image: 'https://images.scrydex.com/pokemon/me5-49/medium',
  collected: false,
  value: 9.5,
  setId: 'pitch-black',
  setName: 'Pitch Black',
  language: 'English',
  variants: [
    { id: 'me5-49-normal', label: 'Normal', number: '49', image: 'https://images.scrydex.com/pokemon/me5-49/medium' },
    { id: 'me5-49-holo', label: 'Holo', number: '49', image: 'https://images.scrydex.com/pokemon/me5-49/medium' },
    { id: 'me5-49-reverse', label: 'Reverse Holo', number: '49', image: 'https://images.scrydex.com/pokemon/me5-49/medium' },
  ],
};

export const WISHLIST = [];

export const HOME_STACK_CARDS = {
  left: CARD_LIBRARY[0]?.image || 'https://images.scrydex.com/pokemon/me5-1/medium',
  center: CARD_LIBRARY[1]?.image || 'https://images.scrydex.com/pokemon/me5-49/medium',
  right: CARD_LIBRARY[2]?.image || 'https://images.scrydex.com/pokemon/me5-61/medium',
};

export default {
  PROFILE,
  SETS,
  ENGLISH_SETS,
  JAPANESE_SETS,
  POCKET_EXPANSION_SETS,
  SETS_BY_CATEGORY,
  BINDERS,
  PITCH_BLACK_CARDS,
  CARD_DETAIL,
  WISHLIST,
  HOME_STACK_CARDS,
  getSetById,
  getCardById,
  getCardsForSet,
};
