import setsData from "./data/scrydex/sets.json";
import pitchBlackGrandmaster from "./data/curated/pitch-black-grandmaster.json";
import pitchBlackTcgdex from "./data/providers/tcgdex/me05.json";
import chaosRisingTcgdex from "./data/providers/tcgdex/me04.json";
import pokecottageGuides from "./data/providers/pokecottage/set-guides.json";
import { buildCuratedSetRequirements } from "./lib/setRequirements";
import { buildPokecottageRequirements } from "./lib/providers/pokecottageProvider";

const slugKey = (value) =>
  String(value || "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const pokecottageCuratedSet = (set, guide) => {
  if (!guide || set.id !== "me4") return null;
  const canonicalExpansionPrintings = Object.fromEntries(
    ["13", "29", "51", "68", "85"].map((number) => [
      `me4-${number}`,
      "holofoil",
    ]),
  );
  const records = guide.records
    .filter((record) => record.associated)
    .map((record) => {
      const numberMatch = String(record.number).match(/^(?:MEP\s*)?0*(\d+)/i);
      const number = numberMatch?.[1] || String(record.number);
      const isPromo = /^MEP/i.test(String(record.number));
      const cardId = isPromo ? `mep-${number}` : `me4-${number}`;
      const classification = record.classification || "Associated Printing";
      const candidates = (set.cards || []).filter(
        (card) => String(card.cardId) === cardId,
      );
      const matching = candidates.find(
        (card) =>
          slugKey(card.variant).includes(slugKey(classification)) ||
          slugKey(classification).includes(slugKey(card.variant)),
      );
      const base = matching || candidates[0];
      return {
        collectibleKey:
          matching?.id ||
          `${cardId}:pokecottage-${slugKey(classification)}-${record.sourceRow}`,
        cardId,
        number,
        promoNumber: record.number,
        name: record.name,
        finish: classification,
        associationType: slugKey(classification),
        releaseDate: set.releaseDate,
        releaseStatus: "released",
        sourceProvider: "PokéCottage",
        sourceId: `${guide.slug}-row-${record.sourceRow}`,
        sourceUrl: guide.checklistUrl,
        verified: true,
        confidence: "verified",
        image: base?.image || null,
      };
    });
  return {
    setId: set.id,
    verifiedAt: pokecottageGuides.generatedAt,
    canonicalExpansionPrintings,
    variantAvailabilityOverrides: [],
    records,
  };
};

