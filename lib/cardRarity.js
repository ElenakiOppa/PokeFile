// Canonical printed rarities only. Finishes, promo associations, products and
// set names deliberately do not belong in this taxonomy.
export const PRINTED_RARITIES = [
  "Common",
  "Uncommon",
  "Rare",
  "Rare Holo",
  "Double Rare",
  "ACE SPEC Rare",
  "Amazing Rare",
  "Radiant Rare",
  "Illustration Rare",
  "Trainer Gallery Rare",
  "Shiny Rare",
  "Ultra Rare",
  "Shiny Ultra Rare",
  "Special Illustration Rare",
  "Hyper Rare",
  "Mega Hyper Rare",
  "Rare Rainbow",
  "Secret Rare",
];

const aliases = new Map([
  ["holo rare", "Rare Holo"],
  ["rare holo", "Rare Holo"],
  ["double rare", "Double Rare"],
  ["ace spec", "ACE SPEC Rare"],
  ["ace spec rare", "ACE SPEC Rare"],
  ["ir", "Illustration Rare"],
  ["illustration rare", "Illustration Rare"],
  ["sir", "Special Illustration Rare"],
  ["special illustration rare", "Special Illustration Rare"],
  ["trainer gallery", "Trainer Gallery Rare"],
  ["trainer gallery rare", "Trainer Gallery Rare"],
]);

PRINTED_RARITIES.forEach((rarity) => aliases.set(rarity.toLowerCase(), rarity));

export const normalizePrintedRarity = (value) => aliases.get(String(value || "").trim().toLowerCase()) || null;

export const printedRarityLabel = (rarity) => ({
  "Illustration Rare": "Illustration Rare (IR)",
  "Special Illustration Rare": "Special Illustration Rare (SIR)",
}[rarity] || rarity);
