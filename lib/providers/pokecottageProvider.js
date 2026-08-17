const slug = (value) => String(value || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const numberFrom = (value) => String(value || '').match(/^(?:[A-Z]+\s*)?0*(\d+)/i)?.[1] || String(value || '');
const desiredVariant = (record) => {
  const value = slug(record.finish || record.classification);
  if (value.includes('reverse')) return 'reverseHolofoil';
  if (value === 'holo' || value.includes('holofoil')) return 'holofoil';
  if (value === 'standard' || value.includes('non-holo')) return 'normal';
  if (value.includes('master-ball')) return 'masterBall';
  if (value.includes('poke-ball')) return 'pokeBall';
  return null;
};

export const buildPokecottageRequirements = (set, guide) => {
  if (!set || !guide?.records?.length) return null;
  const sourceByNumber = (set.cards || []).reduce((groups, card) => {
    const key = numberFrom(card.number);
    if (!groups[key]) groups[key] = [];
    groups[key].push(card);
    return groups;
  }, {});
  const usedKeys = new Set();
  const records = guide.records.map((record) => {
    const number = numberFrom(record.number);
    const variantKey = desiredVariant(record);
    const candidates = sourceByNumber[number] || [];
    const source = candidates.find((card) => variantKey && card.variantKey === variantKey && !usedKeys.has(card.id));
    const fallback = candidates.find((card) => !usedKeys.has(card.id));
    const matched = source || fallback;
    const generatedKey = `${set.id}-${number}:pokecottage-${slug(record.classification)}-${record.sourceRow}`;
    const collectibleKey = matched && (source || !record.associated) ? matched.id : generatedKey;
    usedKeys.add(collectibleKey);
    return {
      ...(matched || {}),
      id: collectibleKey,
      collectibleKey,
      cardId: matched?.cardId || `${set.id}-${number}`,
      baseCardId: matched?.cardId || `${set.id}-${number}`,
      number,
      name: record.name,
      rarity: record.rarity || matched?.rarity || 'Unknown',
      variant: record.finish || record.classification || matched?.variant || 'Unknown',
      variantKey: variantKey || `pokecottage-${slug(record.classification)}`,
      finish: record.finish || record.classification || matched?.variant || 'Unknown',
      image: matched?.image || candidates[0]?.image || null,
      value: matched?.value || 0,
      associationType: record.associated ? slug(record.classification) : (variantKey === 'reverseHolofoil' ? 'expansion-parallel-printing' : 'standard-expansion-printing'),
      evidence: [
        ...(matched ? [{ provider: 'scrydex', id: matched.id, value: true }] : []),
        { provider: 'pokecottage', id: `${guide.slug}-row-${record.sourceRow}`, value: true, sourceUrl: guide.checklistUrl },
      ],
      confidence: matched ? 'verified' : 'single-source',
      releaseStatus: 'released',
      sourceUrl: guide.checklistUrl,
    };
  });
  const masterCards = records.filter((record, index) => !guide.records[index].associated);
  const associatedCards = records.filter((record, index) => guide.records[index].associated);
  const standardByNumber = new Map();
  masterCards.forEach((record) => {
    if (record.variantKey === 'reverseHolofoil' || standardByNumber.has(record.number)) return;
    standardByNumber.set(record.number, record);
  });
  const completeCards = [...standardByNumber.values()];
  const official = Number(set.printedTotal || 0);
  return {
    baseCards: completeCards.filter((record) => Number(record.number) <= official),
    completeCards,
    masterCards,
    grandmasterCards: records,
    associatedCards,
    providerEvidence: {
      pokecottageSetId: guide.slug,
      fetchedAt: guide.generatedAt,
      guideUrl: guide.guideUrl,
      checklistUrl: guide.checklistUrl,
    },
    quality: {
      unknownClassifications: records.filter((record) => record.variant === 'Unknown'),
      duplicateKeys: records.map((record) => record.collectibleKey).filter((key, index, all) => all.indexOf(key) !== index),
      orphanedAssociations: associatedCards.filter((record) => !record.cardId),
    },
  };
};

