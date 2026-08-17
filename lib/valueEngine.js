import { collectibleKey, ownedQuantity } from "./collectibles";

export const formatMoney = (value, currency = "EUR") => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(Number(value || 0));
  } catch (_) {
    return `${currency} ${Number(value || 0).toFixed(2)}`;
  }
};
const quoteValue = (asset) =>
  asset?.manualValue?.value != null
    ? { quote: asset.manualValue, manualOverride: true }
    : asset?.providerMarketValue?.value != null
      ? { quote: asset.providerMarketValue, manualOverride: false }
      : { quote: null, manualOverride: false };
const acquisitionSummary = (asset, maximumQuantity = Infinity) => {
  const lots = asset?.acquisitions || [];
  const known = lots.filter((lot) => lot.unitCost != null);
  let remaining = maximumQuantity;
  let basis = 0;
  let coveredQuantity = 0;
  known.forEach((lot) => {
    const covered = Math.max(0, Math.min(Number(lot.quantity || 0), remaining));
    basis += covered * Number(lot.unitCost || 0);
    coveredQuantity += covered;
    remaining -= covered;
  });
  return { basis, coveredQuantity, hasCost: known.length > 0 };
};

export const calculateVaultPortfolio = ({
  ownership = {},
  cards = [],
  assets = [],
  rawAcquisitions = {},
  currency = "EUR",
}) => {
  const byKey = new Map(cards.map((card) => [collectibleKey(card), card]));
  const rawAssets = Object.entries(ownership)
    .map(([key, value]) => {
      const card = byKey.get(key);
      const quantity = ownedQuantity(ownership, key);
      if (!card || !quantity) return null;
      const unitValue = Number(card.value || 0);
      const lots = rawAcquisitions[key]?.acquisitions || [];
      const acquisition = acquisitionSummary({ acquisitions: lots }, quantity);
      const coveredUnits = Math.min(quantity, acquisition.coveredQuantity);
      return {
        id: key,
        type: "raw",
        card,
        quantity,
        unitValue,
        value: unitValue * quantity,
        quote: unitValue
          ? {
              provider: "scrydex",
              market: "Card market",
              currency,
              value: unitValue,
              timestamp: card.priceTimestamp || null,
              condition: "Raw",
            }
          : null,
        costBasis: acquisition.basis,
        knownCostValue: unitValue * coveredUnits,
        hasCost: acquisition.hasCost,
        acquisitions: lots,
      };
    })
    .filter(Boolean);
  const vaultAssets = assets.map((asset) => {
    const selected = quoteValue(asset);
    const unitValue = Number(selected.quote?.value || 0);
    const quantity = Number(asset.quantity || 1);
    const acquisition = acquisitionSummary(asset, quantity);
    const coveredUnits = Math.min(quantity, acquisition.coveredQuantity);
    return {
      ...asset,
      unitValue,
      value: unitValue * quantity,
      quote: selected.quote,
      manualOverride: selected.manualOverride,
      costBasis: acquisition.basis,
      knownCostValue: unitValue * coveredUnits,
      hasCost: acquisition.hasCost,
    };
  });
  const gradedAssets = vaultAssets.filter((asset) => asset.type === "graded");
  const sealedAssets = vaultAssets.filter((asset) => asset.type === "sealed");
  const sum = (list, field = "value") =>
    list.reduce((total, item) => total + Number(item[field] || 0), 0);
  const rawValue = sum(rawAssets),
    gradedValue = sum(gradedAssets),
    sealedValue = sum(sealedAssets),
    totalValue = rawValue + gradedValue + sealedValue;
  const allAssets = [...rawAssets, ...vaultAssets];
  const trackedCostBasis = sum(
    allAssets.filter((asset) => asset.hasCost),
    "costBasis",
  );
  const trackedAssetsValue = sum(
    allAssets.filter((asset) => asset.hasCost),
    "knownCostValue",
  );
  const unrealizedGain = trackedAssetsValue - trackedCostBasis;
  const gainPercent =
    trackedCostBasis > 0 ? (unrealizedGain / trackedCostBasis) * 100 : null;
  const coveragePercent =
    totalValue > 0 ? (trackedAssetsValue / totalValue) * 100 : 0;
  return {
    currency,
    rawAssets,
    gradedAssets,
    sealedAssets,
    rawValue,
    gradedValue,
    sealedValue,
    totalValue,
    trackedCostBasis,
    trackedAssetsValue,
    unrealizedGain,
    gainPercent,
    coveragePercent,
    pricedAssets: [...rawAssets, ...vaultAssets].filter((asset) => asset.quote)
      .length,
  };
};

export const targetPriceStatus = ({ targetPrice, quote, now = new Date() }) => {
  if (
    targetPrice == null ||
    targetPrice === "" ||
    !quote?.value ||
    !quote.timestamp ||
    quote.provider === "manual"
  )
    return null;
  const age = now.getTime() - new Date(quote.timestamp).getTime();
  if (!Number.isFinite(age) || age > 30 * 86400000) return null;
  const target = Number(targetPrice),
    current = Number(quote.value);
  if (!Number.isFinite(target) || target <= 0) return null;
  if (current <= target) return "At/Below Target";
  if (current <= target * 1.1) return "Near Target";
  return "Above Target";
};

export const makePortfolioSnapshot = (
  portfolio,
  timestamp = new Date().toISOString(),
) => ({
  id: `snapshot-${timestamp}`,
  timestamp,
  rawValue: portfolio.rawValue,
  gradedValue: portfolio.gradedValue,
  sealedValue: portfolio.sealedValue,
  totalValue: portfolio.totalValue,
  currency: portfolio.currency,
});
