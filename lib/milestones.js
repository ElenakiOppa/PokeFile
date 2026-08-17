export const MILESTONES = [
  {
    id: "cards-1",
    title: "First Card",
    detail: "The collection begins.",
    condition: { type: "owned-card-count", threshold: 1 },
  },
  ...[50, 100, 250, 500, 1000].map((threshold) => ({
    id: `cards-${threshold}`,
    title: `${threshold.toLocaleString()} Cards`,
    detail: `${threshold.toLocaleString()} physical cards collected.`,
    condition: { type: "owned-card-count", threshold },
  })),
  {
    id: "first-base",
    title: "First Completed Base Set",
    condition: { type: "completed-tier", tier: "base" },
  },
  {
    id: "first-complete",
    title: "First Completed Complete Set",
    condition: { type: "completed-tier", tier: "complete" },
  },
  {
    id: "first-master",
    title: "First Master Set",
    condition: { type: "completed-tier", tier: "master" },
  },
  {
    id: "first-grandmaster",
    title: "First Grandmaster Set",
    condition: { type: "completed-tier", tier: "grandmaster" },
  },
  {
    id: "first-flex",
    title: "First Flex Binder",
    condition: { type: "binder-kind", kind: "flex" },
  },
  {
    id: "first-binder-complete",
    title: "First 100% Binder",
    condition: { type: "completed-binder" },
  },
  {
    id: "first-graded",
    title: "First Graded Card",
    condition: { type: "vault-asset-kind", kind: "graded" },
  },
  {
    id: "first-sealed",
    title: "First Sealed Product",
    condition: { type: "vault-asset-kind", kind: "sealed" },
  },
  {
    id: "vault-eur-1000",
    title: "€1,000 Tracked Vault",
    condition: { type: "vault-value", currency: "EUR", threshold: 1000 },
  },
  {
    id: "vault-eur-5000",
    title: "€5,000 Tracked Vault",
    condition: { type: "vault-value", currency: "EUR", threshold: 5000 },
  },
];

export const evaluateMilestones = ({
  totalPhysical,
  binders,
  binderStats,
  vaultAssets = [],
  vaultValue = 0,
  currency = "EUR",
}) => {
  const completedTiers = new Set(
    (binderStats || [])
      .filter((item) => item.total > 0 && item.missing === 0)
      .map((item) => String(item.binder.tier || "").toLowerCase()),
  );
  return MILESTONES.filter(({ condition }) => {
    if (condition.type === "owned-card-count")
      return totalPhysical >= condition.threshold;
    if (condition.type === "completed-tier")
      return completedTiers.has(condition.tier);
    if (condition.type === "binder-kind")
      return (binders || []).some((binder) => binder.kind === condition.kind);
    if (condition.type === "completed-binder")
      return (binderStats || []).some(
        (item) => item.total > 0 && item.missing === 0,
      );
    if (condition.type === "vault-asset-kind")
      return vaultAssets.some((asset) => asset.type === condition.kind);
    if (condition.type === "vault-value")
      return (
        currency === condition.currency && vaultValue >= condition.threshold
      );
    return false;
  });
};
