import { supabase } from "./supabase";

const invoke = async (payload) => {
  const { data, error } = await supabase.functions.invoke("pokemon-provider-audit", { body: payload });
  if (error) {
    let detail = null;
    try { detail = await error.context?.json?.(); } catch { /* use generic message */ }
    throw new Error(detail?.error || error.message || "Live catalog unavailable");
  }
  if (data?.error) throw new Error(data.error);
  return data?.data || data;
};

const records = (payload) => Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];

const inferProductType = (name = "") => {
  const value = name.toLowerCase();
  if (value.includes("pokémon center") && value.includes("trainer box")) return "Pokémon Center ETB";
  if (value.includes("elite trainer box")) return "Elite Trainer Box";
  if (value.includes("booster box")) return "Booster Box";
  if (value.includes("booster bundle")) return "Booster Bundle";
  if (value.includes("sleeved booster")) return "Sleeved Booster";
  if (value.includes("booster")) return "Booster Pack";
  if (value.includes("build") && value.includes("battle")) return "Build & Battle Box";
  if (value.includes("blister")) return "Blister";
  if (value.includes("tin")) return "Tin";
  if (value.includes("deck")) return "Theme/Battle Deck";
  if (value.includes("collection")) return "Collection Box";
  return "Other";
};

export const searchProviderExpansions = async (query) => records(await invoke({ action: "search-expansions", query }));

export const getProviderSealedProducts = async (expansion) => {
  const payload = await invoke({ action: "expansion-products", expansionId: String(expansion.id), sort: "price_highest" });
  return records(payload).map((item) => {
    const market = item?.prices?.cardmarket || {};
    const value = market["7d_average"] ?? market["30d_average"] ?? market.lowest;
    return {
      id: `pokemon-api:${item.id}`,
      providerProductId: String(item.id),
      productName: item.name,
      productType: inferProductType(item.name),
      setName: item.episode?.name || expansion.name,
      setId: item.episode?.slug || expansion.slug || null,
      image: item.image || null,
      imageProvider: "pokemon-api-rapidapi",
      sourceUrl: item.tcggo_url || null,
      providerMarketValue: value == null ? null : {
        provider: "Pokémon TCG API",
        market: market["7d_average"] != null ? "Cardmarket 7-day average" : market["30d_average"] != null ? "Cardmarket 30-day average" : "Cardmarket lowest",
        currency: market.currency || "EUR",
        value,
        timestamp: new Date().toISOString(),
        condition: "Sealed",
      },
      marketSummary: market,
    };
  });
};

export const searchLiveSealedProducts = async (query) => {
  const expansions = await searchProviderExpansions(query);
  return expansions.length ? getProviderSealedProducts(expansions[0]) : [];
};
