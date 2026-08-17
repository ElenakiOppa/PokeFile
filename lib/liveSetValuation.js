import { getSetRequirements } from './collectibles';
import { getProviderExpansionCards, searchProviderExpansions } from './pokemonProvider';

const cache = new Map();

const textKey = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
const numberKey = (value) => {
  const match = String(value ?? '').match(/\d+/);
  return match ? String(Number(match[0])) : '';
};
const finishKey = (value) => {
  const key = textKey(value);
  if (key.includes('reverse')) return 'reverse';
  if (key.includes('masterball')) return 'masterball';
  if (key.includes('pokeball')) return 'pokeball';
  if (key.includes('cosmos')) return 'cosmosholo';
  if (key.includes('staff')) return 'staff';
  if (key.includes('stamp')) return 'stamped';
  if (key.includes('nonholo') || key === 'normal' || key === 'regular') return 'normal';
  if (key.includes('holo')) return 'holo';
  return key || 'canonical';
};

const firstPrice = (source) => {
  if (source == null) return null;
  if (Number.isFinite(Number(source))) return Number(source);
  if (typeof source !== 'object') return null;
  const preferred = ['7d_average', '7_day_average', 'avg7', 'market', 'trend', 'trend_price', '30d_average', '30_day_average', 'average_sell_price', 'lowest'];
  for (const key of preferred) {
    const value = Number(source[key]);
    if (Number.isFinite(value) && value > 0) return value;
  }
  return null;
};

const variantPriceEntries = (card) => {
  const market = card?.prices?.cardmarket || card?.cardmarket || card?.prices || {};
  const entries = [];
  const direct = firstPrice(market);
  if (direct != null) entries.push({ finish: finishKey(card.variant || card.finish || card.printing), value: direct });

  Object.entries(market || {}).forEach(([label, price]) => {
    if (!price || typeof price !== 'object') return;
    const value = firstPrice(price);
    if (value != null) entries.push({ finish: finishKey(label), value });
  });
  (Array.isArray(card?.variants) ? card.variants : []).forEach((variant) => {
    const value = firstPrice(variant?.prices?.cardmarket || variant?.prices || variant?.price);
    if (value != null) entries.push({ finish: finishKey(variant.finish || variant.variant || variant.name), value });
  });
  return entries;
};

const exactExpansion = (set, expansions) => {
  const target = textKey(set.name);
  return expansions.find((item) => textKey(item.name) === target)
    || expansions.find((item) => textKey(item.name).includes(target) || target.includes(textKey(item.name)))
    || expansions[0];
};

const loadPriceBook = async (set) => {
  const expansions = await searchProviderExpansions(set.name);
  const expansion = exactExpansion(set, expansions);
  if (!expansion?.id) throw new Error('Live expansion unavailable');
  const cards = await getProviderExpansionCards(expansion.id);
  const byNumber = new Map();

  cards.forEach((card) => {
    const number = numberKey(card.localId ?? card.local_id ?? card.number ?? card.card_number);
    if (!number) return;
    const entries = variantPriceEntries(card);
    if (!byNumber.has(number)) byNumber.set(number, []);
    entries.forEach((entry) => byNumber.get(number).push({
      ...entry,
      providerCardId: String(card.id || ''),
      name: card.name,
    }));
  });
  return { expansion, byNumber, fetchedAt: new Date().toISOString() };
};

const priceBookFor = (set) => {
  const key = String(set.id);
  if (!cache.has(key)) cache.set(key, loadPriceBook(set).catch((error) => {
    cache.delete(key);
    throw error;
  }));
  return cache.get(key);
};

const requirementPrice = (requirement, candidates = []) => {
  const requiredFinish = finishKey(requirement.finish || requirement.variant || requirement.variantKey);
  const exact = candidates.find((candidate) => candidate.finish === requiredFinish);
  if (exact) return exact.value;

  // A variantless provider record may represent the canonical expansion printing,
  // but it must never be reused for a parallel Master/Grandmaster finish.
  const isCanonical = !['reverse', 'masterball', 'pokeball', 'cosmosholo', 'staff', 'stamped'].includes(requiredFinish);
  if (isCanonical && candidates.length === 1 && candidates[0].finish === 'canonical') return candidates[0].value;
  return null;
};

export const getLiveSetValuations = async (set) => {
  let book;
  try {
    book = await priceBookFor(set);
  } catch (error) {
    // The synchronized Scrydex records remain provider-backed card prices and
    // keep valuation usable when the live endpoint is temporarily unavailable.
    book = { expansion: null, byNumber: new Map(), fetchedAt: null, liveError: error.message };
  }
  const availableTiers = set.availableTiers || ['complete', 'master'];
  const valuations = {};

  availableTiers.forEach((tier) => {
    const requirements = getSetRequirements(set, tier);
    let value = 0;
    let priced = 0;
    let livePriced = 0;
    let synchronizedPriced = 0;
    requirements.forEach((requirement) => {
      const livePrice = requirementPrice(requirement, book.byNumber.get(numberKey(requirement.number)) || []);
      const synchronizedPrice = Number(requirement.value ?? requirement.price);
      const price = livePrice ?? (Number.isFinite(synchronizedPrice) && synchronizedPrice > 0 ? synchronizedPrice : null);
      if (price == null) return;
      value += price;
      priced += 1;
      if (livePrice != null) livePriced += 1;
      else synchronizedPriced += 1;
    });
    valuations[tier] = {
      value,
      priced,
      livePriced,
      synchronizedPriced,
      unpriced: requirements.length - priced,
      required: requirements.length,
      complete: priced === requirements.length,
    };
  });

  return {
    valuations,
    provider: book.expansion ? 'Pokémon TCG API + Scrydex' : 'Scrydex synchronized provider data',
    expansionId: book.expansion?.id ? String(book.expansion.id) : null,
    fetchedAt: book.fetchedAt,
    liveError: book.liveError || null,
  };
};
