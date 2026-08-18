import setsData from "./data/scrydex/sets.json";
import pitchBlackGrandmaster from "./data/curated/pitch-black-grandmaster.json";
import pitchBlackTcgdex from "./data/providers/tcgdex/me05.json";
import chaosRisingTcgdex from "./data/providers/tcgdex/me04.json";
import ascendedHeroesTcgdex from "./data/providers/tcgdex/me02.5.json";
import pokecottageGuides from "./data/providers/pokecottage/set-guides.json";
import { buildCuratedSetRequirements } from "./lib/setRequirements";
import { buildPokecottageRequirements } from "./lib/providers/pokecottageProvider";

const slugKey = (value) =>
  String(value || "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const pokecottageCuratedSet = (set, guide) => {
  if (!guide) return null;
  const canonicalExpansionPrintings = Object.fromEntries(
    Object.entries(guide.canonicalExpansionPrintings || {}).map(([cardId, finish]) => [
      String(cardId),
      String(finish),
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

const inferSetSeries = (set = {}) => {
  const supplied = String(set.series || "").trim();
  if (supplied && !/^(other|unknown)$/i.test(supplied)) return supplied;

  const id = String(set.id || set.code || "").toLowerCase().replace(/_ja$/, "");
  const name = String(set.name || "").toLowerCase();

  if (detectSetCategory(set) === "Pocket Expansion") return "Pokémon TCG Pocket";
  if (/^me\d|^me\dpt\d|^mep$|^m\d|^mc$|^mp1$|^m2a$|^mb[gd]$|^m1[sl]$|^ma$|^mp$/.test(id)) return "Mega Evolution";
  if (/^[rz]?sv|^svp$|^sve$|^sv[od]m$/.test(id)) return "Scarlet & Violet";
  if (/^swsh|^pgo$|^cel25/.test(id)) return "Sword & Shield";
  if (/^sm|^smp$|^sma$|^det1$|^tk10/.test(id)) return "Sun & Moon";
  if (/^xy|^xyp$|^g1$|^dc1$|^cp\d|^tk[6789]/.test(id)) return "XY";
  if (/^bw|^bwp$|^dv1$|^tk5/.test(id)) return "Black & White";
  if (/^hgss|^hsp$|^col1$|^tk4/.test(id)) return "HeartGold & SoulSilver";
  if (/^pl/.test(id)) return "Platinum";
  if (/^dp|^dpp$|^tk3/.test(id)) return "Diamond & Pearl";
  if (/^ex|^np$|^tk[12]/.test(id)) return "EX";
  if (/^ecard/.test(id)) return "e-Card";
  if (/^neo/.test(id)) return "Neo";
  if (/^gym/.test(id)) return "Gym";
  if (/^base|^si1$/.test(id)) return "Original Series";
  if (/^pop/.test(id)) return "POP Series";
  if (/^mcd|^cl[vcb]$|^fut20$|^ru1$|^wb1$|^bp$|^misc/.test(id) || /collection|classic/.test(name)) return "Special Collections";

  return "Special Collections";
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

const resolveCardImage = (card, fallbackSet = null) => {
  const candidates = [
    card?.image,
    card?.art,
    card?.imageUrl,
    card?.sourceImage,
    card?.providerImage,
    card?.images?.large,
    card?.images?.small,
    card?.images?.medium,
    card?.images?.hires,
  ];
  const resolved = candidates.find((value) => {
    if (typeof value !== "string") return false;
    const trimmed = value.trim();
    return trimmed.length > 0 && !/^\s*null\s*$/i.test(trimmed) && !/^\s*undefined\s*$/i.test(trimmed);
  });
  if (resolved && typeof resolved === "string") return resolved.trim();
  if (fallbackSet && typeof fallbackSet.logo === "string" && fallbackSet.logo.trim()) {
    return fallbackSet.logo.trim();
  }
  return null;
};

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
    image: resolveCardImage({ ...card, ...entry }, set) || set.logo || "",
    variant: String(entry.variant || card.variant || "Normal"),
    rarity: String(entry.rarity || card.rarity || "Unknown"),
  }));
};

const buildTcgdexRuntimeCard = (set, card, index = 0) => {
  const number = formatCardNumber(card.localId ?? card.number ?? `${index + 1}`);
  const baseId = `${set.id}-${number}`;
  const variantsDetailed = Array.isArray(card.variants_detailed)
    ? card.variants_detailed
    : [];
  const variantRecords = variantsDetailed.length
    ? variantsDetailed.map((variant, variantIndex) => {
        const type = String(variant?.type || "normal").trim();
        const foil = variant?.foil ? String(variant.foil).trim() : "";
        const variantType = /reverse/i.test(type)
          ? "Reverse Holo"
          : /holo/i.test(type)
            ? "Holo"
            : "Normal";
        const label = foil ? `${variantType} (${foil})` : variantType;
        const variantKey = `${type}${foil ? `-${foil}` : ""}`
          .replace(/[^a-z0-9]+/gi, "-")
          .replace(/^-|-$/g, "")
          .toLowerCase() || "normal";
        const variantImage = resolveCardImage({ ...variant, image: variant?.image || card.image }, set) || resolveCardImage(card, set) || set.logo || "";
        return {
          id: `${baseId}:${variantKey}-${variantIndex + 1}`,
          cardId: baseId,
          baseCardId: baseId,
          collectibleKey: `${baseId}:${variantKey}-${variantIndex + 1}`,
          number,
          label,
          variant: label,
          variantKey,
          finish: label,
          image: variantImage,
          rarity: String(card.rarity || "Unknown"),
          setId: set.id,
          setName: set.name,
          source: "tcgdex",
          sourceCardId: String(card.id || baseId),
          sourceVariantId: String(variant?.variantId || variant?.id || `${card.id}:${variantKey}`),
          pricing: variant?.pricing || null,
        };
      })
    : [{
        id: `${baseId}:normal`,
        cardId: baseId,
        baseCardId: baseId,
        collectibleKey: `${baseId}:normal`,
        number,
        label: "Normal",
        variant: "Normal",
        variantKey: "normal",
        finish: "Normal",
        image: resolveCardImage(card, set) || set.logo || "",
        rarity: String(card.rarity || "Unknown"),
        setId: set.id,
        setName: set.name,
        source: "tcgdex",
        sourceCardId: String(card.id || baseId),
        sourceVariantId: String(card.id || `${baseId}:normal`),
        pricing: null,
      }];

  return {
    ...card,
    id: baseId,
    cardId: baseId,
    baseCardId: baseId,
    collectibleKey: baseId,
    number,
    name: String(card.name || `Card ${number}`),
    image: resolveCardImage(card, set) || "",
    rarity: String(card.rarity || "Unknown"),
    variant: "Normal",
    finish: "Normal",
    setId: set.id,
    setName: set.name,
    language: set.language || "English",
    variants: variantRecords,
  };
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

const uniqueByCollectibleKey = (cards = []) => {
  const seen = new Set();
  return (cards || []).filter((card) => {
    const key = String(
      card?.collectibleKey ||
        card?.id ||
        card?.cardId ||
        card?.baseCardId ||
        card?.number ||
        "",
    ).trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const variantKeyFromCard = (card = {}) => {
  const variantKey = String(
    card?.variantKey ||
      card?.variant ||
      card?.finish ||
      "",
  )
    .trim()
    .replace(/\s+/g, "")
    .replace(/[^a-zA-Z0-9]/g, "");

  return variantKey && variantKey !== "Unknown" ? variantKey : null;
};

const cardCanonicalKey = (card = {}) => {
  const direct = String(
    card?.collectibleKey ||
      card?.id ||
      card?.cardId ||
      card?.baseCardId ||
      card?.number ||
      "",
  ).trim();

  if (direct && direct !== "undefined") {
    if (direct.includes(":")) return direct;
    const suffix = variantKeyFromCard(card);
    if (suffix) return `${direct}:${suffix}`;
    return direct;
  }

  const setId = String(card?.setId || "");
  const number = String(card?.number || "");
  if (setId && number) return `${setId}:${number}`;
  return String(card?.id || card?.number || "");
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

  const canonicalCollectibleKey = String(
    card.collectibleKey ||
      card.id ||
      `${set.id}-${index + 1}`,
  );
  const canonicalId = String(card.id || canonicalCollectibleKey || `${set.id}-${index + 1}`);
  const normalizedCard = {
    ...card,
    id: canonicalCollectibleKey || canonicalId,
    collectibleKey: canonicalCollectibleKey,
    number: formatCardNumber(card.number || `${index + 1}`),
    name: String(card.name || `Card ${index + 1}`),
    image: card.image ? String(card.image) : null,
    rarity,
    variant,
    value: Number.isFinite(Number(card.value)) ? Number(card.value) : null,
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

const mergeCardMetadata = (primaryCard = {}, fallbackCard = {}) => {
  const primary = primaryCard || {};
  const fallback = fallbackCard || {};
  const mergedValue = Number.isFinite(Number(primary.value))
    ? Number(primary.value)
    : Number.isFinite(Number(fallback.value))
      ? Number(fallback.value)
      : null;

  return {
    ...fallback,
    ...primary,
    collectibleKey: String(
      primary.collectibleKey || fallback.collectibleKey || primary.id || fallback.id || primary.cardId || fallback.cardId || "",
    ),
    id: String(primary.id || fallback.id || primary.collectibleKey || fallback.collectibleKey || primary.cardId || fallback.cardId || ""),
    cardId: String(
      primary.cardId || fallback.cardId || primary.baseCardId || fallback.baseCardId || primary.id || fallback.id || "",
    ),
    baseCardId: String(
      primary.baseCardId || fallback.baseCardId || primary.cardId || fallback.cardId || primary.id || fallback.id || "",
    ),
    number: String(primary.number || fallback.number || ""),
    name: String(primary.name || fallback.name || "Unknown card"),
    image: String(primary.image || fallback.image || ""),
    rarity: String(primary.rarity || fallback.rarity || "Unknown"),
    variant: String(primary.variant || fallback.variant || primary.finish || fallback.finish || "Normal"),
    finish: String(primary.finish || fallback.finish || primary.variant || fallback.variant || "Unknown"),
    value: mergedValue,
    setId: String(primary.setId || fallback.setId || ""),
    setName: String(primary.setName || fallback.setName || ""),
  };
};

const fillMissingFromSource = (primary = [], fallback = []) => {
  const merged = new Map();
  const queue = [...(primary || []), ...(fallback || [])];

  for (const card of queue) {
    const key = cardCanonicalKey(card);
    if (!key) continue;
    const existing = merged.get(key);
    merged.set(key, existing ? mergeCardMetadata(existing, card) : card);
  }

  return Array.from(merged.values()).map((card) => {
    const source = (fallback || []).find(
      (sourceCard) => cardCanonicalKey(sourceCard) === cardCanonicalKey(card),
    );
    return mergeCardMetadata(card, source || {});
  });
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
        : set.id === "me2pt5"
          ? ascendedHeroesTcgdex
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
  const tcgdexRuntimeCards = Array.isArray(tcgdexSet?.cards)
    ? tcgdexSet.cards.map((card, index) => buildTcgdexRuntimeCard(set, card, index))
    : [];
  const tcgdexPhysicalCollectibles = tcgdexRuntimeCards.flatMap((card) =>
    (card.variants || []).map((variant) => ({
      ...variant,
      id: String(variant.id || `${card.id}:${variant.variantKey || "normal"}`),
      collectibleKey: String(variant.collectibleKey || variant.id || `${card.id}:${variant.variantKey || "normal"}`),
      cardId: String(variant.cardId || card.cardId || card.id),
      baseCardId: String(variant.baseCardId || card.baseCardId || card.id),
      number: String(variant.number || card.number || ""),
      name: String(variant.name || card.name || ""),
      image: resolveCardImage({ ...card, ...variant }, set) || set.logo || "",
      rarity: String(variant.rarity || card.rarity || "Unknown"),
      variant: String(variant.variant || variant.label || card.variant || "Normal"),
      variantKey: String(variant.variantKey || variant.label || "normal"),
      finish: String(variant.finish || variant.variant || variant.label || card.finish || "Normal"),
      setId: String(variant.setId || set.id),
      setName: String(variant.setName || set.name),
      source: String(variant.source || "tcgdex"),
      sourceCardId: String(variant.sourceCardId || card.id || ""),
      sourceVariantId: String(variant.sourceVariantId || variant.variantId || ""),
      pricing: variant.pricing || null,
    })),
  );
  const mepMasterRecords = (() => {
    const guideRecords = Array.isArray(pokecottageGuide?.records)
      ? pokecottageGuide.records
      : [];
    return guideRecords
      .filter((record) => /MEP\s*091/i.test(String(record.number || "")) && /Mega Dragonite ex/i.test(String(record.name || "")))
      .map((record) => ({
        id: `mep-091`,
        collectibleKey: `mep-091`,
        cardId: `mep-091`,
        baseCardId: `mep-091`,
        number: String(record.number || "091"),
        name: String(record.name || "Mega Dragonite ex"),
        image: String(record.image || ""),
        rarity: String(record.rarity || "Promo"),
        variant: String(record.finish || "Holo"),
        variantKey: "holo",
        finish: String(record.finish || "Holo"),
        setId: "mep",
        setName: "MEP",
        source: "pokecottage",
        sourceCardId: "mep-091",
        sourceVariantId: "mep-091",
        pricing: null,
      }));
  })();

  if (tcgdexSet && Array.isArray(tcgdexSet.cards) && tcgdexRuntimeCards.length) {
    const cards = sortCardsByNumber(
      tcgdexRuntimeCards.map((card, index) => normalizeCard(
        set,
        {
          ...card,
          variants: Array.isArray(card.variants) ? card.variants : [card],
        },
        index,
      )),
    );
    const masterCards = sortCardsByNumber(
      uniqueByCollectibleKey([
        ...tcgdexPhysicalCollectibles,
        ...mepMasterRecords,
      ]),
    );
    const category = detectSetCategory(set);
    const grandmasterCards = Array.isArray(curatedSet?.records)
      ? sortCardsByNumber(
          uniqueByCollectibleKey(
            curatedSet.records.map((record) => ({
              ...record,
              id: String(record.collectibleKey || `${record.cardId}:${record.finish || "normal"}`),
              collectibleKey: String(record.collectibleKey || `${record.cardId}:${record.finish || "normal"}`),
              cardId: String(record.cardId || record.collectibleKey || ""),
              baseCardId: String(record.cardId || record.collectibleKey || ""),
              setId: String(record.setId || set.id),
              setName: String(record.setName || set.name),
              image: resolveCardImage(record, set) || set.logo || "",
              variant: String(record.finish || record.variant || "Normal"),
              variantKey: String(record.variantKey || record.finish || "normal"),
              finish: String(record.finish || record.variant || "Normal"),
              source: String(record.sourceProvider || "curated"),
              sourceCardId: String(record.sourceId || record.cardId || ""),
              sourceVariantId: String(record.sourceId || record.collectibleKey || ""),
              pricing: record.pricing || null,
            })),
          ),
        )
      : [];

    return {
      ...set,
      id: String(set.id),
      code: String(set.code || set.id),
      name: String(set.name),
      series: inferSetSeries(set),
      language: String(set.language || category),
      category,
      releaseDate: String(set.releaseDate || "2025-01-01"),
      logo: String(set.logo || "https://images.scrydex.com/pokemon/me5-logo/logo"),
      color: String(set.color || "#6d28d9"),
      type: String(set.type || "Master"),
      totalCards: Number(tcgdexSet?.cardCount?.total || cards.length || 0),
      baseTotal: cards.length,
      completeTotal: cards.length,
      masterTotal: masterCards.length,
      grandmasterTotal: grandmasterCards.length,
      grandmasterAvailable: Boolean(grandmasterCards.length),
      availableTiers: grandmasterCards.length ? ["complete", "master", "grandmaster"] : ["complete", "master"],
      pokecottageGuide: pokecottageGuide || null,
      grandmasterReleasedTotal: grandmasterCards.length,
      percent: Number(set.percent || 0),
      cards,
      baseCards: cards,
      completeCards: cards,
      masterCards,
      grandmasterCards,
      physicalCollectibles: tcgdexPhysicalCollectibles,
      providerEvidence: null,
      dataQuality: null,
    };
  }

  const sourceGrandmaster = fillMissingFromSource(
    curatedRequirements?.grandmasterCards ||
      (Array.isArray(set.grandmasterCards)
        ? set.grandmasterCards
        : set.cards || []),
    set.cards || [],
  );
  const sourceComplete = Array.isArray(set.completeCards)
    ? fillMissingFromSource(set.completeCards, set.cards || [])
    : curatedRequirements?.completeCards
      ? fillMissingFromSource(curatedRequirements.completeCards, set.cards || [])
      : fillMissingFromSource(
          sourceGrandmaster.filter(
            (card) => !card.collectionTier || card.collectionTier === "complete",
          ),
          set.cards || [],
        );
  const sourceMaster = Array.isArray(set.masterCards)
    ? fillMissingFromSource(set.masterCards, set.cards || [])
    : curatedRequirements?.masterCards
      ? fillMissingFromSource(curatedRequirements.masterCards, set.cards || [])
      : fillMissingFromSource(
          sourceGrandmaster.filter((card) => card.collectionTier !== "grandmaster"),
          set.cards || [],
        );
  const sourceBase =
    curatedRequirements?.baseCards ||
    fillMissingFromSource(
      sourceComplete.filter(
        (card) =>
          Number.parseInt(card.number, 10) <= Number(set.printedTotal || 0),
      ),
      set.cards || [],
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

  const mergedSetCards = fillMissingFromSource(
    [
      ...sourceGrandmaster,
      ...sourceMaster,
      ...sourceComplete,
      ...sourceBase,
      ...(set.cards || []),
    ],
    set.cards || [],
  );
  const cards = sortCardsByNumber(
    mergedSetCards.map((card, index) =>
      normalizeCard(
        set,
        {
          ...tcgdexMetadataByNumber[String(Number.parseInt(card.number, 10))],
          ...card,
          variants: variantsByCardId[String(card.cardId || card.id || "")] || [card],
        },
        index,
      ),
    ),
  );

  const category = detectSetCategory(set);

  return {
    ...set,
    id: String(set.id),
    code: String(set.code || set.id),
    name: String(set.name),
    series: inferSetSeries(set),
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
const buildCardLibrary = () => {
  const collected = new Map();
  const register = (card) => {
    if (!card) return;
    const keys = [
      card.collectibleKey,
      card.id,
      card.cardId,
      card.baseCardId,
      card.number,
    ].map((value) => String(value || "").trim()).filter(Boolean);
    if (!keys.length) return;
    for (const key of keys) {
      if (!key) continue;
      const existing = collected.get(key);
      if (!existing) collected.set(key, card);
    }
  };
  for (const set of SETS) {
    (set.cards || []).forEach(register);
    (set.baseCards || []).forEach(register);
    (set.completeCards || []).forEach(register);
    (set.masterCards || []).forEach(register);
    (set.grandmasterCards || []).forEach(register);
  }
  return Array.from(collected.values());
};
export const CARD_LIBRARY = buildCardLibrary();
export const CARD_LIBRARY_BY_ID = Object.fromEntries(
  CARD_LIBRARY.filter(Boolean).map((card) => [String(card.id || card.collectibleKey || card.cardId || ""), card]),
);

export const getSetById = (setId, fallback = SETS[0]) =>
  SETS_BY_ID[setId] || fallback;
export const getCardById = (cardId, fallback = CARD_LIBRARY[0]) => {
  const raw = String(cardId || "").trim();
  if (!raw) return fallback;
  const direct = CARD_LIBRARY_BY_ID[raw];
  if (direct) return direct;
  const directCollectible = CARD_LIBRARY.find((card) => {
    const ids = [
      String(card?.collectibleKey || ""),
      String(card?.id || ""),
      String(card?.cardId || ""),
      String(card?.baseCardId || ""),
    ];
    return ids.includes(raw);
  });
  if (directCollectible) return directCollectible;
  const normalized = String(raw).split(":")[0];
  if (!normalized || normalized === raw) return fallback;
  const baseMatch = CARD_LIBRARY.find((card) => {
    const ids = [
      String(card?.collectibleKey || ""),
      String(card?.id || ""),
      String(card?.cardId || ""),
      String(card?.baseCardId || ""),
    ];
    return ids.includes(normalized) || ids.some((id) => id.startsWith(`${normalized}:`));
  });
  return baseMatch || fallback;
};
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
