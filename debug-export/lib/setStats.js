import { getSetRequirements, isOwned } from './collectibles';

const asNumber = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

const normalizedBaseNumber = (value) => {
  const next = String(value ?? '').trim();
  if (!next) return null;
  const match = next.match(/\d+/);
  return match ? String(Number(match[0])) : null;
};

export const getSetStats = (set, tier = 'master', ownership = {}) => {
  const requirements = Array.isArray(set?.cards) ? getSetRequirements(set, tier) : [];
  const owned = requirements.filter((card) => isOwned(ownership, card)).length;
  const missing = Math.max(0, requirements.length - owned);
  const totalValue = requirements.reduce((sum, card) => sum + asNumber(card?.value), 0);
  const ownedValue = requirements
    .filter((card) => isOwned(ownership, card))
    .reduce((sum, card) => sum + asNumber(card?.value), 0);
  const missingValue = Math.max(0, totalValue - ownedValue);
  const completionPercent = requirements.length ? Math.round((owned / requirements.length) * 100) : 0;

  const numberedNumbers = new Set(
    (set?.cards || [])
      .map((card) => normalizedBaseNumber(card?.number))
      .filter(Boolean),
  );

  return {
    numberedCards: numberedNumbers.size,
    collectibles: requirements.length,
    required: requirements.length,
    owned,
    missing,
    completionPercent,
    totalValue,
    ownedValue,
    missingValue,
    pricedCollectibles: requirements.filter((card) => Number.isFinite(Number(card?.value)) && Number(card.value) > 0).length,
    unpricedCollectibles: requirements.filter((card) => !Number.isFinite(Number(card?.value)) || Number(card.value) <= 0).length,
  };
};