const fallbackSets = [
  {
    id: "pitch-black",
    code: "me5",
    name: "Pitch Black",
    language: "English",
    category: "English",
    series: "Mega Evolution",
    releaseDate: "2026-07-17",
    logo: "https://images.scrydex.com/pokemon/me5-logo/logo",
    color: "#6d28d9",
    type: "Master",
    totalCards: 3,
    percent: 0,
    cards: [
      {
        id: "me5-1",
        number: "1",
        name: "Tropius",
        image: "https://images.scrydex.com/pokemon/me5-1/medium",
        rarity: "Unknown",
        variant: "Normal",
        value: 7.5,
        collected: false,
      },
      {
        id: "me5-2",
        number: "2",
        name: "Grubbin",
        image: "https://images.scrydex.com/pokemon/me5-2/medium",
        rarity: "Unknown",
        variant: "Normal",
        value: 3.2,
        collected: false,
      },
      {
        id: "me5-49",
        number: "49",
        name: "Mew ex",
        image: "https://images.scrydex.com/pokemon/me5-49/medium",
        rarity: "Ultra Rare",
        variant: "Normal",
        value: 9.5,
        collected: false,
      },
    ],
  },
  {
    id: "chaos-rising",
    code: "me4",
    name: "Chaos Rising",
    language: "English",
    category: "English",
    series: "Mega Evolution",
    releaseDate: "2026-05-22",
    logo: "https://images.scrydex.com/pokemon/me4-logo/logo",
    color: "#6d28d9",
    type: "Master",
    totalCards: 3,
    percent: 0,
    cards: [
      {
        id: "me4-1",
        number: "1",
        name: "Greninja ex",
        image: "https://images.scrydex.com/pokemon/me4-1/medium",
        rarity: "Unknown",
        variant: "Normal",
        value: 6.4,
        collected: false,
      },
      {
        id: "me4-2",
        number: "2",
        name: "Pikachu",
        image: "https://images.scrydex.com/pokemon/me4-2/medium",
        rarity: "Unknown",
        variant: "Normal",
        value: 2.9,
        collected: false,
      },
      {
        id: "me4-30",
        number: "30",
        name: "Gengar ex",
        image: "https://images.scrydex.com/pokemon/me4-30/medium",
        rarity: "Secret Rare",
        variant: "Full Art",
        value: 14.2,
        collected: false,
      },
    ],
  },
  {
    id: "perfect-order",
    code: "me3",
    name: "Perfect Order",
    language: "English",
    category: "English",
    series: "Mega Evolution",
    releaseDate: "2026-03-27",
    logo: "https://images.scrydex.com/pokemon/me3-logo/logo",
    color: "#6d28d9",
    type: "Master",
    totalCards: 3,
    percent: 0,
    cards: [
      {
        id: "me3-1",
        number: "1",
        name: "Feraligatr ex",
        image: "https://images.scrydex.com/pokemon/me3-1/medium",
        rarity: "Unknown",
        variant: "Normal",
        value: 8.1,
        collected: false,
      },
      {
        id: "me3-5",
        number: "5",
        name: "Miraidon ex",
        image: "https://images.scrydex.com/pokemon/me3-5/medium",
        rarity: "Reverse Holo",
        variant: "Reverse Holo",
        value: 11.4,
        collected: false,
      },
      {
        id: "me3-9",
        number: "9",
        name: "Xatu",
        image: "https://images.scrydex.com/pokemon/me3-9/medium",
        rarity: "Unknown",
        variant: "Normal",
        value: 2.1,
        collected: false,
      },
    ],
  },
  {
    id: "storm-emeralda",
    code: "m6_ja",
    name: "Storm Emeralda",
    language: "Japanese",
    category: "Japanese",
    series: "Mega Evolution",
    releaseDate: "2026-07-31",
    logo: "https://images.scrydex.com/pokemon/m6_ja-logo/logo",
    color: "#14b8a6",
    type: "Master",
    totalCards: 3,
    percent: 0,
    cards: [
      {
        id: "m6_ja-1",
        number: "1",
        name: "グレイシア",
        image: "https://images.scrydex.com/pokemon/m6_ja-1/medium",
        rarity: "Unknown",
        variant: "Normal",
        value: 8.7,
        collected: false,
      },
      {
        id: "m6_ja-2",
        number: "2",
        name: "ツルギ",
        image: "https://images.scrydex.com/pokemon/m6_ja-2/medium",
        rarity: "Unknown",
        variant: "Reverse Holo",
        value: 10.5,
        collected: false,
      },
      {
        id: "m6_ja-9",
        number: "9",
        name: "メガザル",
        image: "https://images.scrydex.com/pokemon/m6_ja-9/medium",
        rarity: "Ultra Rare",
        variant: "Secret Rare",
        value: 15.0,
        collected: false,
      },
    ],
  },
  {
    id: "abyss-eye",
    code: "m5_ja",
    name: "Abyss Eye",
    language: "Japanese",
    category: "Japanese",
    series: "Mega Evolution",
    releaseDate: "2026-05-22",
    logo: "https://images.scrydex.com/pokemon/m5_ja-logo/logo",
    color: "#14b8a6",
    type: "Master",
    totalCards: 3,
    percent: 0,
    cards: [
      {
        id: "m5_ja-1",
        number: "1",
        name: "いわなみ",
        image: "https://images.scrydex.com/pokemon/m5_ja-1/medium",
        rarity: "Unknown",
        variant: "Normal",
        value: 4.8,
        collected: false,
      },
      {
        id: "m5_ja-10",
        number: "10",
        name: "シズク",
        image: "https://images.scrydex.com/pokemon/m5_ja-10/medium",
        rarity: "Reverse Holo",
        variant: "Reverse Holo",
        value: 9.4,
        collected: false,
      },
      {
        id: "m5_ja-20",
        number: "20",
        name: "ディンガ",
        image: "https://images.scrydex.com/pokemon/m5_ja-20/medium",
        rarity: "Ultra Rare",
        variant: "Full Art",
        value: 12.2,
        collected: false,
      },
    ],
  },
  {
    id: "everyday-wonders",
    code: "tcgp-B3b",
    name: "Everyday Wonders",
    language: "Pocket Expansion",
    category: "Pocket Expansion",
    series: "Pokémon TCG Pocket",
    releaseDate: "2026-06-29",
    logo: "https://images.scrydex.com/pokemon/tcgp-B3b-logo/logo",
    color: "#f59e0b",
    type: "Pocket Expansion",
    totalCards: 3,
    percent: 0,
    cards: [
      {
        id: "tcgp-B3b-1",
        number: "1",
        name: "Pikachu",
        image: "https://images.scrydex.com/pokemon/tcgp-B3b-1/medium",
        rarity: "Normal",
        variant: "Normal",
        value: 1.8,
        collected: false,
      },
      {
        id: "tcgp-B3b-2",
        number: "2",
        name: "Pichu",
        image: "https://images.scrydex.com/pokemon/tcgp-B3b-2/medium",
        rarity: "Reverse Holo",
        variant: "Reverse Holo",
        value: 2.6,
        collected: false,
      },
      {
        id: "tcgp-B3b-14",
        number: "14",
        name: "Mew",
        image: "https://images.scrydex.com/pokemon/tcgp-B3b-14/medium",
        rarity: "Ultra Rare",
        variant: "Full Art",
        value: 6.9,
        collected: false,
      },
    ],
  },
  {
    id: "pulsing-aura",
    code: "tcgp-B3",
    name: "Pulsing Aura",
    language: "Pocket Expansion",
    category: "Pocket Expansion",
    series: "Pokémon TCG Pocket",
    releaseDate: "2026-04-27",
    logo: "https://images.scrydex.com/pokemon/tcgp-B3-logo/logo",
    color: "#f59e0b",
    type: "Pocket Expansion",
    totalCards: 3,
    percent: 0,
    cards: [
      {
        id: "tcgp-B3-1",
        number: "1",
        name: "Lucario",
        image: "https://images.scrydex.com/pokemon/tcgp-B3-1/medium",
        rarity: "Normal",
        variant: "Normal",
        value: 2.4,
        collected: false,
      },
      {
        id: "tcgp-B3-12",
        number: "12",
        name: "Mewtwo",
        image: "https://images.scrydex.com/pokemon/tcgp-B3-12/medium",
        rarity: "Reverse Holo",
        variant: "Reverse Holo",
        value: 4.3,
        collected: false,
      },
      {
        id: "tcgp-B3-25",
        number: "25",
        name: "Gardevoir",
        image: "https://images.scrydex.com/pokemon/tcgp-B3-25/medium",
        rarity: "Ultra Rare",
        variant: "Full Art",
        value: 7.8,
        collected: false,
      },
    ],
  },
  {
    id: "mega-shine",
    code: "tcgp-B2b",
    name: "Mega Shine",
    language: "Pocket Expansion",
    category: "Pocket Expansion",
    series: "Pokémon TCG Pocket",
    releaseDate: "2026-03-25",
    logo: "https://images.scrydex.com/pokemon/tcgp-B2b-logo/logo",
    color: "#f59e0b",
    type: "Pocket Expansion",
    totalCards: 3,
    percent: 0,
    cards: [
      {
        id: "tcgp-B2b-1",
        number: "1",
        name: "Blastoise",
        image: "https://images.scrydex.com/pokemon/tcgp-B2b-1/medium",
        rarity: "Normal",
        variant: "Normal",
        value: 2.1,
        collected: false,
      },
      {
        id: "tcgp-B2b-7",
        number: "7",
        name: "Charizard",
        image: "https://images.scrydex.com/pokemon/tcgp-B2b-7/medium",
        rarity: "Reverse Holo",
        variant: "Reverse Holo",
        value: 5.1,
        collected: false,
      },
      {
        id: "tcgp-B2b-20",
        number: "20",
        name: "Venusaur",
        image: "https://images.scrydex.com/pokemon/tcgp-B2b-20/medium",
        rarity: "Ultra Rare",
        variant: "Full Art",
        value: 6.8,
        collected: false,
      },
    ],
  },
];

