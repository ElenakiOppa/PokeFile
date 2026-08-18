import { mergeBooleanFact } from './canonicalFacts.js';

const normalizedNumber = (value) => String(Number.parseInt(String(value), 10));
const normalizeVariantName = (value) => String(value || '')
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '') || 'normal';
const uniqueByKey = (records) => {
  const seen = new Set();
  return records.filter((record) => {
    const key = record.collectibleKey || record.id;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
const finishFactKey = (variantKey) => ({
  normal: 'normal',
  holofoil: 'holo',
  reverseHolofoil: 'reverse',
  firstEdition: 'firstEdition',
}[variantKey] || null);

export const canonicalFinishKey = (value, fallback = 'normal') => {
  const normalized = normalizeVariantName(value || fallback);
  if (!normalized || normalized === 'normal') return 'normal';
  if (normalized.includes('reverse') || normalized.includes('reverse-holo') || normalized.includes('reverseholo')) return 'reverse';
  if (normalized.includes('holo')) return 'holo';
  if (normalized.includes('first') && normalized.includes('edition')) return 'firstEdition';
  return normalized;
};

export const canonicalizeAliasKey = ({ setId, number, finish, sourceVariantId }) => {
  const baseSetId = String(setId || '').trim();
  const baseNumber = String(number ?? '').trim().replace(/^0+/, '') || '0';
  const finishKey = canonicalFinishKey(finish, 'normal');
  const source = normalizeVariantName(sourceVariantId || '');
  const variant = finishKey === 'normal' ? 'normal' : finishKey;
  const physicalKey = `${baseSetId}-${baseNumber}:${variant}`;
  if (!source || source === variant) return physicalKey;
  return `${physicalKey}-${source}`;
};

export const reconcileCanonicalProviderSet = ({ scrydex, tcgdex, curated = {} }) => {
  const setId = String(scrydex?.providerSetId || tcgdex?.providerSetId || curated?.setId || 'unknown');
  const numbers = [...new Set([
    ...(scrydex?.cards || []).map((card) => normalizedNumber(card.localId || card.number || card.id)),
    ...(tcgdex?.cards || []).map((card) => normalizedNumber(card.localId || card.number || card.id)),
  ])].sort((a, b) => Number(a) - Number(b));

  const cards = numbers.map((number) => {
    const scrydexCard = (scrydex?.cards || []).find((card) => normalizedNumber(card.localId || card.number || card.id) === number);
    const tcgdexCard = (tcgdex?.cards || []).find((card) => normalizedNumber(card.localId || card.number || card.id) === number);
    const providerAliases = [
      ...(scrydexCard ? [{ provider: 'scrydex', id: scrydexCard.providerId || scrydexCard.id, source: 'scrydex' }] : []),
      ...(tcgdexCard ? [{ provider: 'tcgdex', id: tcgdexCard.providerId || tcgdexCard.id, source: 'tcgdex' }] : []),
    ];
    const variantInventory = Array.isArray(tcgdexCard?.variantsDetailed)
      ? tcgdexCard.variantsDetailed.map((variant) => {
          const finish = canonicalFinishKey(variant?.type || variant?.variant || variant?.label || 'normal');
          return {
            canonicalCardId: `${setId}-${number}`,
            cardNumber: number,
            finish,
            collectibleKey: canonicalizeAliasKey({
              setId,
              number,
              finish,
              sourceVariantId: variant?.variantId || variant?.id || `${tcgdexCard.providerId || tcgdexCard.id}:${finish}`,
            }),
            providerVariantId: variant?.variantId || variant?.id || null,
            provider: 'tcgdex',
            source: 'tcgdex',
            image: variant?.image || tcgdexCard?.image || null,
            variantType: finish,
          };
        })
      : [{
          canonicalCardId: `${setId}-${number}`,
          cardNumber: number,
          finish: 'normal',
          collectibleKey: canonicalizeAliasKey({ setId, number, finish: 'normal', sourceVariantId: tcgdexCard?.providerId || tcgdexCard?.id || `${setId}-${number}:normal` }),
          providerVariantId: tcgdexCard?.providerId || tcgdexCard?.id || null,
          provider: 'tcgdex',
          source: 'tcgdex',
          image: tcgdexCard?.image || null,
          variantType: 'normal',
        }];

    return {
      canonicalCardId: `${setId}-${number}`,
      number,
      name: scrydexCard?.name || tcgdexCard?.name || 'Unknown',
      aliases: providerAliases,
      physicalCollectibles: variantInventory,
      masterChecklist: variantInventory.filter((variant) => variant.finish !== 'reverse').map((variant) => ({
        ...variant,
        baseCardId: `${setId}-${number}`,
        sourceProvider: 'tcgdex',
      })),
    };
  });

  const masterChecklist = uniqueByKey(
    cards.flatMap((card) => card.masterChecklist).filter(Boolean),
  );
  const grandmasterChecklist = uniqueByKey(
    (curated.records || []).map((record) => ({
      ...record,
      collectibleKey: String(record.collectibleKey || record.id || `${record.cardId || 'curated'}:${record.finish || record.variant || 'normal'}`),
      baseCardId: String(record.cardId || record.baseCardId || record.id || 'curated'),
      sourceProvider: record.sourceProvider || 'curated',
    })),
  );

  return {
    canonicalSetId: setId,
    providerSetIds: {
      scrydex: scrydex?.providerSetId || null,
      tcgdex: tcgdex?.providerSetId || null,
    },
    cards,
    masterChecklist,
    grandmasterChecklist,
    rawVariantInventory: cards.flatMap((card) => card.physicalCollectibles),
    aliasIndex: cards.flatMap((card) => card.aliases.map((alias) => ({
      canonicalCardId: card.canonicalCardId,
      ...alias,
    }))),
    canonicalSet: {
      id: setId,
      providerSetIds: {
        scrydex: scrydex?.providerSetId || null,
        tcgdex: tcgdex?.providerSetId || null,
      },
      baseCards: cards,
      masterCards: masterChecklist,
      grandmasterCards: grandmasterChecklist,
    },
  };
};

export const combineProviderSets = ({ scrydex, tcgdex, curated = {} }) => {
  const scrydexByNumber = Object.fromEntries(scrydex.cards.map((card) => [normalizedNumber(card.localId), card]));
  const tcgdexByNumber = Object.fromEntries(tcgdex.cards.map((card) => [normalizedNumber(card.localId), card]));
  const numbers = [...new Set([...Object.keys(scrydexByNumber), ...Object.keys(tcgdexByNumber)])]
    .sort((a, b) => Number(a) - Number(b));
  const overrides = curated.variantAvailabilityOverrides || [];

  const cards = numbers.map((number) => {
    const scrydexCard = scrydexByNumber[number];
    const tcgdexCard = tcgdexByNumber[number];
    const facts = {};
    ['normal', 'holo', 'reverse', 'firstEdition'].forEach((variant) => {
      const sources = [];
      if (scrydexCard?.variants[variant] === true) sources.push({ provider: 'scrydex', id: scrydexCard.providerId, value: true });
      if (tcgdexCard?.variants[variant] === true) sources.push({ provider: 'tcgdex', id: tcgdexCard.providerId, value: true });
      const override = overrides.find((item) => normalizedNumber(item.number) === number && item.variant === variant);
      facts[variant] = mergeBooleanFact(sources, override);
    });
    return {
      canonicalCardId: `${scrydex.providerSetId}-${number}`,
      localId: number,
      name: scrydexCard?.name || tcgdexCard?.name || 'Unknown',
      scrydexCard,
      tcgdexCard,
      sources: [scrydexCard, tcgdexCard].filter(Boolean).map((card) => ({ provider: card.provider, id: card.providerId })),
      facts,
    };
  });

  const countFact = (field) => ({
    value: scrydex[field] === tcgdex[field] ? scrydex[field] : null,
    sources: [
      { provider: 'scrydex', id: scrydex.providerSetId, value: scrydex[field] },
      { provider: 'tcgdex', id: tcgdex.providerSetId, value: tcgdex[field] },
    ],
    confidence: scrydex[field] === tcgdex[field] ? 'verified' : 'disputed',
  });
  const officialFact = countFact('officialCount');
  const totalFact = countFact('totalCount');

  const standardCards = cards.map((card) => {
    const records = card.scrydexCard?.records || [];
    const override = curated.canonicalExpansionPrintings?.[`${scrydex.providerSetId}-${card.localId}`];
    const candidates = records.filter((record) => (
      record.variantKey !== 'reverseHolofoil'
      && !record.isPromoOrStamped
      && !/stamp|promo|staff|cosmos/i.test(String(record.variantKey || record.variant || ''))
    ));
    const source = candidates.find((record) => override && record.variantKey === override)
      || (candidates.length === 1 ? candidates[0] : null);
    if (!source) return { ...card, unknownClassification: true };
    const factKey = finishFactKey(source.variantKey);
    const fact = factKey ? card.facts[factKey] : { sources: [], confidence: 'single-source' };
    return {
      ...source,
      id: source.id,
      collectibleKey: source.id,
      baseCardId: source.cardId,
      finish: source.variant,
      associationType: 'standard-expansion-printing',
      evidence: fact.sources,
      confidence: override ? 'verified' : fact.confidence,
      curatedClassification: Boolean(override),
      releaseStatus: 'released',
    };
  });
  const unknownClassifications = standardCards.filter((record) => record.unknownClassification);
  const completeCards = standardCards.filter((record) => !record.unknownClassification);
  const classificationDisputes = completeCards.filter((record) => {
    const card = cards.find((item) => item.localId === normalizedNumber(record.number));
    const selected = finishFactKey(record.variantKey);
    if (!card || !selected) return false;
    const other = selected === 'holo' ? 'normal' : selected === 'normal' ? 'holo' : null;
    return other
      && card.scrydexCard?.variants[selected] === true
      && card.tcgdexCard?.variants[selected] !== true
      && card.tcgdexCard?.variants[other] === true;
  }).map((record) => ({
    cardId: record.cardId,
    number: record.number,
    name: record.name,
    selectedFinish: record.variant,
    resolvedByCuratedClassification: record.curatedClassification,
  }));
  const baseCards = completeCards.filter((card) => Number(card.number) <= Number(officialFact.value));

  const reverseCards = cards.filter((card) => card.facts.reverse.value === true).map((card) => {
    const source = card.scrydexCard?.records.find((record) => record.variantKey === 'reverseHolofoil');
    return {
      ...(source || {
        id: `${card.canonicalCardId}:reverseHolofoil`,
        cardId: card.canonicalCardId,
        number: card.localId,
        name: card.name,
        image: card.tcgdexCard?.image || null,
        variant: 'Reverse Holofoil',
        variantKey: 'reverseHolofoil',
      }),
      collectibleKey: source?.id || `${card.canonicalCardId}:reverseHolofoil`,
      baseCardId: source?.cardId || card.canonicalCardId,
      finish: 'Reverse Holofoil',
      associationType: 'expansion-parallel-printing',
      evidence: card.facts.reverse.sources,
      confidence: card.facts.reverse.confidence,
      releaseStatus: 'released',
    };
  });
  const masterCards = uniqueByKey([...completeCards, ...reverseCards]);

  const associatedCards = (curated.records || []).map((record) => {
    const number = normalizedNumber(record.number);
    const providerCard = scrydexByNumber[number];
    const matching = providerCard?.records.find((item) => item.id === record.collectibleKey);
    return {
      ...(matching || {}),
      ...record,
      id: record.collectibleKey,
      collectibleKey: record.collectibleKey,
      baseCardId: record.cardId,
      variant: record.finish,
      variantKey: record.collectibleKey.split(':').slice(1).join(':'),
      evidence: [
        ...(matching ? [{ provider: 'scrydex', id: matching.id, value: true }] : []),
        { provider: 'curated', id: record.sourceId, value: true, sourceUrl: record.sourceUrl || null },
      ],
      confidence: record.verified ? 'verified' : 'single-source',
      collectionTier: 'grandmaster',
    };
  });
  const grandmasterCards = uniqueByKey([...masterCards, ...associatedCards]);

  const duplicateKeys = [...masterCards, ...associatedCards].map((record) => record.collectibleKey)
    .filter((key, index, all) => all.indexOf(key) !== index);
  const orphanedAssociations = associatedCards.filter((record) => (
    !cards.some((card) => card.canonicalCardId === record.cardId)
    && !String(record.cardId).startsWith('mep-')
  ));
  const variantCoverage = Object.fromEntries(['normal', 'holo', 'reverse', 'firstEdition'].map((variant) => {
    const both = cards.filter((card) => card.scrydexCard?.variants[variant] === true && card.tcgdexCard?.variants[variant] === true);
    const scrydexOnly = cards.filter((card) => card.scrydexCard?.variants[variant] === true && card.tcgdexCard?.variants[variant] !== true);
    const tcgdexOnly = cards.filter((card) => card.tcgdexCard?.variants[variant] === true && card.scrydexCard?.variants[variant] !== true);
    return [variant, { both, scrydexOnly, tcgdexOnly }];
  }));
  const disputedVariants = cards.flatMap((card) => Object.entries(card.facts)
    .filter(([, fact]) => fact.confidence === 'disputed')
    .map(([variant, fact]) => ({ cardId: card.canonicalCardId, name: card.name, variant, fact })));
  const singleSourceVariants = cards.flatMap((card) => Object.entries(card.facts)
    .filter(([, fact]) => fact.providerConfidence === 'single-source' || (!fact.overridden && fact.confidence === 'single-source'))
    .map(([variant, fact]) => ({ cardId: card.canonicalCardId, name: card.name, variant, fact })));

  return {
    officialFact,
    totalFact,
    cards,
    baseCards,
    completeCards,
    masterCards,
    grandmasterCards,
    associatedCards,
    quality: {
      setCountDiscrepancies: [officialFact, totalFact].filter((fact) => fact.confidence === 'disputed'),
      variantCoverage,
      disputedVariants,
      singleSourceVariants,
      unknownClassifications,
      classificationDisputes,
      curatedOverrides: overrides,
      duplicateKeys,
      orphanedAssociations,
    },
  };
};
