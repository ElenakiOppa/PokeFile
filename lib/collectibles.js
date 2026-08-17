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
  const source = set[TIER_KEYS[normalizedTier]] || [];
  const seen = new Set();
  return source.reduce((requirements, card) => {
    const requirement = requirementFromCard(card, set, normalizedTier);
    if (!requirement.collectibleKey || seen.has(requirement.collectibleKey)) return requirements;
    seen.add(requirement.collectibleKey);
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
