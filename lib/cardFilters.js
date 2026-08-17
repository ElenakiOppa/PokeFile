import { rarityRank } from "../data";
import { isOwned } from "./collectibles";

export const DEFAULT_SET_FILTERS = Object.freeze({ show: "All Cards", energy: [], rarity: [], sortBy: "Set Number (Default)" });
export const setFilterKey = (setId, tier, scope = "set") => `${scope}:${setId || "all"}:${String(tier || "master").toLowerCase()}`;
const clean = (value) => String(value || "").trim();
const energyOf = (card) => clean(card.energyType || card.type || card.types?.[0]);

export const filterOptionsForCards = (cards = []) => ({
  energy: [...new Set(cards.map(energyOf).filter(Boolean))].sort(),
  rarity: [...new Set(cards.map((card) => clean(card.rarity)).filter(Boolean))].sort(),
});

export const applyCardFilters = (cards = [], filters = DEFAULT_SET_FILTERS, ownership = {}) => {
  const active = { ...DEFAULT_SET_FILTERS, ...(filters || {}) };
  const energies = Array.isArray(active.energy) ? active.energy : [];
  const rarities = Array.isArray(active.rarity) ? active.rarity : active.rarity && active.rarity !== "All" ? [active.rarity] : [];
  const result = cards.filter((card) => {
    if (active.show === "Owned" && !isOwned(ownership, card)) return false;
    if (active.show === "Missing" && isOwned(ownership, card)) return false;
    if (energies.length && !energies.includes(energyOf(card))) return false;
    if (rarities.length && !rarities.includes(clean(card.rarity))) return false;
    return true;
  });
  if (active.sortBy === "Highest Market Value") return result.sort((a, b) => Number(b.value || 0) - Number(a.value || 0));
  if (active.sortBy === "Rarity Tier (High to Low)") return result.sort((a, b) => rarityRank(b.rarity) - rarityRank(a.rarity) || Number(a.sourceOrder || 0) - Number(b.sourceOrder || 0));
  return result.sort((a, b) => Number(a.sourceOrder || 0) - Number(b.sourceOrder || 0));
};