const detectSetCategory = (set = {}) => {
  const categoryHint = String(
    set.category || set.type || set.language || "",
  ).toLowerCase();
  const urlHint = String(
    set.url || set.href || set.sourceUrl || "",
  ).toLowerCase();
  const idHint = String(set.id || set.code || "").toLowerCase();
  const label =
    `${set.language || ""} ${set.name || ""} ${set.series || ""}`.toLowerCase();

  if (
    /japanese|jp|ja/i.test(categoryHint) ||
    /\/pokemon\/jp\//i.test(urlHint) ||
    /(?:^|_)(?:ja|jp)(?:$|_)/i.test(idHint) ||
    /(?:^|_)(?:ja|jp)(?:$|_)/i.test(label)
  ) {
    return "Japanese";
  }

  if (
    /pocket|pocket expansion|tcg-pocket/i.test(categoryHint) ||
    /\/pokemon\/tcg-pocket\//i.test(urlHint) ||
    /tcgp-|pocket/i.test(idHint) ||
    /tcgp-|pocket/i.test(label)
  ) {
    return "Pocket Expansion";
  }

  return "English";
};

const unavailableSet = {
  id: "data-unavailable",
  code: "unknown",
  name: "Set data unavailable",
  language: "Unknown",
  category: "English",
  series: "Unknown",
  releaseDate: "",
  logo: "",
  color: "#6d28d9",
  type: "Unknown",
  printedTotal: 0,
  totalCards: 0,
  cards: [],
  dataUnavailable: true,
};
const rawSets =
  Array.isArray(setsData.sets) && setsData.sets.length
    ? setsData.sets
    : [unavailableSet];
