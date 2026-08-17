import React, { useMemo } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import { CARD_LIBRARY } from "../data";
import { calculateVaultPortfolio, formatMoney } from "../lib/valueEngine";
import { useAppContext } from "../AppContext";
import { sealedAssetImageSource } from "../data/sealedProductCatalog";
import { MiniSparkline, SectionLabel, VaultHeader } from "../components/VaultUi";

export default function VaultScreen({ navigate, collectionQuantities = {}, vaultAssets = [], rawAcquisitions = {}, valueSnapshots = [] }) {
  const { preferences } = useAppContext();
  const currency = preferences.currency || "EUR";
  const portfolio = useMemo(() => calculateVaultPortfolio({ ownership: collectionQuantities, cards: CARD_LIBRARY, assets: vaultAssets, rawAcquisitions, currency }), [collectionQuantities, vaultAssets, rawAcquisitions, currency]);
  const snapshots = [...valueSnapshots].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const monthStart = snapshots.find((item) => Date.now() - new Date(item.timestamp).getTime() <= 31 * 86400000)?.totalValue ?? snapshots[0]?.totalValue ?? portfolio.totalValue;
  const monthChange = portfolio.totalValue - Number(monthStart || 0);
  const monthPercent = monthStart ? (monthChange / monthStart) * 100 : 0;
  const allocationTotal = portfolio.gradedValue + portfolio.sealedValue || 1;
  const topAssets = [...portfolio.gradedAssets, ...portfolio.sealedAssets].sort((a, b) => Number(b.value || 0) - Number(a.value || 0)).slice(0, 3);
  const imageFor = (item) => item.card?.image ? { uri: item.card.image } : item.type === "sealed" ? sealedAssetImageSource(item) : item.image ? { uri: item.image } : null;

  return <View style={s.screen}>
    <VaultHeader title="My Vault" onRight={() => navigate("Notifications")} rightIcon="notifications-outline" />
    <View style={s.vaultTabs}><VaultTab icon="shield-checkmark-outline" label="Overview" active onPress={() => {}} /><VaultTab icon="add-circle-outline" label="Add Asset" onPress={() => navigate("AddVaultAsset")} /><VaultTab icon="analytics-outline" label="History" onPress={() => navigate("ValueHistory")} /></View>
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <View style={s.valuationCard}>
        <Text style={s.kicker}>TOTAL EST. VAULT VALUE</Text>
        <Text style={s.total}>{formatMoney(portfolio.totalValue, currency)}</Text>
        <View style={s.changeBadge}><Text style={s.changeText}>{monthChange >= 0 ? "↑ +" : "↓ "}{formatMoney(monthChange, currency)} ({monthPercent >= 0 ? "+" : ""}{monthPercent.toFixed(2)}%) This Month</Text></View>
        <View style={s.spark}><MiniSparkline values={snapshots.map((item) => item.totalValue).concat(portfolio.totalValue)} /></View>
      </View>

      <View style={s.section}><SectionLabel>Asset Allocation</SectionLabel><View style={s.allocationRow}>
        <Allocation title="Graded Cards" value={formatMoney(portfolio.gradedValue, currency)} meta={`${portfolio.gradedAssets.length} Items • ${((portfolio.gradedValue / allocationTotal) * 100).toFixed(1)}%`} />
        <Allocation title="Sealed Boxes" value={formatMoney(portfolio.sealedValue, currency)} meta={`${portfolio.sealedAssets.length} Items • ${((portfolio.sealedValue / allocationTotal) * 100).toFixed(1)}%`} />
      </View></View>

      <View style={s.section}><SectionLabel action="View All" onAction={() => navigate("CollectionAll")}>Top Value Assets</SectionLabel><View style={s.assets}>
        {topAssets.length ? topAssets.map((item) => <TouchableOpacity key={item.id} style={s.assetRow} onPress={() => navigate("VaultAssetDetail", { assetId: item.id })}>
          {imageFor(item) ? <Image source={imageFor(item)} style={s.thumb} resizeMode="contain" /> : <View style={[s.thumb, s.emptyThumb]}><Text style={s.emptyMark}>◇</Text></View>}
          <View style={s.assetCopy}><Text style={s.assetName} numberOfLines={1}>{item.card?.name || item.productName || item.name}</Text><Text style={s.assetMeta} numberOfLines={1}>{item.type === "graded" ? `${item.company} ${item.grade}` : `${item.productType || "Sealed"} · ×${item.quantity}`}</Text></View>
          <View style={s.assetRight}><Text style={s.assetValue}>{item.quote ? formatMoney(item.value, currency) : "Unavailable"}</Text><Text style={s.assetMove}>{item.manualOverride ? "MANUAL" : "LIVE VALUE"}</Text></View>
        </TouchableOpacity>) : <View style={s.empty}><Text style={s.emptyTitle}>No premium assets yet</Text><Text style={s.emptyText}>Add a graded card or sealed product to begin your Vault.</Text></View>}
      </View></View>

    </ScrollView>
  </View>;
}

