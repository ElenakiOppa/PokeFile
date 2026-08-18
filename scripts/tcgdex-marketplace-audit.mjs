import fs from 'node:fs';
import { auditTcgdexMarketplaceVariants } from '../lib/tcgdexAudit.js';

const setId = 'me04';
const payload = JSON.parse(fs.readFileSync(new URL(`../data/providers/tcgdex/${setId}.json`, import.meta.url), 'utf8'));
const cards = Array.isArray(payload.cards) ? payload.cards : Array.isArray(payload.set?.cards) ? payload.set.cards : [];
const set = { id: setId, name: 'Chaos Rising', tcgdexRawCards: cards };
const results = auditTcgdexMarketplaceVariants(set);

console.log('TCGDEX MARKETPLACE VARIANT AUDIT');
console.log(JSON.stringify({
  setId: results.setId,
  setName: results.setName,
  cardCount: results.cardCount,
  structuralCollectibleCount: results.structuralCollectibleCount,
  marketplaceMissingFinishCount: results.marketplaceMissingFinishCount,
  reconciledCandidateCount: results.reconciledCandidateCount,
  missingByFinish: results.missingByFinish,
  cardsWithMissingFinishes: results.cardsWithMissingFinishes.slice(0, 50),
}, null, 2));