const englishSetsData = rawSets.filter(
  (set) => detectSetCategory(set) === "English",
);
const japaneseSetsData = rawSets.filter(
  (set) => detectSetCategory(set) === "Japanese",
);
const pocketExpansionSetsData = rawSets.filter(
  (set) => detectSetCategory(set) === "Pocket Expansion",
);

const makeVariantList = (card, set) => {
  const sourceVariants =
    Array.isArray(card.variants) && card.variants.length
      ? card.variants
      : [card];
  return sourceVariants.map((entry) => ({
    ...entry,
    id: String(entry.id || card.id),
    cardId: String(entry.cardId || card.cardId || card.id),
    setId: set.id,
    setName: set.name,
    label: String(entry.label || entry.variant || card.variant || "Normal"),
    number: String(entry.number || card.number || ""),
    image: String(entry.image || card.image || set.logo),
    variant: String(entry.variant || card.variant || "Normal"),
    rarity: String(entry.rarity || card.rarity || "Unknown"),
  }));
};

const cardNumberValue = (value) => {
  const match = String(value ?? "").match(/\d+/);
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
};

const formatCardNumber = (value) => {
  const numeric = Number(cardNumberValue(value));
  if (!Number.isFinite(numeric)) return "001";
  return String(Math.max(1, numeric)).padStart(3, "0");
};

const cardVariantRank = (card = {}) => {
  const variant = String(card.variantKey || card.variant || "").toLowerCase();
  if (variant === "normal") return 0;
  if (variant === "holofoil" || variant === "holo") return 1;
  if (
    variant === "reverseholofoil" ||
    variant === "reverse holofoil" ||
    variant === "reverse holo"
  )
    return 2;
  if (/pok[eé] ball/.test(variant)) return 3;
  if (/master ball/.test(variant)) return 4;
  if (card.isPromoOrStamped || /stamp|promo|staff|league|event/.test(variant))
    return 100;
  return 10;
};

