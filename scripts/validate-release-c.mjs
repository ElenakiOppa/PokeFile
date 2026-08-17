import fs from "node:fs/promises";
import assert from "node:assert/strict";
const moduleFrom = async (url, transform = (source) => source) =>
  import(
    `data:text/javascript;base64,${Buffer.from(transform(await fs.readFile(url, "utf8"))).toString("base64")}`
  );
const vault = await moduleFrom(new URL("../lib/vault.js", import.meta.url));
const values = await moduleFrom(
  new URL("../lib/valueEngine.js", import.meta.url),
  (source) =>
    source.replace(
      /import\s*\{\s*collectibleKey,\s*ownedQuantity\s*\}\s*from\s*["']\.\/collectibles["'];?/,
      "const collectibleKey=(item)=>typeof item==='string'?item:String(item?.collectibleKey||item?.id||''); const ownedQuantity=(ownership,item)=>{const value=ownership?.[collectibleKey(item)]; return typeof value==='boolean'?(value?1:0):typeof value==='object'?Number(value.quantity||0):Number(value||0)};",
    ),
);

const card = {
  id: "set-1:reverse",
  cardId: "set-1",
  name: "Test Pokémon",
  value: 10,
  priceTimestamp: new Date().toISOString(),
  image: "card.png",
};
const gradedNoPrice = vault.createGradedAsset({
  canonicalCollectibleKey: card.id,
  name: card.name,
  image: card.image,
  company: "PSA",
  grade: "10",
  certificationNumber: "001 234",
  quantity: 1,
});
assert.equal(gradedNoPrice.certificationNumber, "001 234");
let portfolio = values.calculateVaultPortfolio({
  ownership: { [card.id]: 2 },
  cards: [card],
  assets: [gradedNoPrice],
  currency: "EUR",
});
assert.equal(portfolio.rawValue, 20);
assert.equal(portfolio.gradedValue, 0);
assert.equal(portfolio.totalValue, 20);
const graded = vault.normalizeVaultAsset({
  ...gradedNoPrice,
  manualValue: { value: 100, currency: "EUR", provider: "manual" },
  acquisitions: [{ quantity: 1, unitCost: 70 }],
});
const sealed = vault.createSealedAsset({
  productName: "Manual Box",
  productType: "Booster Box",
  sourceType: "manual",
  quantity: 2,
  manualValue: { value: 50, currency: "EUR" },
  acquisitions: [
    { quantity: 1, unitCost: 35 },
    { quantity: 1, unitCost: 40 },
  ],
});
portfolio = values.calculateVaultPortfolio({
  ownership: { [card.id]: 2 },
  cards: [card],
  assets: [graded, sealed],
  rawAcquisitions: {
    [card.id]: {
      acquisitions: [
        { quantity: 1, unitCost: 5 },
        { quantity: 1, unitCost: 7 },
      ],
    },
  },
  currency: "EUR",
});
assert.equal(portfolio.rawValue, 20);
assert.equal(portfolio.gradedValue, 100);
assert.equal(portfolio.sealedValue, 100);
assert.equal(portfolio.totalValue, 220);
assert.equal(portfolio.trackedCostBasis, 157);
assert.equal(portfolio.trackedAssetsValue, 220);
assert.equal(portfolio.gradedAssets[0].manualOverride, true);
assert.equal(
  Object.hasOwn(vault.publicVaultAsset(graded), "certificationNumber"),
  false,
);
assert.equal(
  JSON.stringify(vault.publicVaultAsset(graded)).includes("unitCost"),
  false,
);
const duplicateNormalized = vault.normalizeVaultAssets([
  { id: "same", type: "sealed" },
  { id: "same", type: "sealed" },
]);
assert.equal(duplicateNormalized.length, 2);
assert.notEqual(duplicateNormalized[0].id, duplicateNormalized[1].id);
const quote = {
  value: 40,
  provider: "scrydex",
  timestamp: new Date().toISOString(),
};
assert.equal(
  values.targetPriceStatus({ targetPrice: 35, quote }),
  "Above Target",
);
assert.equal(
  values.targetPriceStatus({ targetPrice: 40, quote }),
  "At/Below Target",
);
assert.equal(
  values.targetPriceStatus({
    targetPrice: 40,
    quote: { ...quote, timestamp: "2020-01-01" },
  }),
  null,
);
const snapshot = values.makePortfolioSnapshot(portfolio);
assert.equal(snapshot.totalValue, 220);
assert(Number.isFinite(new Date(snapshot.timestamp).getTime()));
console.log(
  "Release C validation passed: asset identity/privacy, lots, pricing separation, portfolio totals, partial cost basis, targets, malformed duplicates, and snapshots.",
);
