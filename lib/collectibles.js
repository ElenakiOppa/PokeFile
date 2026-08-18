const TIER_KEYS = {
  base: 'baseCards',
  complete: 'completeCards',
  master: 'masterCards',
  grandmaster: 'grandmasterCards',
};

export const normalizeTier = (tier) => {
  const value = String(tier || 'master').toLowerCase();
  return TIER_KEYS[value] ? value : 'master';
};

export const collectibleKey = (collectible) => {
  if (typeof collectible === 'string') return collectible;
  return String(collectible?.collectibleKey || collectible?.id || '');
};

export const requirementFromCard = (card, set, tier) => ({
  ...card,
  collectibleKey: collectibleKey(card),
  baseCardId: String(card?.cardId || card?.baseCardId || card?.id || ''),
  variantKey: card?.variantKey || null,
  finish: card?.variant || card?.finish || 'Unknown',
  setId: card?.setId || set?.id || null,
  setName: card?.setName || set?.name || null,
  requirementTier: normalizeTier(tier),
  sourceVerified: card?.verified ?? Boolean(card?.sourceUrl || set?.url || set?.sourceUrl),
});

export const isCurrentlyReleased = (collectible, asOf = new Date()) => {
  if (collectible?.releaseStatus === 'upcoming' || collectible?.releaseStatus === 'announced') return false;
  if (!collectible?.releaseDate) return collectible?.releaseStatus === 'released';
  return new Date(collectible.releaseDate).getTime() <= asOf.getTime();
};

export const getCurrentlyReleasedRequirements = (requirements, asOf = new Date()) => (
  (requirements || []).filter((requirement) => isCurrentlyReleased(requirement, asOf))
);

export const getSetRequirements = (set, tier = 'master') => {
  if (!set) return [];
  const normalizedTier = normalizeTier(tier);
  const preferred = Array.isArray(set[TIER_KEYS[normalizedTier]]) ? set[TIER_KEYS[normalizedTier]] : [];
  const canonicalCards = Array.isArray(set.cards) ? set.cards : [];
  const candidateSource = preferred.length && preferred.some((card) => card && (card.name || card.image || card.value != null || card.cardId || card.id))
    ? preferred
    : canonicalCards;
  const seen = new Set();

  const mergeWithCanonicalCard = (card) => {
    if (!card || (!card.name && !card.cardId && !card.id && !card.collectibleKey && !card.number)) return card;
    const exactCollectible = set?.cards?.find((candidate) => String(candidate.collectibleKey || candidate.id || '') === String(card.collectibleKey || card.id || ''))
      || set?.cards?.find((candidate) => String(candidate.id || '') === String(card.id || ''))
      || set?.cards?.find((candidate) => String(candidate.collectibleKey || '') === String(card.collectibleKey || ''));
    const fallback = exactCollectible || canonicalCards.find((candidate) => {
      if (!candidate) return false;
      const ids = [candidate.id, candidate.cardId, candidate.baseCardId, candidate.collectibleKey];
      const target = [card.id, card.cardId, card.baseCardId, card.collectibleKey, String(card.number || ''), String(card.number || '').replace(/^0+/, '')];
      return ids.some((id) => target.includes(String(id || ''))) ||
        (candidate.number && card.number && String(candidate.number).replace(/^0+/, '') === String(card.number).replace(/^0+/, ''));
    });
    if (!fallback) return card;
    return {
      ...fallback,
      ...card,
      collectibleKey: String(card.collectibleKey || fallback.collectibleKey || card.id || fallback.id || card.cardId || fallback.cardId || ''),
      id: String(card.id || fallback.id || card.collectibleKey || fallback.collectibleKey || card.cardId || fallback.cardId || ''),
      cardId: String(card.cardId || fallback.cardId || card.baseCardId || fallback.baseCardId || card.id || fallback.id || ''),
      baseCardId: String(card.baseCardId || fallback.baseCardId || card.cardId || fallback.cardId || card.id || fallback.id || ''),
      name: String(card.name || fallback.name || 'Unknown card'),
      image: String(card.image || fallback.image || ''),
      number: String(card.number || fallback.number || ''),
      finish: String(card.finish || card.variant || fallback.finish || fallback.variant || 'Unknown'),
      value: Number.isFinite(Number(card.value)) ? Number(card.value) : Number.isFinite(Number(fallback.value)) ? Number(fallback.value) : null,
      rarity: String(card.rarity || fallback.rarity || 'Unknown'),
      setId: String(card.setId || fallback.setId || set?.id || ''),
      setName: String(card.setName || fallback.setName || set?.name || ''),
    };
  };

  return candidateSource.reduce((requirements, card) => {
    const enriched = mergeWithCanonicalCard(card);
    if (!enriched || (!enriched.name && !enriched.cardId && !enriched.id && !enriched.collectibleKey)) return requirements;
    const requirement = requirementFromCard(enriched, set, normalizedTier);
    const key = requirement.collectibleKey || requirement.id || requirement.cardId || requirement.baseCardId;
    if (!key || seen.has(key)) return requirements;
    if (!requirement.name && !requirement.collectibleKey) return requirements;
    const exact = set?.cards?.find((candidate) => String(candidate.collectibleKey || candidate.id || '') === String(key));
    if (exact && requirement.collectibleKey && exact.collectibleKey && exact.collectibleKey !== requirement.collectibleKey) {
      requirement.collectibleKey = exact.collectibleKey;
    }
    seen.add(key);
    requirements.push(requirement);
    return requirements;
  }, []);
};