const sortCardsByNumber = (cards = []) =>
  [...cards].sort((a, b) => {
    const aNumber = cardNumberValue(a?.number ?? a?.id ?? 0);
    const bNumber = cardNumberValue(b?.number ?? b?.id ?? 0);

    if (aNumber !== bNumber) {
      return aNumber - bNumber;
    }

    const variantDifference = cardVariantRank(a) - cardVariantRank(b);
    if (variantDifference !== 0) {
      return variantDifference;
    }

    const sourceDifference =
      Number(a?.sourceOrder ?? Number.MAX_SAFE_INTEGER) -
      Number(b?.sourceOrder ?? Number.MAX_SAFE_INTEGER);
    if (sourceDifference !== 0) {
      return sourceDifference;
    }

    return String(a?.name || "").localeCompare(String(b?.name || ""));
  });

const normalizeCard = (set, card, index) => {
  const rarity = String(card.rarity || "Unknown");
  const variant = String(card.variant || "Normal");
  const isPromo = Boolean(
    card.isPromo ||
    /promo|event|special/i.test(rarity) ||
    /promo|event|special/i.test(String(card.category || "")) ||
    /promo|event|special/i.test(String(card.type || "")),
  );
  const isSpecialEvent = Boolean(
    card.isSpecialEvent ||
    /event|special/i.test(String(card.name || "")) ||
    /event|special/i.test(String(card.series || "")),
  );

  const normalizedCard = {
    ...card,
    id: String(card.id || `${set.id}-${index + 1}`),
    number: formatCardNumber(card.number || `${index + 1}`),
    name: String(card.name || `Card ${index + 1}`),
    image: card.image ? String(card.image) : null,
    rarity,
    variant,
    value: Number.isFinite(Number(card.value)) ? Number(card.value) : 0,
    priceTimestamp: card.priceTimestamp || setsData.generatedAt || null,
    collected: Boolean(card.collected),
    isPromo,
    isSpecialEvent,
    setId: set.id,
    setName: set.name,
    language: set.language || "English",
  };

  return {
    ...normalizedCard,
    variants: makeVariantList(normalizedCard, set),
  };
};

