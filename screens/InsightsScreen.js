import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";
import TopBar from "../components/TopBar";
import { CARD_LIBRARY, SETS } from "../data";
import { getSetRequirements } from "../lib/collectibles";
import { calculateInsights } from "../lib/collectorAnalytics";
import { calculateVaultPortfolio } from "../lib/valueEngine";
import { calculateVaultInsights } from "../lib/vaultInsights";
import { useAppContext } from "../AppContext";
export default function InsightsScreen({
  goBack,
  collectionQuantities = {},
  binders = [],
  wishlistItems = [],
  vaultAssets = [],
  rawAcquisitions = {},
}) {
  const { preferences } = useAppContext();
  const data = useMemo(
    () =>
      calculateInsights(
        collectionQuantities,
        CARD_LIBRARY,
        SETS,
        binders,
        wishlistItems,
        getSetRequirements,
      ),
    [collectionQuantities, binders, wishlistItems],
  );
  const vault = useMemo(
    () =>
      calculateVaultPortfolio({
        ownership: collectionQuantities,
        cards: CARD_LIBRARY,
        assets: vaultAssets,
        rawAcquisitions,
        currency: preferences.currency || "EUR",
      }),
    [collectionQuantities, vaultAssets, rawAcquisitions, preferences.currency],
  );
  const vaultNotes = calculateVaultInsights(vault, wishlistItems);
  const stats = [
    ["Unique cards", data.uniqueCards],
    ["Physical cards", data.totalPhysical],
    ["Duplicate copies", data.duplicateCopies],
    ["Completed binders", data.completedSets],
    ["Wishlist", data.wishlistCount],
    ["Missing requirements", data.totalMissing],
  ];
  return (
    <ScrollView style={s.container}>
      <TopBar variant="back" onBackPress={goBack} />
      <View style={s.content}>
        <Text style={s.label}>COLLECTION INSIGHTS</Text>
        <Text style={s.title}>
          A quieter look at what is happening inside your collection.
        </Text>
        <View style={s.grid}>
          {stats.map(([label, value]) => (
            <View key={label} style={s.stat}>
              <Text style={s.value}>{value}</Text>
              <Text style={s.statLabel}>{label}</Text>
            </View>
          ))}
        </View>
        {[...data.observations, ...vaultNotes].map((text, i) => (
          <View key={text} style={s.observation}>
            <Text style={s.index}>{String(i + 1).padStart(2, "0")}</Text>
            <Text style={s.text}>{text}</Text>
          </View>
        ))}
        {!data.observations.length && !vaultNotes.length ? (
          <Text style={s.empty}>
            Create an active set binder or add Vault assets to unlock useful
            observations.
          </Text>
        ) : null}
      </View>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 24, paddingBottom: 50 },
  label: {
    color: colors.purple,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2.2,
    marginTop: 22,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "300",
    marginTop: 14,
    maxWidth: 330,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 34,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  stat: {
    width: "50%",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  value: { color: colors.text, fontSize: 30, fontWeight: "300" },
  statLabel: { color: colors.textSecondary, fontSize: 10, marginTop: 5 },
  observation: {
    flexDirection: "row",
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  index: { color: colors.textTertiary, fontSize: 9, width: 34 },
  text: { color: colors.text, fontSize: 17, lineHeight: 24, flex: 1 },
  empty: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 28,
  },
});