const Allocation = ({ title, value, meta }) => <View style={s.allocation}><Text style={s.allocationTitle}>{title}</Text><Text style={s.allocationValue}>{value}</Text><Text style={s.allocationMeta}>{meta}</Text></View>;
const VaultTab = ({ icon, label, active, onPress }) => <TouchableOpacity style={s.vaultTab} onPress={onPress}><Ionicons name={icon} size={19} color={active ? colors.purple : colors.textTertiary} /><Text style={[s.vaultTabText, active && s.vaultTabActive]}>{label}</Text></TouchableOpacity>;

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg }, content: { paddingHorizontal: 20, paddingBottom: 36 },
  valuationCard: { minHeight: 205, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 20 },
  kicker: { color: colors.textSecondary, fontSize: 10, fontWeight: "600" }, total: { color: colors.text, fontSize: 34, fontWeight: "800", marginTop: 4 },
  changeBadge: { alignSelf: "flex-start", borderRadius: 6, backgroundColor: "rgba(16,185,129,0.1)", paddingHorizontal: 8, paddingVertical: 4, marginTop: 5 }, changeText: { color: "#10B981", fontSize: 9, fontWeight: "700" }, spark: { flex: 1, justifyContent: "flex-end", paddingTop: 10 },
  section: { marginTop: 24 }, allocationRow: { flexDirection: "row", gap: 12, marginTop: 12 }, allocation: { flex: 1, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16 },
  allocationTitle: { color: colors.textSecondary, fontSize: 11 }, allocationValue: { color: colors.purple, fontSize: 17, fontWeight: "800", marginTop: 8 }, allocationMeta: { color: colors.textTertiary, fontSize: 8, marginTop: 8 },
  assets: { gap: 8, marginTop: 12 }, assetRow: { minHeight: 66, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 10, flexDirection: "row", alignItems: "center", gap: 10 }, thumb: { width: 46, height: 46, borderRadius: 8, backgroundColor: colors.card }, emptyThumb: { alignItems: "center", justifyContent: "center" }, emptyMark: { color: colors.purple },
  assetCopy: { flex: 1, minWidth: 0 }, assetName: { color: colors.text, fontSize: 11, fontWeight: "700" }, assetMeta: { color: colors.textTertiary, fontSize: 8, marginTop: 3 }, assetRight: { alignItems: "flex-end", maxWidth: 88 }, assetValue: { color: colors.text, fontSize: 10, fontWeight: "800" }, assetMove: { color: "#10B981", fontSize: 7, fontWeight: "700", marginTop: 4 },
  empty: { padding: 22, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }, emptyTitle: { color: colors.text, fontSize: 13, fontWeight: "700" }, emptyText: { color: colors.textSecondary, fontSize: 9, lineHeight: 14, marginTop: 5 },
  vaultTabs: { height: 52, marginHorizontal: 20, marginBottom: 16, padding: 4, borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: "row" }, vaultTab: { flex: 1, borderRadius: 11, flexDirection: "row", gap: 6, alignItems: "center", justifyContent: "center" }, vaultTabText: { color: colors.textTertiary, fontSize: 10, fontWeight: "700" }, vaultTabActive: { color: colors.purple, fontWeight: "800" },
});
