import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../theme";
import TopBar from "../components/TopBar";
import {
  createSealedAsset,
  normalizeVaultAsset,
  SEALED_PRODUCT_TYPES,
} from "../lib/vault";
import {
  getSealedProductById,
  SEALED_PRODUCT_CATALOG,
} from "../data/sealedProductCatalog";
import { searchLiveSealedProducts } from "../lib/pokemonProvider";
import { SETS } from "../data";
const F = ({ label, ...p }) => (
  <View style={s.field}>
    <Text style={s.label}>{label}</Text>
    <TextInput
      style={s.input}
      placeholderTextColor={colors.textTertiary}
      {...p}
    />
  </View>
);
export default function AddSealedAssetScreen({
  goBack,
  navigate,
  params = {},
  vaultAssets = [],
  saveVaultAsset,
}) {
  const current = vaultAssets.find((a) => a.id === params.assetId);
  const [catalogProduct, setCatalogProduct] = useState(
    getSealedProductById(current?.imageCatalogId),
  );
  const [catalogQuery, setCatalogQuery] = useState("");
  const [liveProducts, setLiveProducts] = useState([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState("");
  const [setPickerOpen, setSetPickerOpen] = useState(false);
  const [setFilter, setSetFilter] = useState("");
  const [name, setName] = useState(current?.productName || "");
  const [type, setType] = useState(current?.productType || "Booster Box");
  const [associatedSet, setAssociatedSet] = useState(current?.setName || "");
  const [image, setImage] = useState(current?.image || "");
  const [quantity, setQuantity] = useState(String(current?.quantity || 1));
  const lot = current?.acquisitions?.[0];
  const [price, setPrice] = useState(
    lot?.unitCost == null ? "" : String(lot.unitCost),
  );
  const [date, setDate] = useState(lot?.date || "");
  const [source, setSource] = useState(
    current?.acquisitionSource || lot?.source || "",
  );
  const [manual, setManual] = useState(
    current?.manualValue?.value == null
      ? ""
      : String(current.manualValue.value),
  );
  const [note, setNote] = useState(current?.note || "");
  const catalogResults = useMemo(() => {
    const query = catalogQuery.trim().toLowerCase();
    if (!query) return SEALED_PRODUCT_CATALOG.slice(0, 12);
    return SEALED_PRODUCT_CATALOG.filter((product) =>
      `${product.productName} ${product.setName} ${product.productType}`
        .toLowerCase()
        .includes(query),
    ).slice(0, 20);
  }, [catalogQuery]);
  const englishSets = useMemo(
    () =>
      SETS.filter((set) => set.category === "English" && set.name)
        .sort((a, b) => String(b.releaseDate || "").localeCompare(String(a.releaseDate || ""))),
    [],
  );
  const recentSets = englishSets.slice(0, 6);
  const filteredSets = useMemo(() => {
    const value = setFilter.trim().toLowerCase();
    return (value
      ? englishSets.filter((set) => `${set.name} ${set.code}`.toLowerCase().includes(value))
      : englishSets
    ).slice(0, 80);
  }, [englishSets, setFilter]);
  const chooseCatalogProduct = (product) => {
    setCatalogProduct(product);
    setName(product.productName);
    setType(product.productType);
    setAssociatedSet(product.setName);
    setImage(typeof product.image === "string" ? product.image : "");
  };
  const searchLive = async (queryOverride) => {
    const query = typeof queryOverride === "string" ? queryOverride.trim() : catalogQuery.trim();
    if (query.length < 2 || liveLoading) return;
    setLiveLoading(true);
    setLiveError("");
    try {
      const products = await searchLiveSealedProducts(query);
      setLiveProducts(products);
      if (!products.length) setLiveError("No live sealed products found for that set.");
    } catch (error) {
      setLiveError(error?.message || "Live catalog is temporarily unavailable.");
    } finally {
      setLiveLoading(false);
    }
  };
  const chooseSet = (set) => {
    setCatalogQuery(set.name);
    setAssociatedSet(set.name);
    setSetPickerOpen(false);
    searchLive(set.name);
  };
  const save = () => {
    if (!name.trim()) return;
    const q = Math.max(1, Number(quantity) || 1);
    const asset = createSealedAsset(
      normalizeVaultAsset({
        ...current,
        id: current?.id,
        type: "sealed",
        sourceType: catalogProduct ? "provider" : current?.sourceType || "manual",
        providerProductId:
          catalogProduct?.providerProductId || catalogProduct?.id || current?.providerProductId || null,
        imageCatalogId:
          catalogProduct?.id?.startsWith?.("pokemon-api:") ? null : catalogProduct?.id || current?.imageCatalogId || null,
        imageProvider:
          catalogProduct?.imageProvider || current?.imageProvider || null,
        sourceUrl: catalogProduct?.sourceUrl || current?.sourceUrl || null,
        providerMarketValue: catalogProduct
          ? catalogProduct.providerMarketValue || null
          : current?.providerMarketValue || null,
        productName: name.trim(),
        productType: type,
        setName: associatedSet.trim(),
        image: image.trim() || null,
        quantity: q,
        acquisitionSource: source,
        note,
        acquisitions:
          price !== ""
            ? [
                {
                  quantity: q,
                  unitCost: Number(price),
                  date: date || null,
                  source,
                },
              ]
            : [],
        manualValue:
          manual !== ""
            ? {
                provider: "manual",
                market: "User valuation",
                currency: "EUR",
                value: Number(manual),
                timestamp: new Date().toISOString(),
                condition: "Sealed",
              }
            : null,
      }),
    );
    saveVaultAsset(asset);
    navigate("VaultAssetDetail", { assetId: asset.id });
  };
  return (
    <ScrollView style={s.container}>
      <TopBar variant="back" onBackPress={goBack} />
      <View style={s.content}>
        <Text style={s.eyebrow}>
          {current ? "EDIT SEALED ASSET" : "ADD SEALED PRODUCT"}
        </Text>
        <Text style={s.title}>
          {current
            ? "Update the product record."
            : "Add a sealed product to your Vault."}
        </Text>
        <Text style={s.notice}>
          Search live sealed artwork and Cardmarket pricing, choose verified
          official artwork, or enter a product manually.
        </Text>
        <Text style={s.liveLabel}>RECENT SETS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.setStrip}>
          {recentSets.map((set) => (
            <TouchableOpacity key={set.id} style={s.setShortcut} onPress={() => chooseSet(set)}>
              <Image source={{ uri: set.logo }} style={s.setLogo} resizeMode="contain" />
              <Text style={s.setName} numberOfLines={1}>{set.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={s.setSelector} onPress={() => setSetPickerOpen(true)}>
          <View>
            <Text style={s.setSelectorLabel}>SELECT A SET</Text>
            <Text style={s.setSelectorValue}>{associatedSet || "Browse all English sets"}</Text>
          </View>
          <Text style={s.setSelectorArrow}>⌄</Text>
        </TouchableOpacity>
        <F
          label="SEARCH PRODUCT CATALOG"
          value={catalogQuery}
          onChangeText={setCatalogQuery}
          placeholder="Set, product or type"
        />
        <TouchableOpacity
          style={[s.liveSearch, liveLoading && s.liveSearchDisabled]}
          onPress={searchLive}
          disabled={liveLoading}
        >
          {liveLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={s.liveSearchText}>Search Live Catalog</Text>
          )}
        </TouchableOpacity>
        {liveError ? <Text style={s.liveError}>{liveError}</Text> : null}
        {liveProducts.length ? (
          <>
            <Text style={s.liveLabel}>LIVE PRODUCTS · CARDMARKET</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catalogStrip}>
              {liveProducts.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={[s.catalogCard, catalogProduct?.id === product.id && s.catalogCardOn]}
                  onPress={() => chooseCatalogProduct(product)}
                >
                  {product.image ? (
                    <Image source={{ uri: product.image }} style={s.catalogImage} resizeMode="contain" />
                  ) : (
                    <View style={s.catalogImage} />
                  )}
                  <Text style={s.catalogName} numberOfLines={2}>{product.productName}</Text>
                  <Text style={s.catalogMeta} numberOfLines={2}>
                    {product.providerMarketValue
                      ? `€${Number(product.providerMarketValue.value).toFixed(2)} · ${product.providerMarketValue.market}`
                      : "Price unavailable"}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        ) : null}
        <Text style={s.liveLabel}>OFFICIAL LOCAL CATALOG</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.catalogStrip}
        >
          {catalogResults.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={[
                s.catalogCard,
                catalogProduct?.id === product.id && s.catalogCardOn,
              ]}
              onPress={() => chooseCatalogProduct(product)}
            >
              <Image
                source={product.image}
                style={s.catalogImage}
                resizeMode="contain"
              />
              <Text style={s.catalogName} numberOfLines={2}>
                {product.productName}
              </Text>
              <Text style={s.catalogMeta}>{product.setName}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Modal visible={setPickerOpen} animationType="slide" transparent onRequestClose={() => setSetPickerOpen(false)}>
          <View style={s.modalBackdrop}>
            <View style={s.modalSheet}>
              <View style={s.modalHeader}>
                <View>
                  <Text style={s.eyebrow}>SET CATALOG</Text>
                  <Text style={s.modalTitle}>Choose an expansion</Text>
                </View>
                <TouchableOpacity style={s.modalClose} onPress={() => setSetPickerOpen(false)}>
                  <Text style={s.modalCloseText}>×</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={s.input}
                value={setFilter}
                onChangeText={setSetFilter}
                placeholder="Search sets"
                placeholderTextColor={colors.textTertiary}
              />
              <ScrollView style={s.setList} keyboardShouldPersistTaps="handled">
                {filteredSets.map((set) => (
                  <TouchableOpacity key={set.id} style={s.setRow} onPress={() => chooseSet(set)}>
                    <View style={s.setRowLogoWrap}>
                      <Image source={{ uri: set.logo }} style={s.setRowLogo} resizeMode="contain" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.setRowName}>{set.name}</Text>
                      <Text style={s.setRowMeta}>{set.series} · {set.releaseDate || "Release unknown"}</Text>
                    </View>
                    <Text style={s.setRowArrow}>›</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
        <F
          label="PRODUCT NAME"
          value={name}
          onChangeText={setName}
          placeholder="Product name"
        />
        <Text style={s.section}>PRODUCT TYPE</Text>
        <View style={s.chips}>
          {SEALED_PRODUCT_TYPES.map((item) => (
            <TouchableOpacity
              key={item}
              style={[s.chip, type === item && s.chipOn]}
              onPress={() => setType(item)}
            >
              <Text style={[s.chipText, type === item && s.chipTextOn]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <F
          label="ASSOCIATED SET · OPTIONAL"
          value={associatedSet}
          onChangeText={setAssociatedSet}
          placeholder="Set name"
        />
        <F
          label="ARTWORK URL · OPTIONAL"
          value={image}
          onChangeText={setImage}
          autoCapitalize="none"
        />
        <F
          label="QUANTITY"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="number-pad"
        />
        <Text style={s.section}>ACQUISITION · OPTIONAL</Text>
        <F
          label="UNIT PURCHASE PRICE"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
          placeholder="EUR"
        />
        <F
          label="PURCHASE DATE"
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
        />
        <F
          label="SOURCE"
          value={source}
          onChangeText={setSource}
          placeholder="Shop, event, trade…"
        />
        <Text style={s.section}>VALUATION</Text>
        <F
          label="MANUAL VALUE · OPTIONAL"
          value={manual}
          onChangeText={setManual}
          keyboardType="decimal-pad"
        />
        <F label="PRIVATE NOTE" value={note} onChangeText={setNote} multiline />
        <TouchableOpacity style={s.save} onPress={save}>
          <Text style={s.saveText}>Save Sealed Asset</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 24, paddingBottom: 50 },
  eyebrow: {
    color: colors.purple,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 2,
    marginTop: 20,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "300",
    marginTop: 14,
  },
  notice: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 14,
    padding: 13,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
  },
  catalogStrip: { marginTop: 12 },
  setStrip: { marginTop: 11, marginHorizontal: -24, paddingLeft: 24 },
  setShortcut: {
    width: 138,
    height: 102,
    marginRight: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 11,
    justifyContent: "space-between",
  },
  setLogo: { width: "100%", height: 55 },
  setName: { color: colors.text, fontSize: 10, fontWeight: "600" },
  setSelector: {
    minHeight: 62,
    marginTop: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  setSelectorLabel: { color: colors.purple, fontSize: 7, fontWeight: "800", letterSpacing: 1.2 },
  setSelectorValue: { color: colors.text, fontSize: 13, fontWeight: "600", marginTop: 6 },
  setSelectorArrow: { color: colors.textSecondary, fontSize: 22 },
  liveSearch: {
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  liveSearchDisabled: { opacity: 0.6 },
  liveSearchText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  liveError: { color: colors.red, fontSize: 10, marginTop: 9 },
  liveLabel: {
    color: colors.textTertiary,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginTop: 18,
  },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.72)", justifyContent: "flex-end" },
  modalSheet: {
    height: "84%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 22,
  },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  modalTitle: { color: colors.text, fontSize: 24, fontWeight: "300", marginTop: 8 },
  modalClose: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  modalCloseText: { color: colors.text, fontSize: 24, fontWeight: "300" },
  setList: { marginTop: 12 },
  setRow: { minHeight: 72, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderColor: colors.border, paddingVertical: 10 },
  setRowLogoWrap: { width: 72, height: 48, borderRadius: 8, backgroundColor: colors.surface, marginRight: 13, padding: 5 },
  setRowLogo: { width: "100%", height: "100%" },
  setRowName: { color: colors.text, fontSize: 13, fontWeight: "600" },
  setRowMeta: { color: colors.textTertiary, fontSize: 8, marginTop: 5 },
  setRowArrow: { color: colors.textSecondary, fontSize: 22 },
  catalogCard: {
    width: 146,
    marginRight: 10,
    padding: 9,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  catalogCardOn: { borderColor: colors.purple },
  catalogImage: { width: "100%", height: 104 },
  catalogName: {
    color: colors.text,
    fontSize: 10,
    fontWeight: "600",
    lineHeight: 14,
    marginTop: 7,
  },
  catalogMeta: { color: colors.textTertiary, fontSize: 8, marginTop: 4 },
  field: { marginTop: 15 },
  label: {
    color: colors.textTertiary,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 7,
  },
  input: {
    minHeight: 48,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  section: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    marginTop: 27,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 11 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: { backgroundColor: colors.purple, borderColor: colors.purple },
  chipText: { color: colors.textSecondary, fontSize: 9 },
  chipTextOn: { color: "#fff", fontWeight: "700" },
  save: {
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  saveText: { color: "#fff", fontWeight: "700" },
});
