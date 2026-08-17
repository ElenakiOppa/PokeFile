import React, { useMemo } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { colors } from "../theme";
import TopBar from "../components/TopBar";
import { CARD_LIBRARY } from "../data";
import { calculateVaultPortfolio, formatMoney } from "../lib/valueEngine";
import { useAppContext } from "../AppContext";
import { sealedAssetImageSource } from "../data/sealedProductCatalog";
export default function VaultAssetDetailScreen({
  goBack,
  navigate,
  params = {},
  vaultAssets = [],
  collectionQuantities = {},
  rawAcquisitions = {},
  deleteVaultAsset,
}) {
  const { height } = useWindowDimensions();
  const compact = height < 760;
  const { preferences } = useAppContext();
  const asset = vaultAssets.find((a) => a.id === params.assetId);
  const portfolio = useMemo(
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
  const valued = [...portfolio.gradedAssets, ...portfolio.sealedAssets].find(
    (a) => a.id === asset?.id,
  );
  if (!asset)
    return (
      <View style={s.container}>
        <TopBar variant="back" onBackPress={goBack} onSearchPress={() => navigate('Search')} />
        <Text style={s.missing}>This Vault asset is no longer available.</Text>
      </View>
    );
  const graded = asset.type === "graded";
  const imageSource = graded
    ? asset.image
      ? { uri: asset.image }
      : null
    : sealedAssetImageSource(asset);
  const edit = () =>
    navigate(graded ? "AddGradedAsset" : "AddSealedAsset", {
      assetId: asset.id,
    });
  const remove = () =>
    Alert.alert(
      "Remove Vault asset?",
      `This will not change raw card ownership or set data.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            deleteVaultAsset(asset.id);
            goBack();
          },
        },
      ],
    );
  return (
    <View style={s.container}>
      <TopBar variant="back" onBackPress={goBack} onSearchPress={() => navigate('Search')} />
      <View style={[s.content, compact && s.contentCompact]}>
        {imageSource ? (
          <Image
            source={imageSource}
            style={[s.image, compact && s.imageCompact]}
            resizeMode="contain"
          />
        ) : (
          <View style={[s.image, compact && s.imageCompact, s.noImage]}>
            <Text style={s.noImageMark}>◇</Text>
            <Text style={s.noImageText}>ARTWORK UNAVAILABLE</Text>
          </View>
        )}
        <Text style={s.eyebrow}>
          {graded ? "GRADED CARD" : "SEALED PRODUCT"}
        </Text>
        <Text style={[s.title, compact && s.titleCompact]} numberOfLines={2} adjustsFontSizeToFit>
          {graded ? asset.name : asset.productName}
        </Text>
        <Text style={s.subtitle} numberOfLines={1}>
          {graded
            ? `${asset.company} ${asset.grade} · ${asset.finish || "Unknown finish"}`
            : `${asset.productType} · ${asset.imageProvider === "pokemon-official" ? "Official catalog" : asset.sourceType === "provider" ? "Provider-backed" : "User-created"}`}
        </Text>
        <View style={[s.valueBlock, compact && s.valueBlockCompact]}>
          <Text style={s.value}>
            {valued?.quote
              ? formatMoney(valued.value, portfolio.currency)
              : "Market value unavailable"}
          </Text>
          <Text style={s.valueLabel}>
            {valued?.manualOverride
              ? "MANUAL VALUE OVERRIDE"
              : valued?.quote
                ? `${valued.quote.provider} · ${valued.quote.market}`
                : "NO COMPATIBLE PRICE SOURCE"}
          </Text>
        </View>
        <View style={s.details}>
          <Row label="Quantity" value={String(asset.quantity)} />
          {asset.setName ? <Row label="Set" value={asset.setName} /> : null}
          {graded && asset.certificationNumber ? (
            <Row
              label="Certification · Private"
              value={asset.certificationNumber}
            />
          ) : null}
          {asset.acquisitions?.length ? (
            <>
              <Row
                label="Purchase cost · Private"
                value={formatMoney(
                  asset.acquisitions.reduce(
                    (sum, lot) =>
                      sum + Number(lot.quantity) * Number(lot.unitCost || 0),
                    0,
                  ),
                  portfolio.currency,
                )}
              />
              <Row
                label="Purchase date · Private"
                value={asset.acquisitions[0].date || "Not recorded"}
              />
            </>
          ) : (
            <Row label="Purchase information" value="Not recorded" />
          )}
          {asset.acquisitionSource ? (
            <Row label="Source · Private" value={asset.acquisitionSource} />
          ) : null}
          {asset.note ? <Row label="Private note" value={asset.note} /> : null}
        </View>
        <View style={s.actions}>
          <TouchableOpacity style={s.edit} onPress={edit}>
            <Text style={s.editText}>Edit Asset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.remove} onPress={remove}>
            <Text style={s.removeText}>Remove from Vault</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const Row = ({ label, value }) => (
  <View style={s.row}>
    <Text style={s.rowLabel}>{label}</Text>
    <Text style={s.rowValue} numberOfLines={1}>{value}</Text>
  </View>
);
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, paddingHorizontal: 24, paddingBottom: 8 },
  contentCompact: { paddingHorizontal: 20 },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  imageCompact: { height: 150 },
  noImage: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  noImageMark: { color: colors.purple, fontSize: 28 },
  noImageText: {
    color: colors.textTertiary,
    fontSize: 8,
    letterSpacing: 1.2,
    marginTop: 8,
  },
  eyebrow: {
    color: colors.purple,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 2,
    marginTop: 16,
  },
  title: { color: colors.text, fontSize: 27, lineHeight: 32, fontWeight: "300", marginTop: 7 },
  titleCompact: { fontSize: 22, lineHeight: 26 },
  subtitle: { color: colors.textSecondary, fontSize: 11, marginTop: 6 },
  valueBlock: {
    marginTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  valueBlockCompact: { marginTop: 10, paddingBottom: 8 },
  value: { color: colors.text, fontSize: 26, fontWeight: "300" },
  valueLabel: {
    color: colors.textTertiary,
    fontSize: 7,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginTop: 6,
  },
  details: { marginTop: 2 },
  row: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  rowLabel: { color: colors.textTertiary, fontSize: 8, letterSpacing: 1 },
  rowValue: { color: colors.text, fontSize: 12, marginTop: 3 },
  edit: {
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  editText: { color: "#fff", fontWeight: "700" },
  remove: {
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  removeText: { color: colors.red, fontSize: 12, fontWeight: "600" },
  actions: { marginTop: "auto", paddingTop: 10 },
  missing: { color: colors.textSecondary, margin: 24 },
});
