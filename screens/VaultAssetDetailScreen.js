import React, { useMemo } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme";
import { VaultHeader, MiniSparkline } from "../components/VaultUi";
import { CARD_LIBRARY } from "../data";
import { calculateVaultPortfolio, formatMoney } from "../lib/valueEngine";
import { useAppContext } from "../AppContext";
import { sealedAssetImageSource } from "../data/sealedProductCatalog";

export default function VaultAssetDetailScreen({ goBack, navigate, params = {}, vaultAssets = [], collectionQuantities = {}, rawAcquisitions = {}, deleteVaultAsset }) {
  const { preferences } = useAppContext();
  const currency = preferences.currency || "EUR";
  const asset = vaultAssets.find((a) => a.id === params.assetId);
  const portfolio = useMemo(() => calculateVaultPortfolio({ ownership: collectionQuantities, cards: CARD_LIBRARY, assets: vaultAssets, rawAcquisitions, currency }), [collectionQuantities, vaultAssets, rawAcquisitions, currency]);
  const valued = [...portfolio.gradedAssets, ...portfolio.sealedAssets].find((a) => a.id === asset?.id);
  if (!asset) return <View style={s.screen}><VaultHeader title="Asset Intelligence" goBack={goBack} /><Text style={s.missing}>This Vault asset is no longer available.</Text></View>;
  const graded = asset.type === "graded";
  const imageSource = graded ? asset.image ? { uri: asset.image } : null : sealedAssetImageSource(asset);
  const purchase = asset.acquisitions?.reduce((sum, lot) => sum + Number(lot.quantity || 1) * Number(lot.unitCost || 0), 0) || 0;
  const value = valued?.quote ? Number(valued.value || 0) : 0;
  const gain = value - purchase;
  const gainPercent = purchase ? (gain / purchase) * 100 : 0;
  const edit = () => navigate(graded ? "AddGradedAsset" : "AddSealedAsset", { assetId: asset.id });
  const remove = () => Alert.alert("Remove Vault asset?", "This will not change raw card ownership or set data.", [{ text: "Cancel", style: "cancel" }, { text: "Remove", style: "destructive", onPress: () => { deleteVaultAsset(asset.id); goBack(); } }]);

  return <View style={s.screen}>
    <VaultHeader title="Asset Intelligence" goBack={goBack} onRight={remove} />
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <View style={s.hero}>{imageSource ? <Image source={imageSource} style={s.heroImage} resizeMode="contain" /> : <View style={[s.heroImage, s.noImage]}><Text style={s.noImageText}>ARTWORK UNAVAILABLE</Text></View>}</View>
      <View style={s.titleBlock}>
        <View style={s.tag}><Text style={s.tagText}>{graded ? `${asset.company} ${asset.grade}` : asset.productType || "SEALED"}</Text></View>
        <Text style={s.title}>{graded ? asset.name : asset.productName}</Text>
      </View>
      <View style={s.valuation}>
        <View style={s.valueRow}><View><Text style={s.metricLabel}>EST. MARKET VALUE</Text><Text style={s.marketValue}>{valued?.quote ? formatMoney(value, currency) : "Unavailable"}</Text></View><View style={s.purchase}><Text style={s.metricLabel}>PURCHASE PRICE</Text><Text style={s.purchaseValue}>{purchase ? formatMoney(purchase, currency) : "Not recorded"}</Text></View></View>
        <View style={s.divider} />
        <View style={s.pnlRow}><Text style={s.pnlLabel}>Total Profit / Loss</Text><View style={[s.pnlBadge, gain < 0 && s.pnlLoss]}><Text style={[s.pnlText, gain < 0 && s.lossText]}>{purchase && valued?.quote ? `${gain >= 0 ? "+" : ""}${formatMoney(gain, currency)} (${gainPercent >= 0 ? "+" : ""}${gainPercent.toFixed(1)}%)` : "Unavailable"}</Text></View></View>
      </View>
      <View style={s.trend}><Text style={s.metricLabel}>6-MONTH PRICE TREND</Text><MiniSparkline values={purchase && value ? [purchase, purchase + gain * .25, purchase + gain * .55, value] : [value, value]} height={52} color="#10B981" /></View>
      <View style={s.notes}><Text style={s.metricLabel}>MY NOTES</Text><Text style={s.notesText}>{asset.note || "No private notes recorded for this asset."}</Text></View>
      <View style={s.actions}><TouchableOpacity style={s.edit} onPress={edit}><Text style={s.editText}>Edit Details</Text></TouchableOpacity><TouchableOpacity style={s.remove} onPress={remove}><Text style={s.removeText}>Remove from Vault</Text></TouchableOpacity></View>
    </ScrollView>
  </View>;
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg }, content: { paddingHorizontal: 24, paddingBottom: 24, gap: 16 }, missing: { color: colors.textSecondary, margin: 24 },
  hero: { minHeight: 280, borderRadius: 24, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16, alignItems: "center", justifyContent: "center" }, heroImage: { width: 220, height: 260, borderRadius: 12 }, noImage: { backgroundColor: colors.card, alignItems: "center", justifyContent: "center" }, noImageText: { color: colors.textTertiary, fontSize: 9, letterSpacing: 1 },
  titleBlock: { gap: 8 }, tag: { alignSelf: "flex-start", borderRadius: 8, borderWidth: 1, borderColor: colors.purple, backgroundColor: colors.purpleSoft, paddingHorizontal: 9, paddingVertical: 4 }, tagText: { color: colors.purple, fontSize: 10, fontWeight: "800", textTransform: "uppercase" }, title: { color: colors.text, fontSize: 19, lineHeight: 25, fontWeight: "800" },
  valuation: { borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16, gap: 14 }, valueRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }, metricLabel: { color: colors.textTertiary, fontSize: 9, fontWeight: "600" }, marketValue: { color: colors.purple, fontSize: 21, fontWeight: "800", marginTop: 6 }, purchase: { alignItems: "flex-end" }, purchaseValue: { color: colors.textSecondary, fontSize: 13, fontWeight: "700", marginTop: 6 }, divider: { height: 1, backgroundColor: colors.border }, pnlRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, pnlLabel: { color: colors.textSecondary, fontSize: 10 }, pnlBadge: { borderRadius: 6, backgroundColor: "rgba(16,185,129,.1)", paddingHorizontal: 8, paddingVertical: 5 }, pnlLoss: { backgroundColor: "rgba(239,68,68,.1)" }, pnlText: { color: "#10B981", fontSize: 9, fontWeight: "800" }, lossText: { color: colors.red },
  trend: { minHeight: 94, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16, gap: 8 }, notes: { borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16 }, notesText: { color: colors.textSecondary, fontSize: 10, lineHeight: 15, marginTop: 7 },
  actions: { flexDirection: "row", gap: 12 }, edit: { flex: 1, height: 48, borderRadius: 14, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }, editText: { color: colors.text, fontSize: 11, fontWeight: "700" }, remove: { flex: 1, height: 48, borderRadius: 14, backgroundColor: colors.purple, alignItems: "center", justifyContent: "center" }, removeText: { color: colors.bg, fontSize: 11, fontWeight: "800" },
});
