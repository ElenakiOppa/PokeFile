const uniqueByKey = (records) => {
  const seen = new Set();
  return (records || []).filter((record) => {
    const key = String(record.collectibleKey || record.id || '');
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const variantKeyFromCollectibleKey = (key) => String(key || '').split(':').slice(1).join(':') || null;

// Provider adapter: converts source card printings into canonical collectible records.
export const adaptSourcePrinting = (card, sourceMetadata = {}) => ({
  ...card,
  collectibleKey: String(card.collectibleKey || card.id),
  baseCardId: String(card.baseCardId || card.cardId || card.id),
  finish: card.finish || card.variant || 'Unknown',
  sourceProvider: card.sourceProvider || sourceMetadata.sourceProvider || 'Scrydex',
  sourceId: card.sourceId || card.id,
  verifiedAt: card.verifiedAt || sourceMetadata.verifiedAt || null,
  verified: card.verified ?? Boolean(card.sourceUrl),
  confidence: card.confidence || (card.sourceUrl ? 'single-source' : 'unknown'),
  releaseStatus: card.releaseStatus || 'released',
  associationType: card.associationType || 'expansion-printing',
});

// Curated printing adapter: preserves explicit provenance and never manufactures artwork.
export const adaptCuratedPrinting = (record, set) => ({
  ...record,
  id: record.collectibleKey,
  collectibleKey: record.collectibleKey,
  baseCardId: record.cardId,
  variantKey: record.variantKey || variantKeyFromCollectibleKey(record.collectibleKey),
  variant: record.finish,
  rarity: record.rarity || 'Associated Printing',
  image: record.image || null,
  setId: set.id,
  setName: set.name,
  associatedSetId: set.id,
  sourceSetId: String(record.cardId || '').startsWith('mep-') ? 'mep' : set.id,
  collectionTier: 'grandmaster',
});

export const buildCuratedSetRequirements = (set, curated, sourceMetadata = {}, tcgdexPayload = null) => {
  if (!set || !curated || String(set.id) !== String(curated.setId)) return null;
  if (tcgdexPayload?.set && Array.isArray(tcgdexPayload.cards)) {
    const canonical = combineProviderSets({
      scrydex: normalizeScrydexSet(set),
      tcgdex: normalizeTcgdexSet(tcgdexPayload.set, tcgdexPayload.cards),
      curated,
    });
    return {
      ...canonical,
      providerEvidence: {
        scrydexSetId: set.id,
        tcgdexSetId: tcgdexPayload.set.id,
        fetchedAt: tcgdexPayload.fetchedAt,
        officialCount: canonical.officialFact,
        totalCount: canonical.totalFact,
      },
    };
  }
  const cards = (set.cards || []).map((card) => adaptSourcePrinting(card, sourceMetadata));
  const byCardId = cards.reduce((groups, card) => {
    const key = String(card.cardId || card.baseCardId || card.id);
    if (!groups[key]) groups[key] = [];
    groups[key].push(card);
    return groups;
  }, {});

  const canonical = Object.values(byCardId).map((printings) => {
    const cardId = String(printings[0].cardId || printings[0].baseCardId);
    const override = curated.canonicalExpansionPrintings?.[cardId];
    return printings.find((card) => override && card.variantKey === override)
      || printings.find((card) => card.collectionTier === 'complete')
      // Above-number cards have one verified expansion printing in the provider
      // catalog even though the legacy importer labelled them as Master.
      || printings.find((card) => !card.isPromoOrStamped)
      || null;
  }).filter(Boolean);

  const printedTotal = Number(set.printedTotal || 0);
  const baseCards = canonical.filter((card) => Number.parseInt(card.number, 10) <= printedTotal);
  const completeCards = canonical;
  const reverseHoloCards = cards.filter((card) => card.variantKey === 'reverseHolofoil');
  const masterCards = uniqueByKey([...completeCards, ...reverseHoloCards]);
  const associatedCards = (curated.records || []).map((record) => adaptCuratedPrinting({
    ...record,
    verifiedAt: record.verifiedAt || curated.verifiedAt,
  }, set));
  const grandmasterCards = uniqueByKey([...masterCards, ...associatedCards]);

  return { baseCards, completeCards, masterCards, grandmasterCards, associatedCards };
};
import { normalizeScrydexSet } from './providers/scrydexProvider';
import { normalizeTcgdexSet } from './providers/tcgdexProvider';
import { combineProviderSets, reconcileCanonicalProviderSet } from './providers/multiProviderPipeline';

export const buildMasterChecklist = (canonicalSet = {}) => {
  const pooled = Array.isArray(canonicalSet.masterChecklist)
    ? canonicalSet.masterChecklist
    : Array.isArray(canonicalSet.masterCards)
      ? canonicalSet.masterCards
      : Array.isArray(canonicalSet.cards)
        ? canonicalSet.cards
        : [];

  const deduped = (pooled || []).reduce((result, card) => {
    const key = String(card?.collectibleKey || card?.id || `${card?.baseCardId || card?.cardId || canonicalSet.id || 'unknown'}:${card?.finish || card?.variant || 'normal'}`);
    if (!key || result.has(key)) return result;
    result.set(key, {
      ...card,
      collectibleKey: key,
      baseCardId: String(card?.baseCardId || card?.cardId || key.split(':')[0] || canonicalSet.id || 'unknown'),
      finish: String(card?.finish || card?.variant || 'Unknown'),
      variantKey: String(card?.variantKey || card?.finish || card?.variant || 'normal'),
    });
    return result;
  }, new Map());

  return Array.from(deduped.values());
};

export const buildCanonicalChecklist = (set, providerBundle = {}) => {
  if (!set) return [];
  const bundle = providerBundle && typeof providerBundle === 'object' ? providerBundle : {};
  if (bundle.scrydex || bundle.tcgdex) {
    const canonical = reconcileCanonicalProviderSet(bundle);
    return canonical.masterChecklist || [];
  }
  return buildMasterChecklist(set);
};
