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
import TopBar from "../components/TopBar";
import { CARD_LIBRARY, getCardById } from "../data";
import {
  createGradedAsset,
  GRADING_COMPANIES,
  normalizeVaultAsset,
} from "../lib/vault";
const Field = ({ label, ...props }) => (
  <View style={s.field}>
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
    <ScrollView style={s.container}>
      <TopBar variant="back" onBackPress={goBack} />
      <View style={s.content}>
        <Text style={s.eyebrow}>
          {current ? "EDIT GRADED ASSET" : "ADD GRADED COPY"}
        </Text>
        {!card ? (
          <>
            <Text style={s.title}>Choose the canonical card.</Text>
            <Field
              label="SEARCH CARD CATALOG"
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
            <TouchableOpacity
              style={s.selected}
              onPress={() => !current && setCard(null)}
            >
              <Image source={{ uri: card.image }} style={s.card} />
              <View style={{ flex: 1 }}>
                <Text style={s.selectedName}>{card.name}</Text>
                <Text style={s.resultMeta}>
                  {card.setName} · #{card.number}
                </Text>
                <Text style={s.change}>
                  {current ? "CANONICAL CARD" : "Change card"}
                </Text>
              </View>
            </TouchableOpacity>
            <Text style={s.section}>GRADING</Text>
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
            <Field
              label="GRADE"
              value={grade}
              onChangeText={setGrade}
              placeholder="10, 9.5, Pristine…"
            />
            <Field
              label="CERTIFICATION NUMBER · PRIVATE"
              value={cert}
              onChangeText={setCert}
              placeholder="Stored exactly as entered"
            />
            <Field
              label="QUANTITY"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="number-pad"
            />
            <Text style={s.section}>ACQUISITION · OPTIONAL</Text>
            <Field
              label="UNIT PURCHASE PRICE"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
              placeholder="EUR"
            />
            <Field
              label="PURCHASE DATE"
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
            />
            <Field
              label="SOURCE"
              value={source}
              onChangeText={setSource}
              placeholder="Shop, event, trade…"
            />
            <Text style={s.section}>VALUATION</Text>
            <Field
              label="MANUAL VALUE · OPTIONAL"
              value={manual}
              onChangeText={setManual}
              keyboardType="decimal-pad"
              placeholder="No graded provider price available"
            />
            <Field
              label="PRIVATE NOTE"
              value={note}
              onChangeText={setNote}
              multiline
              placeholder="Optional"
            />
            <TouchableOpacity style={s.save} onPress={save}>
              <Text style={s.saveText}>Save Graded Asset</Text>
            </TouchableOpacity>
          </>
        )}
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
    fontWeight: "300",
    marginTop: 14,
    marginBottom: 20,
  },
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
    marginTop: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    backgroundColor: colors.surface,
  },
  card: { width: 66, height: 92, marginRight: 14 },
  selectedName: { color: colors.text, fontSize: 18, fontWeight: "600" },
  change: {
    color: colors.purple,
    fontSize: 8,
    fontWeight: "700",
    marginTop: 9,
  },
  section: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    marginTop: 29,
    marginBottom: 4,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 10 },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: { backgroundColor: colors.purple, borderColor: colors.purple },
  chipText: { color: colors.textSecondary, fontSize: 10 },
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
