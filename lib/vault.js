export const GRADING_COMPANIES = ["PSA", "BGS", "CGC", "ACE", "TAG", "Other"];
export const SEALED_PRODUCT_TYPES = [
  "Booster Pack",
  "Sleeved Booster",
  "Booster Box",
  "Elite Trainer Box",
  "Pokémon Center ETB",
  "Collection Box",
  "Tin",
  "Mini Tin",
  "Build & Battle Box",
  "Booster Bundle",
  "Blister",
  "Theme/Battle Deck",
  "UPC / Premium Collection",
  "Other",
];

const id = (prefix) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
export const normalizeAcquisition = (entry = {}) => ({
  id: entry.id || id("lot"),
  quantity: Math.max(1, Number(entry.quantity || 1)),
  unitCost:
    entry.unitCost === "" || entry.unitCost == null
      ? null
      : Math.max(0, Number(entry.unitCost)),
  date: entry.date || null,
  source: entry.source || "",
});
export const normalizePriceQuote = (quote, fallback = {}) => {
  if (
    !quote ||
    quote.value === "" ||
    quote.value == null ||
    !Number.isFinite(Number(quote.value))
  )
    return null;
  return {
    provider: quote.provider || fallback.provider || "manual",
    market: quote.market || fallback.market || "User valuation",
    currency: quote.currency || fallback.currency || "EUR",
    value: Math.max(0, Number(quote.value)),
    timestamp:
      quote.timestamp || fallback.timestamp || new Date().toISOString(),
    condition: quote.condition || fallback.condition || null,
  };
};
export const normalizeVaultAsset = (asset = {}) => ({
  ...asset,
  id: String(asset.id || id(asset.type === "sealed" ? "sealed" : "graded")),
  type: asset.type === "sealed" ? "sealed" : "graded",
  quantity: Math.max(1, Number(asset.quantity || 1)),
  acquisitions: Array.isArray(asset.acquisitions)
    ? asset.acquisitions.map(normalizeAcquisition)
    : [],
  providerMarketValue: normalizePriceQuote(asset.providerMarketValue),
  manualValue: normalizePriceQuote(asset.manualValue, {
    provider: "manual",
    market: "User valuation",
  }),
  note: String(asset.note || ""),
  acquisitionSource: String(asset.acquisitionSource || ""),
  certificationNumber:
    asset.certificationNumber == null ? "" : String(asset.certificationNumber),
  sourceType:
    asset.type === "sealed"
      ? asset.sourceType === "provider"
        ? "provider"
        : "manual"
      : undefined,
});
export const normalizeVaultAssets = (assets) => {
  if (!Array.isArray(assets)) return [];
  const seen = new Set();
  return assets.map((source, index) => {
    const asset = normalizeVaultAsset(source);
    if (!seen.has(asset.id)) {
      seen.add(asset.id);
      return asset;
    }
    let recoveredId = `${asset.id}-recovered-${index}`;
    while (seen.has(recoveredId)) recoveredId = `${recoveredId}-copy`;
    seen.add(recoveredId);
    return { ...asset, id: recoveredId, recoveredFromDuplicateId: asset.id };
  });
};
export const createGradedAsset = (input) =>
  normalizeVaultAsset({
    ...input,
    id: input.id || id("graded"),
    type: "graded",
    createdAt: input.createdAt || new Date().toISOString(),
  });
export const createSealedAsset = (input) =>
  normalizeVaultAsset({
    ...input,
    id: input.id || id("sealed"),
    type: "sealed",
    sourceType: input.sourceType || "manual",
    createdAt: input.createdAt || new Date().toISOString(),
  });
export const publicVaultAsset = (asset) =>
  asset?.type === "graded"
    ? {
        id: asset.id,
        type: asset.type,
        canonicalCollectibleKey: asset.canonicalCollectibleKey,
        company: asset.company,
        grade: asset.grade,
        quantity: asset.quantity,
      }
    : {
        id: asset?.id,
        type: asset?.type,
        productName: asset?.productName,
        productType: asset?.productType,
        image: asset?.image,
        quantity: asset?.quantity,
        sourceType: asset?.sourceType,
      };