export const ownedQuantity = (ownership, collectible) => {
  const value = ownership?.[collectibleKey(collectible)];
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (value && typeof value === 'object') return Math.max(0, Number(value.quantity || 0));
  return Math.max(0, Number(value || 0));
};

export const isOwned = (ownership, collectible) => ownedQuantity(ownership, collectible) > 0;

export const getMissingRequirements = (requirements, ownership) => (
  (requirements || []).filter((requirement) => !isOwned(ownership, requirement))
);

export const getGeneratedBinderSlots = (set, tier) => (
  getSetRequirements(set, tier).map((requirement, position) => ({
    id: `requirement:${requirement.collectibleKey}`,
    position,
    collectibleKey: requirement.collectibleKey,
    requirement,
  }))
);

export const paginateBinderSlots = (slots, pageCapacity) => {
  const capacity = Math.max(1, Number(pageCapacity) || 9);
  const source = (slots || []).length ? [...slots] : [];
  if (!source.length) return [Array.from({ length: capacity }, (_, position) => ({ id: `empty:${position}`, position, requirement: null }))];
  const pages = [];
  for (let index = 0; index < source.length; index += capacity) {
    const page = source.slice(index, index + capacity);
    while (page.length < capacity) page.push({ id: `empty:${index + page.length}`, position: index + page.length, requirement: null });
    pages.push(page);
  }
  return pages;
};

export const normalizeBinder = (binder) => ({
  ...binder,
  kind: binder?.kind === 'flex' ? 'flex' : binder?.kind === 'freeform' ? 'freeform' : 'set',
  slots: Array.isArray(binder?.slots) ? binder.slots : [],
});

export const wishlistItemFromRequirement = (requirement) => ({
  id: collectibleKey(requirement),
  collectibleKey: collectibleKey(requirement),
  cardId: requirement.baseCardId || requirement.cardId || requirement.id,
  variantKey: requirement.variantKey || null,
  finish: requirement.finish || requirement.variant || 'Unknown',
  setId: requirement.setId || null,
  setName: requirement.setName || null,
  name: requirement.name || 'Unknown card',
  number: requirement.number || '—',
  image: requirement.image || null,
  priority: 'Medium',
  notes: '',
  createdAt: new Date().toISOString(),
});

export const mergeWishlistRequirements = (existingItems, requirements) => {
  const next = [...(existingItems || [])];
  const existing = new Set(next.map((item) => collectibleKey(item)));
  (requirements || []).forEach((requirement) => {
    const key = collectibleKey(requirement);
    if (!key || existing.has(key)) return;
    existing.add(key);
    next.push(wishlistItemFromRequirement(requirement));
  });
  return next;
};

export const addCollectibleToFreeformBinder = (binder, card) => {
  if (!binder || binder.kind !== 'freeform' || !card) return binder;
  const key = collectibleKey(card);
  if (!key || (binder.slots || []).some((slot) => slot?.collectibleKey === key)) return binder;
  const slots = [...(binder.slots || [])];
  const emptyIndex = slots.findIndex((slot) => !slot?.collectibleKey);
  const entry = { id: `freeform:${binder.id}:${key}`, collectibleKey: key, card };
  if (emptyIndex >= 0) slots[emptyIndex] = entry;
  else slots.push(entry);
  return { ...binder, slots };
};

export const removeCollectibleFromFreeformBinder = (binder, slotIndex) => {
  if (!binder || binder.kind !== 'freeform') return binder;
  const slots = [...(binder.slots || [])];
  if (slotIndex < 0 || slotIndex >= slots.length) return binder;
  slots[slotIndex] = null;
  return { ...binder, slots };
};
