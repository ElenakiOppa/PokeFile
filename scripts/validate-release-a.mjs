import assert from 'node:assert/strict';
import fs from 'node:fs';

const moduleFromSource = async (path) => {
  const source = fs.readFileSync(new URL(path, import.meta.url), 'utf8');
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
};
const scrydexModule = await moduleFromSource('../lib/providers/scrydexProvider.js');
const tcgdexModule = await moduleFromSource('../lib/providers/tcgdexProvider.js');
const factsModule = await moduleFromSource('../lib/providers/canonicalFacts.js');
let pipelineSource = fs.readFileSync(new URL('../lib/providers/multiProviderPipeline.js', import.meta.url), 'utf8');
pipelineSource = pipelineSource.replace("import { mergeBooleanFact } from './canonicalFacts.js';", `const confidenceForSources = ${factsModule.confidenceForSources.toString()};\nconst mergeBooleanFact = ${factsModule.mergeBooleanFact.toString()};`);
const pipelineModule = await import(`data:text/javascript;base64,${Buffer.from(pipelineSource).toString('base64')}`);
const domain = await moduleFromSource('../lib/collectibles.js');

const raw = JSON.parse(fs.readFileSync(new URL('../data/scrydex/sets.json', import.meta.url), 'utf8'));
const cached = JSON.parse(fs.readFileSync(new URL('../data/providers/tcgdex/me05.json', import.meta.url), 'utf8'));
const chaosCached = JSON.parse(fs.readFileSync(new URL('../data/providers/tcgdex/me04.json', import.meta.url), 'utf8'));
const guides = JSON.parse(fs.readFileSync(new URL('../data/providers/pokecottage/set-guides.json', import.meta.url), 'utf8'));
const curated = JSON.parse(fs.readFileSync(new URL('../data/curated/pitch-black-grandmaster.json', import.meta.url), 'utf8'));
const sourceSet = raw.sets.find((set) => set.id === 'me5');
const canonical = pipelineModule.combineProviderSets({
  scrydex: scrydexModule.normalizeScrydexSet(sourceSet),
  tcgdex: tcgdexModule.normalizeTcgdexSet(cached.set, cached.cards),
  curated,
});
const set = { ...sourceSet, ...canonical };
const base = domain.getSetRequirements(set, 'base');
const complete = domain.getSetRequirements(set, 'complete');
const master = domain.getSetRequirements(set, 'master');
const grandmaster = domain.getSetRequirements(set, 'grandmaster');

assert.deepEqual([base.length, complete.length, master.length, grandmaster.length], [84, 120, 194, 218]);
assert.equal(canonical.quality.variantCoverage.reverse.both.length, 67);
assert.equal(canonical.quality.variantCoverage.reverse.scrydexOnly.length, 7);
assert.equal(canonical.quality.variantCoverage.reverse.tcgdexOnly.length, 0);
assert.deepEqual(canonical.quality.variantCoverage.reverse.scrydexOnly.map((card) => Number(card.localId)), [12, 20, 59, 62, 70, 83, 84]);
assert.equal(canonical.associatedCards.length, 24);
assert.equal(canonical.quality.unknownClassifications.length, 0);
assert.deepEqual(canonical.quality.classificationDisputes.map((record) => Number(record.number)), [28, 35, 47, 56]);
assert.equal(canonical.quality.orphanedAssociations.length, 0);
assert.equal(canonical.quality.duplicateKeys.length, 0);
assert.ok(master.every((record) => record.collectibleKey && Array.isArray(record.evidence)));
assert.ok(grandmaster.every((record) => record.collectibleKey));

const released = domain.getCurrentlyReleasedRequirements(grandmaster, new Date('2026-08-17T23:59:59Z'));
assert.equal(released.length, 214);
assert.equal(grandmaster.filter((record) => record.releaseStatus === 'announced').length, 3);
assert.equal(grandmaster.filter((record) => record.releaseStatus === 'upcoming').length, 1);

const chaosSource = raw.sets.find((set) => set.id === 'me4');
const chaosGuide = guides.guides.find((guide) => guide.setId === 'me4');
const chaosCurated = {
  setId: 'me4',
  canonicalExpansionPrintings: Object.fromEntries(['13', '29', '51', '68', '85'].map((number) => [`me4-${number}`, 'holofoil'])),
  records: chaosGuide.records.filter((record) => record.associated).map((record) => {
    const number = String(record.number).match(/^(?:MEP\s*)?0*(\d+)/i)?.[1];
    const cardId = /^MEP/i.test(record.number) ? `mep-${number}` : `me4-${number}`;
    return {
      collectibleKey: `${cardId}:pokecottage-${record.sourceRow}`,
      cardId,
      number,
      name: record.name,
      finish: record.classification,
      associationType: 'pokecottage-associated',
      sourceProvider: 'PokéCottage',
      sourceId: `chaos-rising-row-${record.sourceRow}`,
      verified: true,
      releaseStatus: 'released',
    };
  }),
};
const chaos = pipelineModule.combineProviderSets({
  scrydex: scrydexModule.normalizeScrydexSet(chaosSource),
  tcgdex: tcgdexModule.normalizeTcgdexSet(chaosCached.set, chaosCached.cards),
  curated: chaosCurated,
});
assert.deepEqual([chaos.baseCards.length, chaos.completeCards.length, chaos.masterCards.length, chaos.grandmasterCards.length], [86, 122, 198, 220]);
const confidenceBreakdown = (records) => records.reduce((counts, record) => {
  const confidence = record.confidence || 'unknown';
  counts[confidence] = (counts[confidence] || 0) + 1;
  return counts;
}, {});

console.log(JSON.stringify({
  counts: { base: base.length, complete: complete.length, master: master.length, grandmaster: grandmaster.length },
  reverse: {
    both: canonical.quality.variantCoverage.reverse.both.length,
    scrydexOnly: canonical.quality.variantCoverage.reverse.scrydexOnly.map((card) => ({ number: card.localId, name: card.name })),
    tcgdexOnly: canonical.quality.variantCoverage.reverse.tcgdexOnly.length,
  },
  curated: {
    availabilityCorrections: curated.variantAvailabilityOverrides.length,
    classificationCorrections: Object.keys(curated.canonicalExpansionPrintings).length,
    additions: canonical.associatedCards.length,
  },
  confidence: {
    complete: confidenceBreakdown(complete),
    master: confidenceBreakdown(master),
    grandmaster: confidenceBreakdown(grandmaster),
  },
  release: { released: released.length, announced: 3, upcoming: 1 },
  quality: {
    unknownClassifications: canonical.quality.unknownClassifications.length,
    orphanedAssociations: canonical.quality.orphanedAssociations.length,
    duplicateKeys: canonical.quality.duplicateKeys.length,
  },
  chaosRising: { base: chaos.baseCards.length, complete: chaos.completeCards.length, master: chaos.masterCards.length, grandmaster: chaos.grandmasterCards.length, associated: chaos.associatedCards.length },
}, null, 2));