const normalizeSet = (set) => {
  const pokecottageGuide =
    pokecottageGuides.guides.find((guide) => guide.setId === set.id) || null;
  const curatedSet =
    set.id === pitchBlackGrandmaster.setId
      ? pitchBlackGrandmaster
      : pokecottageCuratedSet(set, pokecottageGuide);
  const tcgdexSet =
    set.id === pitchBlackGrandmaster.setId
      ? pitchBlackTcgdex
      : set.id === "me4"
        ? chaosRisingTcgdex
        : null;
  const generationFromDexId = (raw) => {
    const id = Number(Array.isArray(raw) ? raw[0] : raw);
    if (!id) return null;
    return id <= 151
      ? 1
      : id <= 251
        ? 2
        : id <= 386
          ? 3
          : id <= 493
            ? 4
            : id <= 649
              ? 5
              : id <= 721
                ? 6
                : id <= 809
                  ? 7
                  : id <= 905
                    ? 8
                    : 9;
  };
  const tcgdexMetadataByNumber = Object.fromEntries(
    (tcgdexSet?.cards || []).map((card) => [
      String(Number(card.localId)),
      {
        category: card.category,
        illustrator: card.illustrator,
        types: card.types,
        type: card.types?.[0],
        dexId: card.dexId,
        generation: generationFromDexId(card.dexId),
      },
    ]),
  );
  const curatedRequirements =
    buildCuratedSetRequirements(
      set,
      curatedSet,
      { sourceProvider: "Scrydex", verifiedAt: setsData.generatedAt },
      tcgdexSet,
    ) ||
    buildPokecottageRequirements(
      set,
      pokecottageGuide
        ? { ...pokecottageGuide, generatedAt: pokecottageGuides.generatedAt }
        : null,
    );
  const sourceGrandmaster =
    curatedRequirements?.grandmasterCards ||
    (Array.isArray(set.grandmasterCards)
      ? set.grandmasterCards
      : set.cards || []);
  const sourceComplete = Array.isArray(set.completeCards)
    ? set.completeCards
    : curatedRequirements?.completeCards ||
      sourceGrandmaster.filter(
        (card) => !card.collectionTier || card.collectionTier === "complete",
      );
  const sourceMaster = Array.isArray(set.masterCards)
    ? set.masterCards
    : curatedRequirements?.masterCards ||
      sourceGrandmaster.filter((card) => card.collectionTier !== "grandmaster");
  const sourceBase =
    curatedRequirements?.baseCards ||
    sourceComplete.filter(
      (card) =>
        Number.parseInt(card.number, 10) <= Number(set.printedTotal || 0),
    );
  const variantsByCardId = sourceGrandmaster.reduce((groups, card) => {
    const key = String(card.cardId || card.id || "");
    if (!groups[key]) groups[key] = [];
    groups[key].push(card);
    return groups;
  }, {});
  const normalizeTier = (list = []) =>
    sortCardsByNumber(
      list.map((card, index) =>
        normalizeCard(
          set,
          {
            ...tcgdexMetadataByNumber[String(Number.parseInt(card.number, 10))],
            ...card,
            variants: variantsByCardId[
              String(card.cardId || card.id || "")
            ] || [card],
          },
          index,
        ),
      ),
    );
  const explicitCards = normalizeTier(sourceComplete);
  const baseCards = normalizeTier(sourceBase);
  const masterCards = normalizeTier(sourceMaster);
  const grandmasterCards = normalizeTier(sourceGrandmaster);
  const grandmasterReleasedTotal = grandmasterCards.filter((card) => {
    if (card.releaseStatus === "upcoming" || card.releaseStatus === "announced")
      return false;
    return (
      !card.releaseDate || new Date(card.releaseDate).getTime() <= Date.now()
    );
  }).length;
  const totalCards = Number(set.totalCards || explicitCards.length || 0);
  const apiCompleteTotal = new Set(
    sourceGrandmaster.map(
      (card) => String(card.cardId || card.id).split(":")[0],
    ),
  ).size;

  // Never pad an incomplete source response with invented cards. The declared
  // total remains useful metadata, but checklist requirements only use records
  // that actually exist in the verified/curated source data.
  const cards = [...explicitCards];

  const category = detectSetCategory(set);

  return {
    ...set,
    id: String(set.id),
    code: String(set.code || set.id),
    name: String(set.name),
    series: String(set.series || "Mega Evolution"),
    language: String(set.language || category),
    category,
    releaseDate: String(set.releaseDate || "2025-01-01"),
    logo: String(
      set.logo || "https://images.scrydex.com/pokemon/me5-logo/logo",
    ),
    color: String(set.color || "#6d28d9"),
    type: String(set.type || "Master"),
    totalCards,
    baseTotal: baseCards.length,
    completeTotal: curatedRequirements
      ? explicitCards.length
      : apiCompleteTotal,
    masterTotal: curatedRequirements
      ? masterCards.length
      : Number(pokecottageGuide?.masterPublished || masterCards.length),
    grandmasterTotal: curatedRequirements
      ? grandmasterCards.length
      : pokecottageGuide?.grandmasterPublished
        ? Number(pokecottageGuide.grandmasterPublished)
        : null,
    grandmasterAvailable: Boolean(pokecottageGuide?.grandmasterPublished),
    availableTiers: pokecottageGuide?.grandmasterPublished
      ? ["complete", "master", "grandmaster"]
      : ["complete", "master"],
    pokecottageGuide: pokecottageGuide
      ? {
          provider: "pokecottage",
          guideUrl: pokecottageGuide.guideUrl,
          checklistUrl: pokecottageGuide.checklistUrl,
          masterPublished: pokecottageGuide.masterPublished,
          grandmasterPublished: pokecottageGuide.grandmasterPublished,
          fetchedAt: pokecottageGuides.generatedAt,
        }
      : null,
    grandmasterReleasedTotal,
    percent: Number(set.percent || 0),
    cards: sortCardsByNumber(cards),
    baseCards,
    completeCards: explicitCards,
    masterCards,
    grandmasterCards,
    providerEvidence: curatedRequirements?.providerEvidence || null,
    dataQuality: curatedRequirements?.quality || null,
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

    return String(a.name || "").localeCompare(String(b.name || ""));
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
  "Pocket Expansion": POCKET_EXPANSION_SETS,
};
export const SETS = [
  ...ENGLISH_SETS,
  ...JAPANESE_SETS,
  ...POCKET_EXPANSION_SETS,
];
export const SETS_BY_ID = Object.fromEntries(SETS.map((set) => [set.id, set]));
export const CARD_LIBRARY = SETS.flatMap(
  (set) => set.grandmasterCards || set.cards,
);
export const CARD_LIBRARY_BY_ID = Object.fromEntries(
  CARD_LIBRARY.map((card) => [card.id, card]),
);

export const getSetById = (setId, fallback = SETS[0]) =>
  SETS_BY_ID[setId] || fallback;
export const getCardById = (cardId, fallback = CARD_LIBRARY[0]) =>
  CARD_LIBRARY_BY_ID[cardId] || fallback;
export const getCardsForSet = (setId) => SETS_BY_ID[setId]?.cards || [];
export const getCardsForSetTier = (setId, tier = "complete") => {
  const set = SETS_BY_ID[setId];
  if (!set) return [];
  if (tier === "base") return set.baseCards || [];
  if (tier === "grandmaster") return set.grandmasterCards || set.cards || [];
  if (tier === "master") return set.masterCards || set.cards || [];
  return set.completeCards || set.cards || [];
};
export const getCardVariants = (cardId) => {
  const card = CARD_LIBRARY_BY_ID[cardId];
  if (!card) return [];
  return (
    card.variants ||
    makeVariantList(
      card,
      SETS_BY_ID[card.setId] ||
        SETS[0] || { id: "unknown", name: "Unknown Set", logo: card.image },
    )
  );
};

export const PROFILE = {
  name: "Elena",
  since: "Since May 2024",
  avatar: "https://images.scrydex.com/pokemon/me5-logo/logo",
  stats: {
    cards: 0,
    binders: 0,
    sets: SETS.length,
    wishlist: 0,
  },
  preferences: {
    theme: "Dark",
    language: "English",
  },
};

export const RARITY_ORDER = [
  "Common",
  "Uncommon",
  "Rare",
  "Rare Holo",
  "Double Rare",
  "ACE SPEC Rare",
  "Amazing Rare",
  "Radiant Rare",
  "Illustration Rare",
  "Trainer Gallery Rare",
  "Shiny Rare",
  "Ultra Rare",
  "Shiny Ultra Rare",
  "Special Illustration Rare",
  "Hyper Rare",
  "Mega Hyper Rare",
  "Rare Rainbow",
  "Secret Rare",
  "Promo",
  "Unknown",
];

export const rarityRank = (rarity) => {
  const normalized = String(rarity || "Unknown")
    .trim()
    .toLowerCase();
  const index = RARITY_ORDER.findIndex(
    (item) => item.toLowerCase() === normalized,
  );
  return index === -1 ? RARITY_ORDER.length - 1 : index;
};

export const BINDERS = [];

export const PITCH_BLACK_CARDS = getCardsForSet(SETS[0]?.id || "pitch-black");
export const CARD_DETAIL = getCardById(SETS[0]?.cards?.[0]?.id || "me5-49") || {
  id: "me5-49",
  name: "Mew ex",
  number: "49",
  rarity: "Ultra Rare",
  image: "https://images.scrydex.com/pokemon/me5-49/medium",
  collected: false,
  value: 9.5,
  setId: "pitch-black",
  setName: "Pitch Black",
  language: "English",
  variants: [
    {
      id: "me5-49-normal",
      label: "Normal",
      number: "49",
      image: "https://images.scrydex.com/pokemon/me5-49/medium",
    },
    {
      id: "me5-49-holo",
      label: "Holo",
      number: "49",
      image: "https://images.scrydex.com/pokemon/me5-49/medium",
    },
    {
      id: "me5-49-reverse",
      label: "Reverse Holo",
      number: "49",
      image: "https://images.scrydex.com/pokemon/me5-49/medium",
    },
  ],
};

export const WISHLIST = [];

export const HOME_STACK_CARDS = {
  left:
    CARD_LIBRARY[0]?.image || "https://images.scrydex.com/pokemon/me5-1/medium",
  center:
    CARD_LIBRARY[1]?.image ||
    "https://images.scrydex.com/pokemon/me5-49/medium",
  right:
    CARD_LIBRARY[2]?.image ||
    "https://images.scrydex.com/pokemon/me5-61/medium",
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
