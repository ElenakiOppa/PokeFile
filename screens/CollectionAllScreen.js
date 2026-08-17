import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";
import { colors } from "../theme";
import { CARD_LIBRARY } from "../data";
import EmptyState from "../components/EmptyState";

const { width } = Dimensions.get("window");
const COLS = 2;
const GAP = 12;
const CARD_W = (width - 24 * 2 - GAP * (COLS - 1)) / COLS;

export default function CollectionAllScreen({
  navigate,
  collectionQuantities = {},
  vaultAssets = [],
  rawAcquisitions = {},
  collectionFilters = {},
  setCollectionFilters = () => {},
}) {
  const [query, setQuery] = useState("");
  const quantityFor = (card) => Number(collectionQuantities[card.id] || 0);
  const activeFilterCount = [
    collectionFilters.set && collectionFilters.set !== "All Sets",
    collectionFilters.rarity && collectionFilters.rarity !== "All",
    collectionFilters.condition && collectionFilters.condition !== "All",
    collectionFilters.ownership && collectionFilters.ownership !== "Owned",
  ].filter(Boolean).length;
  const cards = CARD_LIBRARY.filter((card) => {
    const quantity = quantityFor(card);
    const ownership = collectionFilters.ownership || "Owned";
    if (ownership === "Owned" && quantity <= 0) return false;
    if (ownership === "Missing" && quantity > 0) return false;
    if (collectionFilters.set && collectionFilters.set !== "All Sets" && card.setName !== collectionFilters.set) return false;
    if (collectionFilters.rarity && collectionFilters.rarity !== "All" && card.rarity !== collectionFilters.rarity) return false;
    if (collectionFilters.condition && collectionFilters.condition !== "All") {
      if (quantity <= 0 || (rawAcquisitions[card.id]?.condition || "Raw") !== collectionFilters.condition) return false;
    }
    return `${card.name} ${card.setName || ""} ${card.number || ""}`.toLowerCase().includes(query.trim().toLowerCase());
  });
  const ownedCount = CARD_LIBRARY.filter((card) => quantityFor(card) > 0).length;
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.pageEyebrow}>YOUR LIBRARY</Text>
          <Text style={styles.pageTitle}>Collection</Text>
          <Text style={styles.pageCount}>{cards.length} cards shown · {ownedCount} owned</Text>
        </View>
        <TouchableOpacity style={styles.vaultPill} onPress={() => navigate("Vault")}>
          <Text style={styles.vaultPillText}>VAULT</Text>
          <Text style={styles.vaultPillArrow}>↗</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchRow}>
        <View style={styles.searchField}>
          <Text style={styles.searchGlyph}>⌕</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search collection"
            placeholderTextColor={colors.textTertiary}
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.searchFilter} onPress={() => navigate("CollectionFilters")}>
          <Text style={styles.searchFilterText}>≡</Text>
          {activeFilterCount > 0 && <View style={styles.filterBadge}><Text style={styles.filterBadgeText}>{activeFilterCount}</Text></View>}
        </TouchableOpacity>
      </View>

      {cards.length === 0 ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            icon="◇"
            title={ownedCount > 0 || activeFilterCount > 0 || query ? "No cards match" : "Your collection is empty"}
            subtitle={ownedCount > 0 || activeFilterCount > 0 || query ? "Try clearing the filters or changing your search." : "Open a set and tap Collect on any card to start."}
            buttonLabel={ownedCount > 0 || activeFilterCount > 0 || query ? "Clear filters" : "Browse sets"}
            onButtonPress={() => {
              if (ownedCount > 0 || activeFilterCount > 0 || query) {
                setQuery("");
                setCollectionFilters({ set: "All Sets", rarity: "All", condition: "All", ownership: "Owned" });
              } else navigate("AllSets");
            }}
          />
        </View>
      ) : (
        <View style={styles.grid}>
          {cards.map((card, i) => (
            <TouchableOpacity
              key={`${card.id}-${i}`}
              style={[styles.tile, { width: CARD_W }]}
              onPress={() => navigate("CardDetail", { cardId: card.id })}
            >
              <Image
                source={{ uri: card.image }}
                style={[styles.image, { height: CARD_W * 1.4 }]}
                resizeMode="contain"
              />
              <Text style={styles.cardName} numberOfLines={1}>{card.name}</Text>
              <Text style={styles.cardMeta} numberOfLines={1}>{card.setName || card.setId} · #{card.number}</Text>
              <Text style={styles.cardValue}>€{Number(card.value || 0).toFixed(2)}</Text>
              <View style={styles.quantityBadge}>
                <Text style={styles.quantityText}>
                  {collectionQuantities[card.id]}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  pageEyebrow: { color: colors.textTertiary, fontSize: 8, fontWeight: "700", letterSpacing: 1.3 },
  pageTitle: { color: colors.text, fontSize: 29, fontWeight: "700", marginTop: 4 },
  pageCount: { color: colors.textSecondary, fontSize: 10, marginTop: 3 },
  vaultPill: { height: 38, borderRadius: 19, borderWidth: 1, borderColor: colors.purple, paddingHorizontal: 14, flexDirection: "row", alignItems: "center" },
  vaultPillText: { color: colors.purple, fontSize: 8, fontWeight: "800", letterSpacing: 1.2 },
  vaultPillArrow: { color: colors.purple, fontSize: 13, marginLeft: 7 },
  searchRow: { flexDirection: "row", gap: 9, paddingHorizontal: 24, marginTop: 18 },
  searchField: { flex: 1, height: 44, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: "row", alignItems: "center", paddingHorizontal: 12 },
  searchGlyph: { color: colors.textTertiary, fontSize: 17, marginRight: 8 },
  searchInput: { flex: 1, color: colors.text, fontSize: 12, paddingVertical: 0 },
  searchFilter: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  searchFilterText: { color: colors.purple, fontSize: 18, transform: [{ rotate: "90deg" }] },
  filterBadge: { position: "absolute", top: -5, right: -5, minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 4, backgroundColor: colors.purple, alignItems: "center", justifyContent: "center" },
  filterBadgeText: { color: colors.bg, fontSize: 9, fontWeight: "800" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginTop: 18,
    paddingBottom: 40,
  },
  tile: { marginBottom: 20 },
  image: { width: "100%", borderRadius: 8, backgroundColor: colors.card },
  cardName: { color: colors.text, fontSize: 12, fontWeight: "700", marginTop: 8 },
  cardMeta: { color: colors.textTertiary, fontSize: 8, marginTop: 3 },
  cardValue: { color: colors.purple, fontSize: 11, fontWeight: "700", marginTop: 5 },
  quantityBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  quantityText: { color: colors.text, fontSize: 10, fontWeight: "700" },
  emptyWrap: { height: 420 },
});
