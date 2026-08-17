import React, { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../theme";
import { VaultHeader } from "../components/VaultUi";
import { CARD_LIBRARY, getCardById } from "../data";
import {
  createGradedAsset,
  GRADING_COMPANIES,
  normalizeVaultAsset,
} from "../lib/vault";
const Field = ({ label, containerStyle, ...props }) => (
  <View style={[s.field, containerStyle]}>
    <Text style={s.label}>{label}</Text>
    <TextInput
      placeholderTextColor={colors.textTertiary}
      style={s.input}
      {...props}
    />
  </View>
);
export default function AddGradedAssetScreen({
  goBack,
  navigate,
  params = {},
  vaultAssets = [],
  saveVaultAsset,
}) {
  const current = vaultAssets.find((a) => a.id === params.assetId);
  const [card, setCard] = useState(
    current ? getCardById(current.canonicalCollectibleKey, null) : null,
  );
  const [query, setQuery] = useState("");
  const [company, setCompany] = useState(current?.company || "PSA");
  const [grade, setGrade] = useState(current?.grade || "");
  const [cert, setCert] = useState(current?.certificationNumber || "");
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
  const results = useMemo(
    () =>
      query.trim().length < 2
        ? []
        : CARD_LIBRARY.filter((c) =>
            `${c.name} ${c.number} ${c.setName}`
              .toLowerCase()
              .includes(query.toLowerCase()),
          ).slice(0, 18),
    [query],
  );
  const save = () => {
    if (!card || !grade.trim()) return;
    const q = Math.max(1, Number(quantity) || 1);
    const asset = createGradedAsset(
      normalizeVaultAsset({
        ...current,
        id: current?.id,
        type: "graded",
        canonicalCollectibleKey: card.id,
        baseCardId: card.cardId || card.id,
        name: card.name,
        number: card.number,
        setId: card.setId,
        setName: card.setName,
        image: card.image,
        finish: card.variant || card.finish,
        company,
        grade: grade.trim(),
        certificationNumber: cert,
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
                condition: `${company} ${grade}`,
              }
            : null,
      }),
    );
    saveVaultAsset(asset);
    navigate("VaultAssetDetail", { assetId: asset.id });
  };
  return (
    <View style={s.container}>
      <VaultHeader title={current ? "Edit Graded Card" : "Add Graded Card"} goBack={goBack} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {!card ? (
          <>
            <Field
              label="SELECT POKÉMON CARD"
              value={query}
              onChangeText={setQuery}
              placeholder="Name, set or number"
            />
            {results.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={s.result}
                onPress={() => setCard(item)}
              >
                <Image source={{ uri: item.image }} style={s.resultImage} />
                <View>
                  <Text style={s.resultName}>{item.name}</Text>
                  <Text style={s.resultMeta}>
                    {item.setName} · #{item.number} · {item.variant}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            <TouchableOpacity style={s.selected} onPress={() => !current && setCard(null)}>
              <Image source={{ uri: card.image }} style={s.card} />
              <Text style={s.selectedName} numberOfLines={1}>{card.name} · {card.setName} #{card.number}</Text>
              <Text style={s.change}>{current ? "VERIFIED" : "CHANGE"}</Text>
            </TouchableOpacity>
            <Text style={s.section}>GRADING SERVICE</Text>
            <View style={s.chips}>
              {GRADING_COMPANIES.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[s.chip, company === item && s.chipOn]}
                  onPress={() => setCompany(item)}
                >
                  <Text style={[s.chipText, company === item && s.chipTextOn]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={s.two}><Field containerStyle={s.half} label="GRADE" value={grade} onChangeText={setGrade} placeholder="10" /><Field containerStyle={s.half} label="CERT NUMBER" value={cert} onChangeText={setCert} placeholder="48271049" /></View>
            <View style={s.two}><Field containerStyle={s.half} label="PURCHASE COST" value={price} onChangeText={setPrice} keyboardType="decimal-pad" placeholder="0.00" /><Field containerStyle={s.half} label="DATE ACQUIRED" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" /></View>
            <View style={s.two}><Field containerStyle={s.half} label="QUANTITY" value={quantity} onChangeText={setQuantity} keyboardType="number-pad" /><Field containerStyle={s.half} label="SOURCE" value={source} onChangeText={setSource} placeholder="Shop, event, trade" /></View>
            <Field
              label="MANUAL MARKET VALUE · OPTIONAL"
              value={manual}
              onChangeText={setManual}
              keyboardType="decimal-pad"
              placeholder="No graded provider price available"
            />
            <Field label="PRIVATE NOTE" value={note} onChangeText={setNote} multiline placeholder="Optional" />
            <Text style={s.section}>PHOTO OF SLAB</Text>
            <View style={s.photoRow}><View style={s.photoAdd}><Text style={s.photoPlus}>＋</Text><Text style={s.photoText}>Add Photo</Text></View><Image source={{ uri: card.image }} style={s.photoPreview} resizeMode="contain" /></View>
            <TouchableOpacity style={s.save} onPress={save}>
              <Text style={s.saveText}>{current ? "Save Graded Asset" : "Add Graded Asset to Vault"}</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 24, paddingBottom: 48 },
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
    fontWeight: "300",
    marginTop: 14,
    marginBottom: 20,
  },
  field: { marginTop: 16 },
  half: { flex: 1 },
  two: { flexDirection: "row", gap: 12 },
  label: {
    color: colors.textTertiary,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 7,
  },
  input: {
    minHeight: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  result: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  resultImage: { width: 42, height: 58, borderRadius: 5, marginRight: 12 },
  resultName: { color: colors.text, fontSize: 13, fontWeight: "600" },
  resultMeta: { color: colors.textSecondary, fontSize: 8, marginTop: 4 },
  selected: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    padding: 9,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    backgroundColor: colors.surface,
  },
  card: { width: 30, height: 41, borderRadius: 4, marginRight: 10 },
  selectedName: { color: colors.text, fontSize: 11, fontWeight: "600", flex: 1 },
  change: {
    color: colors.purple,
    fontSize: 8,
    fontWeight: "700",
    marginLeft: 8,
  },
  section: {
    color: colors.textTertiary,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: 18,
    marginBottom: 7,
  },
  chips: { flexDirection: "row", gap: 8 },
  chip: {
    flex: 1,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: { backgroundColor: colors.purpleSoft, borderColor: colors.purple },
  chipText: { color: colors.textSecondary, fontSize: 10 },
  chipTextOn: { color: colors.purple, fontWeight: "700" },
  photoRow: { flexDirection: "row", gap: 10 },
  photoAdd: {
    width: 76,
    height: 76,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  photoPlus: { color: colors.purple, fontSize: 22, lineHeight: 24 },
  photoText: { color: colors.purple, fontSize: 8, marginTop: 3 },
  photoPreview: { width: 76, height: 76, borderRadius: 10, backgroundColor: colors.surface },
  save: {
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  saveText: { color: colors.bg, fontWeight: "800", fontSize: 11 },
});
