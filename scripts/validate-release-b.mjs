import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const load = async (path) => import(`data:text/javascript;base64,${Buffer.from(await fs.readFile(path, 'utf8')).toString('base64')}`);
const flex = await load(new URL('../lib/flexBinder.js', import.meta.url));
const analytics = await load(new URL('../lib/collectorAnalytics.js', import.meta.url));
const milestones = await load(new URL('../lib/milestones.js', import.meta.url));
const history = await load(new URL('../lib/history.js', import.meta.url));

const cards = Array.from({ length: 10 }, (_, index) => ({ id: `card-${index}`, name: index ? `Pokémon ${index}` : 'Pikachu ex', category: 'Pokemon', rarity: index < 2 ? 'Rare' : 'Common', setId: 'set-a', image: `image-${index}` }));
let binder = flex.normalizeFlexBinder({ id: 'flex-1' });
assert.equal(binder.slots.length, 9);
binder = flex.setFlexSlot(binder, 0, cards[0]);
binder = flex.setFlexSlot(binder, 8, cards[1]);
assert.equal(binder.slots.filter(Boolean).length, 2);
binder = flex.moveFlexSlot(binder, 0, 4);
assert.equal(binder.slots[4].collectibleKey, 'card-0');
binder = flex.removeFlexSlot(binder, 4);
assert.equal(binder.slots[4], null);
assert.equal(flex.setFlexSlot(binder, 9, cards[2]).slots.filter(Boolean).length, 1);
const shared = flex.toFlexBinderData(binder, 'Collector');
assert.deepEqual(Object.keys(shared).sort(), ['cards', 'collectorName', 'description', 'title', 'version']);
assert.equal(JSON.stringify(shared).includes('purchase'), false);
const persisted = JSON.parse(JSON.stringify({ binders: [binder], collectionQuantities: { 'card-0': 3 } }));
assert.equal(flex.normalizeFlexBinder(persisted.binders[0]).slots.length, 9);
assert.equal(persisted.collectionQuantities['card-0'], 3);
const duplicateFlex = flex.normalizeFlexBinder({ id: 'flex-legacy-2', title: 'Legacy second' });
const regularBinder = { id: 'set-binder', kind: 'set' };
const retained = flex.upsertPrimaryFlexBinder([binder, duplicateFlex, regularBinder], { id: 'attempted-new-flex', title: 'Updated primary' });
assert.equal(retained.length, 3);
assert.equal(retained.filter((item) => item.kind === 'flex').length, 2);
assert.equal(retained[0].id, binder.id);
assert.equal(retained[0].title, 'Updated primary');
assert.equal(retained[1].title, 'Legacy second');

const ownership = { 'card-0': 3, 'card-1': 1 };
const dna = analytics.calculateCollectorDNA(ownership, cards, [{ id: 'set-a', series: 'Test Era' }]);
assert.equal(dna.uniqueCards, 2); assert.equal(dna.totalPhysical, 4); assert.equal(dna.favoritePokemon[0], 'Pikachu');
const insight = analytics.calculateInsights(ownership, cards, [{ id: 'set-a', series: 'Test Era' }], [{ id: 'b1', kind: 'set', setId: 'set-a', tier: 'complete', name: 'Set A' }], [], () => cards.slice(0, 2));
assert.equal(insight.duplicateCopies, 2); assert.equal(insight.completedSets, 1);
const unlocked = milestones.evaluateMilestones({ totalPhysical: 100, binders: [binder], binderStats: [{ binder: { tier: 'base' }, total: 2, missing: 0 }] });
assert(unlocked.some((item) => item.id === 'cards-100')); assert(unlocked.some((item) => item.id === 'first-flex')); assert(unlocked.some((item) => item.id === 'first-base'));
assert.equal(analytics.calculateCollectorDNA({}, [], []).uniqueCards, 0);
for (const type of ['card-added', 'card-removed', 'quantity-changed', 'binder-created', 'binder-completed', 'wishlist-acquired', 'milestone-unlocked']) {
  const event = history.createHistoryEvent(type, { collectibleKey: 'card-0' });
  assert.equal(event.type, type); assert(Number.isFinite(new Date(event.timestamp).getTime()));
}
console.log('Release B domain validation passed: Flex slots, share-safe data, quantities, analytics, insights, and milestones.');
