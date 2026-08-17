import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { colors, type } from "../theme";
import TopBar from "../components/TopBar";
import { CARD_LIBRARY } from "../data";
import EmptyState from "../components/EmptyState";

const { width } = Dimensions.get("window");
const COLS = 3;
const GAP = 10;
const CARD_W = (width - 24 * 2 - GAP * (COLS - 1)) / COLS;
const TABS = ["All", "Recent", "Favorites"];

export default function CollectionAllScreen({
  navigate,
  collectionQuantities = {},
  vaultAssets = [],
}) {
  const [tab, setTab] = useState("All");
  const cards = CARD_LIBRARY.filter(
    (card) => Number(collectionQuantities[card.id] || 0) > 0,
  );
  const gradedCount = vaultAssets.filter((asset) => asset.type === "graded").length;
  const sealedCount = vaultAssets.filter((asset) => asset.type === "sealed").length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TopBar
        variant="title"
        onMenuPress={() => navigate("Menu")}
        onAvatarPress={() => navigate("Profile")}
      />

      <View style={styles.titleRow}>
        <View>
          <Text style={type.label}>COLLECTION</Text>
          <Text style={type.hugeNumber}>
            {String(cards.length).padStart(2, "0")}
          </Text>
        </View>
        <View style={styles.titleActions}>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => navigate("MyCollection")}
            accessibilityLabel="Add a card"
          >
            <Text style={styles.addIcon}>＋</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => navigate("CollectionFilters")}
            accessibilityLabel="Filter collection"
          >
            <Text style={styles.filterIcon}>⌕</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={styles.vaultEntry}
        onPress={() => navigate("Vault")}
        activeOpacity={0.82}
      >
        <View style={styles.vaultGlow} />
        <View style={styles.vaultIconWrap}>
          <Text style={styles.vaultIcon}>◇</Text>
        </View>
        <View style={styles.vaultContent}>
          <Text style={styles.vaultLabel}>COLLECTOR VAULT</Text>
          <Text style={styles.vaultTitle}>Your portfolio</Text>
          <Text style={styles.vaultText}>Graded cards · sealed products · market value</Text>
          <View style={styles.vaultMetaRow}>
            <Text style={styles.vaultMeta}>{gradedCount} GRADED</Text>
            <View style={styles.vaultDot} />
            <Text style={styles.vaultMeta}>{sealedCount} SEALED</Text>
          </View>
        </View>
        <View style={styles.vaultCta}>
          <Text style={styles.vaultCtaText}>OPEN</Text>
          <Text style={styles.vaultArrow}>›</Text>
        </View>
      </TouchableOpacity>

      {cards.length === 0 ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            icon="◇"
            title="Your collection is empty"
            subtitle="Open a set and tap Collect on any card to start."
            buttonLabel="Browse sets"
            onButtonPress={() => navigate("AllSets")}
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
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    marginTop: 20,
  },
  titleActions: { flexDirection: "row", gap: 9 },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },
  filterIcon: { color: colors.text, fontSize: 16 },
  addIcon: { color: colors.text, fontSize: 19 },
  tabs: { flexDirection: "row", paddingHorizontal: 24, marginTop: 20 },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: { backgroundColor: colors.purple, borderColor: colors.purple },
  tabText: { color: colors.textSecondary, fontSize: 12, fontWeight: "600" },
  tabTextActive: { color: colors.text },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginTop: 20,
    paddingBottom: 40,
  },
  tile: { marginBottom: 10 },
  image: { width: "100%", borderRadius: 8, backgroundColor: colors.card },
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
  vaultEntry: {
    marginHorizontal: 24,
    marginTop: 18,
    minHeight: 126,
    padding: 17,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.purple,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  vaultGlow: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: colors.purpleSoft,
    right: -75,
    top: -72,
  },
  vaultIconWrap: {
    width: 48,
    height: 72,
    borderRadius: 12,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  vaultIcon: { color: "#fff", fontSize: 24 },
  vaultContent: { flex: 1 },
  vaultLabel: {
    color: colors.purple,
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  vaultTitle: { color: colors.text, fontSize: 20, fontWeight: "500", marginTop: 5 },
  vaultText: { color: colors.textSecondary, fontSize: 8, marginTop: 5 },
  vaultMetaRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  vaultMeta: { color: colors.text, fontSize: 7, fontWeight: "700", letterSpacing: 0.8 },
  vaultDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.purple, marginHorizontal: 7 },
  vaultCta: {
    height: 34,
    paddingHorizontal: 11,
    borderRadius: 17,
    backgroundColor: colors.purple,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  vaultCtaText: { color: "#fff", fontSize: 7, fontWeight: "800", letterSpacing: 1 },
  vaultArrow: { color: "#fff", fontSize: 17, marginLeft: 4, marginTop: -1 },
});
