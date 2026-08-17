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
const { normalizeScrydexSet } = scrydexModule;
const { fetchTcgdexSet, normalizeTcgdexSet } = tcgdexModule;
const { combineProviderSets } = pipelineModule;

const raw = JSON.parse(fs.readFileSync(new URL('../data/scrydex/sets.json', import.meta.url), 'utf8'));
const curated = JSON.parse(fs.readFileSync(new URL('../data/curated/pitch-black-grandmaster.json', import.meta.url), 'utf8'));
const scrydex = normalizeScrydexSet(raw.sets.find((set) => set.id === 'me5'));
const tcgdexResponse = await fetchTcgdexSet('me05');
const tcgdex = normalizeTcgdexSet(tcgdexResponse.set, tcgdexResponse.cards);
const canonical = combineProviderSets({ scrydex, tcgdex, curated });

const variantSummary = (provider) => Object.fromEntries(
  ['normal', 'holo', 'reverse', 'firstEdition'].map((variant) => [variant, provider.cards.filter((card) => card.variants[variant] === true).length]),
);
const disagreements = canonical.cards.flatMap((card) => (
  Object.entries(card.facts)
    .filter(([, fact]) => fact.providerConflict)
    .map(([variant, fact]) => ({ number: card.localId, name: card.name, variant, fact }))
));
const agreements = canonical.cards.flatMap((card) => (
  Object.entries(card.facts)
    .filter(([, fact]) => fact.confidence === 'verified' && fact.sources.filter((source) => source.provider !== 'curated').length > 1)
    .map(([variant, fact]) => ({ number: card.localId, name: card.name, variant, value: fact.value }))
));
const confidence = canonical.cards.flatMap((card) => Object.values(card.facts)).reduce((counts, fact) => {
  counts[fact.confidence] = (counts[fact.confidence] || 0) + 1;
  return counts;
}, {});

const additionalTargets = [
  { scrydexId: 'me4', tcgdexId: 'me04' },
  { scrydexId: 'me3', tcgdexId: 'me03' },
  { scrydexId: 'me2pt5', tcgdexId: 'me02.5' },
];
const additionalSets = [];
for (const target of additionalTargets) {
  const sourceSet = raw.sets.find((set) => set.id === target.scrydexId);
  const live = await fetchTcgdexSet(target.tcgdexId);
  const source = normalizeScrydexSet(sourceSet);
  const crosscheck = normalizeTcgdexSet(live.set, live.cards);
  const byNumber = Object.fromEntries(crosscheck.cards.map((card) => [String(Number(card.localId)), card]));
  const shared = source.cards.filter((card) => byNumber[String(Number(card.localId))]);
  const coverage = (variant) => ({
    both: shared.filter((card) => card.variants[variant] === true && byNumber[String(Number(card.localId))].variants[variant] === true).length,
    scrydexOnly: shared.filter((card) => card.variants[variant] === true && byNumber[String(Number(card.localId))].variants[variant] !== true).length,
    tcgdexOnly: shared.filter((card) => card.variants[variant] !== true && byNumber[String(Number(card.localId))].variants[variant] === true).length,
  });
  additionalSets.push({
    name: source.name,
    scrydexId: source.providerSetId,
    tcgdexId: crosscheck.providerSetId,
    scrydexIdentities: source.totalCount,
    tcgdexIdentities: crosscheck.totalCount,
    sharedIdentities: shared.length,
    officialCounts: [source.officialCount, crosscheck.officialCount],
    reverse: coverage('reverse'),
  });
}

console.log(JSON.stringify({
  scrydex: { setId: scrydex.providerSetId, official: scrydex.officialCount, total: scrydex.totalCount, variants: variantSummary(scrydex) },
  tcgdex: { setId: tcgdex.providerSetId, official: tcgdex.officialCount, total: tcgdex.totalCount, variants: variantSummary(tcgdex) },
  agreementCount: agreements.length,
  disagreementCount: disagreements.length,
  disagreements,
  curatedOverrides: curated.variantAvailabilityOverrides || [],
  counts: {
    base: canonical.baseCards.length,
    complete: canonical.completeCards.length,
    master: canonical.masterCards.length,
    grandmaster: canonical.grandmasterCards.length,
  },
  confidence,
  grandmasterAssociated: canonical.associatedCards.length,
  quality: {
    setCountDiscrepancies: canonical.quality.setCountDiscrepancies.length,
    reverseCoverage: {
      both: canonical.quality.variantCoverage.reverse.both.map((card) => card.localId),
      scrydexOnly: canonical.quality.variantCoverage.reverse.scrydexOnly.map((card) => ({ number: card.localId, name: card.name })),
      tcgdexOnly: canonical.quality.variantCoverage.reverse.tcgdexOnly.map((card) => card.localId),
    },
    disputedVariants: canonical.quality.disputedVariants.length,
    singleSourceVariants: canonical.quality.singleSourceVariants.length,
    unknownClassifications: canonical.quality.unknownClassifications.length,
    classificationDisputes: canonical.quality.classificationDisputes,
    orphanedAssociations: canonical.quality.orphanedAssociations.length,
    duplicateKeys: canonical.quality.duplicateKeys,
  },
  additionalSets,
}, null, 2));
