import { isOwned } from "./collectibles";
import { normalizePrintedRarity, PRINTED_RARITIES } from "./cardRarity";
import { sortCards } from "./cardSorting";

export const DEFAULT_SET_FILTERS = Object.freeze({ show: "All Cards", energy: [], rarity: [], sortBy: "Set Number (Default)" });
export const setFilterKey = (setId, tier, scope = "set") => `${scope}:${setId || "all"}:${String(tier || "master").toLowerCase()}`;
const clean = (value) => String(value || "").trim();
const energyOf = (card) => clean(card.energyType || card.type || card.types?.[0]);

export const filterOptionsForCards = (cards = []) => ({
  energy: [...new Set(cards.map(energyOf).filter(Boolean))].sort(),
  rarity: PRINTED_RARITIES.filter((rarity) => cards.some((card) => normalizePrintedRarity(card.rarity) === rarity)),
});

export const applyCardFilters = (cards = [], filters = DEFAULT_SET_FILTERS, ownership = {}) => {
  const active = { ...DEFAULT_SET_FILTERS, ...(filters || {}) };
  const energies = Array.isArray(active.energy) ? active.energy : [];
  const rarities = Array.isArray(active.rarity) ? active.rarity : active.rarity && active.rarity !== "All" ? [active.rarity] : [];
  const result = cards.filter((card) => {
    if (active.show === "Owned" && !isOwned(ownership, card)) return false;
    if (active.show === "Missing" && isOwned(ownership, card)) return false;
    if (energies.length && !energies.includes(energyOf(card))) return false;
    if (rarities.length && !rarities.includes(normalizePrintedRarity(card.rarity))) return false;
    return true;
  });
  return sortCards(result, active.sortBy);
};
