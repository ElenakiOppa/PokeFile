import { targetPriceStatus } from "./valueEngine";

export const calculateVaultInsights = (portfolio, wishlistItems = []) => {
  const lines = [];
  const total = portfolio.totalValue;
  if (total > 0 && portfolio.sealedValue > 0)
    lines.push(
      `Sealed products represent ${Math.round((portfolio.sealedValue / total) * 100)}% of your tracked portfolio.`,
    );
  const assetsWithPurchases = [
    ...portfolio.gradedAssets,
    ...portfolio.sealedAssets,
  ].filter((asset) => asset.hasCost).length;
  if (assetsWithPurchases)
    lines.push(
      `${assetsWithPurchases} Vault asset${assetsWithPurchases === 1 ? " has" : "s have"} purchase history.`,
    );
  const nearTargets = wishlistItems.filter((item) => {
    const status = targetPriceStatus({
      targetPrice: item.targetPrice,
      quote: item.targetPriceQuote,
    });
    return status === "Near Target" || status === "At/Below Target";
  }).length;
  if (nearTargets)
    lines.push(
      `${nearTargets} Wishlist card${nearTargets === 1 ? " is" : "s are"} near or below your target price.`,
    );
  return lines.slice(0, 4);
};
