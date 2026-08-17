export const FLEX_SLOT_COUNT = 9;

export const getPrimaryFlexBinder = (binders = []) => binders.find((binder) => binder?.kind === 'flex') || null;

export const upsertPrimaryFlexBinder = (binders = [], incoming = {}) => {
  const primary = getPrimaryFlexBinder(binders);
  if (!primary) return [...binders, normalizeFlexBinder(incoming)];
  return binders.map((binder) => binder.id === primary.id
    ? normalizeFlexBinder({ ...primary, ...incoming, id: primary.id })
    : binder);
};

const emptySlots = () => Array.from({ length: FLEX_SLOT_COUNT }, () => null);

export const normalizeFlexBinder = (binder = {}) => {
  const slots = emptySlots();
  (Array.isArray(binder.slots) ? binder.slots : []).slice(0, FLEX_SLOT_COUNT).forEach((slot, index) => {
    slots[index] = slot?.collectibleKey ? slot : null;
  });
  return { ...binder, kind: 'flex', title: binder.title || binder.name || 'My Flex', description: binder.description || '', slots };
};

export const setFlexSlot = (binder, index, card) => {
  if (index < 0 || index >= FLEX_SLOT_COUNT) return normalizeFlexBinder(binder);
  const next = normalizeFlexBinder(binder);
  const key = card?.collectibleKey || card?.id;
  if (!key) return next;
  next.slots[index] = { collectibleKey: String(key), card: { ...card, collectibleKey: String(key) } };
  return next;
};

export const removeFlexSlot = (binder, index) => {
  const next = normalizeFlexBinder(binder);
  if (index >= 0 && index < FLEX_SLOT_COUNT) next.slots[index] = null;
  return next;
};

export const moveFlexSlot = (binder, from, to) => {
  const next = normalizeFlexBinder(binder);
  if (from < 0 || to < 0 || from >= FLEX_SLOT_COUNT || to >= FLEX_SLOT_COUNT) return next;
  [next.slots[from], next.slots[to]] = [next.slots[to], next.slots[from]];
  return next;
};

const safeCard = (slot) => slot?.card ? ({
  collectibleKey: slot.collectibleKey,
  id: slot.card.id,
  cardId: slot.card.cardId || slot.card.baseCardId,
  name: slot.card.name,
  number: slot.card.number,
  finish: slot.card.finish || slot.card.variant,
  rarity: slot.card.rarity,
  image: slot.card.image,
  setId: slot.card.setId,
  setName: slot.card.setName,
}) : null;

export const toFlexBinderData = (binder, collectorName = '') => {
  const normalized = normalizeFlexBinder(binder);
  return {
    version: 1,
    title: normalized.title,
    description: normalized.description,
    collectorName: collectorName || '',
    cards: normalized.slots.map(safeCard),
  };
};
