const countBy = (items, valueOf, weightOf = () => 1) => {
  const counts = new Map();
  items.forEach((item) => {
    const value = valueOf(item);
    if (!value || value === 'Unknown') return;
    counts.set(value, (counts.get(value) || 0) + weightOf(item));
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])))[0] || null;
};

const pokemonName = (name) => String(name || '').replace(/^Mega\s+/i, '').replace(/\s+(?:ex|EX|V|VMAX|VSTAR|GX|BREAK|LV\.X)$/i, '').trim();

export const ownedCollectionEntries = (ownership, cardLibrary) => {
  const byKey = new Map((cardLibrary || []).map((card) => [String(card.collectibleKey || card.id), card]));
  return Object.entries(ownership || {}).map(([key, rawQuantity]) => {
    const quantity = typeof rawQuantity === 'object' ? Number(rawQuantity.quantity || 0) : rawQuantity === true ? 1 : Number(rawQuantity || 0);
    const card = byKey.get(key);
    return card && quantity > 0 ? { card, quantity } : null;
  }).filter(Boolean);
};

export const calculateCollectorDNA = (ownership, cardLibrary, sets) => {
  const entries = ownedCollectionEntries(ownership, cardLibrary);
  const setMap = new Map((sets || []).map((set) => [set.id, set]));
  const pokemonEntries = entries.filter(({ card }) => card.category === 'Pokemon' || card.category === 'Pokémon');
  const favoritePokemon = countBy(pokemonEntries, ({ card }) => pokemonName(card.name), ({ quantity }) => quantity);
  const favoriteType = countBy(entries, ({ card }) => card.type || card.types?.[0], ({ quantity }) => quantity);
  const favoriteGeneration = countBy(entries, ({ card }) => card.generation, ({ quantity }) => quantity);
  const favoriteIllustrator = countBy(entries, ({ card }) => card.illustrator, ({ quantity }) => quantity);
  const favoriteRarity = countBy(entries, ({ card }) => card.rarity, ({ quantity }) => quantity);
  const favoriteEra = countBy(entries, ({ card }) => setMap.get(card.setId)?.series, ({ quantity }) => quantity);
  const totalPhysical = entries.reduce((sum, entry) => sum + entry.quantity, 0);
  return { entries, totalPhysical, uniqueCards: entries.length, favoritePokemon, favoriteType, favoriteGeneration, favoriteIllustrator, favoriteRarity, favoriteEra };
};

export const calculateInsights = (ownership, cardLibrary, sets, binders, wishlistItems, getRequirements) => {
  const dna = calculateCollectorDNA(ownership, cardLibrary, sets);
  const duplicateCopies = dna.entries.reduce((sum, entry) => sum + Math.max(0, entry.quantity - 1), 0);
  const mostDuplicated = [...dna.entries].sort((a, b) => b.quantity - a.quantity)[0] || null;
  const binderStats = (binders || []).filter((b) => b.kind === 'set').map((binder) => {
    const set = (sets || []).find((item) => item.id === binder.setId);
    const requirements = getRequirements(set, binder.tier);
    const owned = requirements.filter((card) => Number(ownership?.[card.collectibleKey || card.id] || 0) > 0).length;
    return { binder, total: requirements.length, owned, missing: requirements.length - owned, percent: requirements.length ? Math.round(owned / requirements.length * 100) : 0 };
  });
  const completedSets = binderStats.filter((item) => item.total > 0 && item.missing === 0).length;
  const active = binderStats.filter((item) => item.total > 0 && item.missing > 0);
  const closest = [...active].sort((a, b) => b.percent - a.percent)[0] || null;
  const mostIncomplete = [...active].sort((a, b) => b.missing - a.missing)[0] || null;
  const totalMissing = active.reduce((sum, item) => sum + item.missing, 0);
  const observations = [];
  if (closest) observations.push(`${closest.binder.name} is your closest ${String(closest.binder.tier || 'set')} binder at ${closest.percent}%.`);
  if (closest && closest.missing <= 10) observations.push(`You need only ${closest.missing} card${closest.missing === 1 ? '' : 's'} to finish ${closest.binder.name}.`);
  if (duplicateCopies) observations.push(`You own ${duplicateCopies} duplicate cop${duplicateCopies === 1 ? 'y' : 'ies'}.`);
  if (dna.favoriteType) observations.push(`${dna.favoriteType[0]} Pokémon appear more than any other known type in your collection.`);
  return { ...dna, duplicateCopies, mostDuplicated, completedSets, closest, mostIncomplete, totalMissing, wishlistCount: (wishlistItems || []).length, observations: observations.slice(0, 4), binderStats };
};
