import { rarityRank } from "../data";
import { normalizePrintedRarity } from "./cardRarity";

const text = (value) => String(value || "").trim();
const numberParts = (value) => text(value).match(/\d+|\D+/g) || [];

export const compareCardNumbers = (a, b) => {
  const left = numberParts(a?.number || a?.localId);
  const right = numberParts(b?.number || b?.localId);
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    if (left[index] == null) return -1;
    if (right[index] == null) return 1;
    const leftNumber = Number(left[index]);
    const rightNumber = Number(right[index]);
    const bothNumeric = Number.isFinite(leftNumber) && Number.isFinite(rightNumber);
    const difference = bothNumeric ? leftNumber - rightNumber : left[index].localeCompare(right[index], undefined, { sensitivity: "base" });
    if (difference) return difference;
  }
  return Number(a?.sourceOrder ?? Number.MAX_SAFE_INTEGER) - Number(b?.sourceOrder ?? Number.MAX_SAFE_INTEGER);
};

export const sortCards = (cards = [], sortBy = "Set Number (Default)") => {
  const result = [...cards];
  const stable = (comparison) => result.sort((a, b) => comparison(a, b) || compareCardNumbers(a, b));
  if (sortBy === "Highest Market Value" || sortBy === "Value: High to Low") return stable((a, b) => Number(b.value || 0) - Number(a.value || 0));
  if (sortBy === "Value: Low to High") return stable((a, b) => Number(a.value || 0) - Number(b.value || 0));
  if (sortBy === "Rarity Tier (High to Low)" || sortBy === "Rarity: High to Low") return stable((a, b) => rarityRank(normalizePrintedRarity(b.rarity)) - rarityRank(normalizePrintedRarity(a.rarity)));
  if (sortBy === "Name A–Z") return stable((a, b) => text(a.name).localeCompare(text(b.name), undefined, { sensitivity: "base" }));
  return stable(compareCardNumbers);
};
