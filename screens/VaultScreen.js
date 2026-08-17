import React, { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../theme";
import EmptyState from "../components/EmptyState";
import { CARD_LIBRARY } from "../data";
import { calculateVaultPortfolio, formatMoney } from "../lib/valueEngine";
import { calculateVaultInsights } from "../lib/vaultInsights";
import { useAppContext } from "../AppContext";
import { sealedAssetImageSource } from "../data/sealedProductCatalog";
const TABS = ["Raw", "Graded", "Sealed"];
export default function VaultScreen({
  navigate,
  collectionQuantities = {},
  vaultAssets = [],
  wishlistItems = [],
  rawAcquisitions = {},
}) {
  const { preferences } = useAppContext();
  const currency = preferences.currency || "EUR";
  const [tab, setTab] = useState("Raw");
  const portfolio = useMemo(
    () =>
      calculateVaultPortfolio({
        ownership: collectionQuantities,
        cards: CARD_LIBRARY,
        assets: vaultAssets,
        rawAcquisitions,
        currency,
      }),
    [collectionQuantities, vaultAssets, rawAcquisitions, currency],
  );
  const items =
    tab === "Raw"
      ? portfolio.rawAssets
      : tab === "Graded"
        ? portfolio.gradedAssets
        : portfolio.sealedAssets;
  const insights = calculateVaultInsights(portfolio, wishlistItems);
  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      <View style={s.head}>
        <Text style={s.label}>PORTFOLIO VAULT</Text>
        <Text style={s.title}>Your assets</Text>
        <Text style={s.value}>
          {formatMoney(portfolio.totalValue, currency)}
        </Text>
        <Text style={s.sub}>Collection Value</Text>
      </View>
      <View style={s.breakdown}>
        {[
          ["Raw", portfolio.rawValue],
          ["Graded", portfolio.gradedValue],
          ["Sealed", portfolio.sealedValue],
        ].map(([label, value]) => (
          <View key={label}>
            <Text style={s.breakValue}>{formatMoney(value, currency)}</Text>
            <Text style={s.breakLabel}>{label}</Text>
          </View>
        ))}
      </View>
      {portfolio.trackedCostBasis > 0 ? (
        <View style={s.tracked}>
          <Text style={s.trackedLabel}>TRACKED COST BASIS</Text>
          <Text style={s.trackedValue}>
            {formatMoney(portfolio.trackedCostBasis, currency)}
          </Text>
          <Text style={s.trackedMeta}>
            {formatMoney(portfolio.trackedAssetsValue, currency)} tracked value
            · {Math.round(portfolio.coveragePercent)}% value coverage
          </Text>
          <Text style={s.trackedGain}>
            {portfolio.unrealizedGain >= 0 ? "+" : ""}
            {formatMoney(portfolio.unrealizedGain, currency)} unrealized on
            tracked assets
          </Text>
        </View>
      ) : null}
      <View style={s.actions}>
        <TouchableOpacity
          style={s.primary}
          onPress={() => navigate("AddGradedAsset")}
        >
          <Text style={s.primaryText}>Add Graded Card</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={s.secondary}
          onPress={() => navigate("AddSealedAsset")}
        >
          <Text style={s.secondaryText}>Add Sealed Product</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={s.historyLink}
        onPress={() => navigate("ValueHistory")}
      >
        <Text style={s.historyText}>View Value History</Text>
        <Text style={s.chevron}>›</Text>
      </TouchableOpacity>
      <View style={s.tabs}>
        {TABS.map((item) => (
          <TouchableOpacity
            key={item}
            style={[s.tab, tab === item && s.tabActive]}
            onPress={() => setTab(item)}
          >
            <Text style={[s.tabText, tab === item && s.tabTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {items.length ? (
        <View style={s.list}>
          {items.map((item) => {
            const imageSource = item.card?.image
              ? { uri: item.card.image }
              : item.type === "sealed"
                ? sealedAssetImageSource(item)
                : item.image
                  ? { uri: item.image }
                  : null;
            return (
            <TouchableOpacity
              key={item.id}
              style={s.row}
              onPress={() =>
                item.type === "raw"
                  ? navigate("CardDetail", { cardId: item.id })
                  : navigate("VaultAssetDetail", { assetId: item.id })
              }
            >
              {imageSource ? (
                <Image
                  source={imageSource}
                  style={s.thumb}
                  resizeMode="contain"
                />
              ) : (
                <View style={[s.thumb, s.noImage]}>
                  <Text style={s.noImageText}>◇</Text>
                </View>
              )}
              <View style={s.rowCopy}>
                <Text style={s.name}>
                  {item.card?.name || item.productName || item.name}
                </Text>
                <Text style={s.meta}>
                  {item.type === "graded"
                    ? `${item.company} ${item.grade}`
                    : item.type === "sealed"
                      ? `${item.productType} · ${item.sourceType}`
                      : `${item.card.variant || item.card.finish} · ×${item.quantity}`}
                </Text>
                {item.manualOverride ? (
                  <Text style={s.override}>MANUAL VALUE</Text>
                ) : null}
              </View>
              <View>
                <Text style={s.rowValue}>
                  {item.quote
                    ? formatMoney(item.value, currency)
                    : "Unavailable"}
                </Text>
                <Text style={s.qty}>×{item.quantity}</Text>
              </View>
            </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={s.empty}>
          {tab === "Raw" ? (
            <EmptyState
              icon="◇"
              title="No raw cards yet"
              subtitle="Owned raw cards appear here automatically."
              buttonLabel="Browse sets"
              onButtonPress={() => navigate("AllSets")}
            />
          ) : (
            <EmptyState
              icon="◇"
              title={
                tab === "Graded"
                  ? "No graded cards yet"
                  : "No sealed products yet"
              }
              subtitle="Your best cardboard is still hiding elsewhere."
              buttonLabel={
                tab === "Graded" ? "Add Graded Card" : "Add Sealed Product"
              }
              onButtonPress={() =>
                navigate(tab === "Graded" ? "AddGradedAsset" : "AddSealedAsset")
              }
            />
          )}
        </View>
      )}
      {insights.length ? (
        <View style={s.insights}>
          <Text style={s.insightLabel}>VAULT NOTES</Text>
          {insights.map((line) => (
            <Text key={line} style={s.insight}>
              {line}
            </Text>
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  head: { paddingHorizontal: 24, paddingTop: 24 },
  label: {
    color: colors.textTertiary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
  },
  title: { color: colors.text, fontSize: 29, fontWeight: "700", marginTop: 4 },
  value: { color: colors.text, fontSize: 48, fontWeight: "300", marginTop: 12 },
  sub: { color: colors.textSecondary, fontSize: 12, marginTop: 3 },
  breakdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginTop: 30,
  },
  breakValue: { color: colors.text, fontSize: 15, fontWeight: "500" },
  breakLabel: { color: colors.textTertiary, fontSize: 9, marginTop: 5 },
  tracked: {
    margin: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  trackedLabel: { color: colors.textTertiary, fontSize: 8, letterSpacing: 1.4 },
  trackedValue: {
    color: colors.text,
    fontSize: 25,
    fontWeight: "300",
    marginTop: 8,
  },
  trackedMeta: { color: colors.textSecondary, fontSize: 9, marginTop: 5 },
  trackedGain: { color: colors.purple, fontSize: 10, marginTop: 8 },
  actions: {
    flexDirection: "row",
    gap: 9,
    marginHorizontal: 24,
    marginTop: 24,
  },
  primary: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  secondary: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: { color: colors.text, fontSize: 10, fontWeight: "700" },
  historyLink: {
    marginHorizontal: 24,
    marginTop: 15,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  historyText: { color: colors.text, fontSize: 13 },
  chevron: { color: colors.textSecondary },
  tabs: { flexDirection: "row", marginHorizontal: 24, marginTop: 28 },
  tab: {
    paddingHorizontal: 17,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  tabActive: { backgroundColor: colors.purple, borderColor: colors.purple },
  tabText: { color: colors.textSecondary, fontSize: 11, fontWeight: "600" },
  tabTextActive: { color: "#fff" },
  list: { paddingHorizontal: 24, marginTop: 17 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  thumb: {
    width: 52,
    height: 68,
    borderRadius: 7,
    backgroundColor: colors.card,
  },
  noImage: { alignItems: "center", justifyContent: "center" },
  noImageText: { color: colors.purple },
  rowCopy: { flex: 1, marginLeft: 13 },
  name: { color: colors.text, fontSize: 14, fontWeight: "600" },
  meta: { color: colors.textSecondary, fontSize: 9, marginTop: 4 },
  override: {
    color: colors.purple,
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 4,
  },
  rowValue: { color: colors.text, fontSize: 12, textAlign: "right" },
  qty: {
    color: colors.textTertiary,
    fontSize: 8,
    textAlign: "right",
    marginTop: 5,
  },
  empty: { height: 330 },
  insights: {
    margin: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  insightLabel: {
    color: colors.textTertiary,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  insight: { color: colors.text, fontSize: 15, lineHeight: 22, marginTop: 14 },
});
