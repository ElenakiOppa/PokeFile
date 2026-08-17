import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from "react-native";
import { colors } from "../theme";
import RegistryHeader from "../components/RegistryHeader";
import BinderCover from "../components/BinderCover";
import FilterChip from "../components/FilterChip";
import { SETS, getSetById } from "../data";
const STYLES = [
  ["classic", "Set Logo"],
  ["artwork", "Contour"],
  ["line", "Marble"],
  ["minimal", "Pokéball"],
  ["marble", "Vortex"],
  ["energy", "Card Back"],
];
const TIERS = ["complete", "master", "grandmaster"];
export default function CoverDesignerScreen({
  navigate,
  goBack,
  params = {},
  createBinder = () => {},
  updateBinder = () => {},
  binders = [],
}) {
  const editing = binders.find((b) => b.id === params.binderId);
  const initial = getSetById(editing?.setId || params.setId || "me5");
  const [setId, setSetId] = useState(initial.id);
  const [tier, setTier] = useState(
    String(editing?.tier || params.tier || "master").toLowerCase(),
  );
  const [style, setStyle] = useState(editing?.coverStyle || "classic");
  const [name, setName] = useState(editing?.name || initial.name);
  const [layout, setLayout] = useState(Number(editing?.pocketLayout || 9));
  const [kind, setKind] = useState(editing?.kind || "set");
  const [customText, setCustomText] = useState(true);
  const [picker, setPicker] = useState(false);
  const [query, setQuery] = useState("");
  const set = getSetById(setId);
  const filtered = useMemo(
    () =>
      SETS.filter((x) =>
        x.name.toLowerCase().includes(query.toLowerCase()),
      ).slice(0, 16),
    [query],
  );
  const selectSet = (x) => {
    setSetId(x.id);
    setName(x.name);
    setPicker(false);
  };
  const save = () => {
    const changes = {
      setId: set.id,
      name: name.trim() || set.name,
      tier,
      coverStyle: style,
      pocketLayout: layout,
      kind,
      slots: editing?.slots || [],
    };
    editing
      ? updateBinder(editing.id, changes)
      : createBinder({
          ...changes,
          createdAt: new Date().toISOString(),
          sortBy: "Set Number",
        });
    goBack();
  };
  return (
    <View style={s.page}>
      <RegistryHeader
        flush
        title="Cover Designer"
        eyebrow="CUSTOMIZE PORTFOLIO ART"
        onBack={goBack}
        onSearch={() => setPicker((v) => !v)}
      />
      <ScrollView
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {picker ? (
          <View style={s.picker}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              autoFocus
              placeholder="Search sets…"
              placeholderTextColor={colors.textTertiary}
              style={s.search}
            />
            {filtered.map((x) => (
              <TouchableOpacity
                key={x.id}
                style={s.setRow}
                onPress={() => selectSet(x)}
              >
                <Text style={s.setName}>{x.name}</Text>
                <Text style={s.setCode}>{x.code}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
        <View style={s.previewStage}>
          <View style={s.preview}>
            <BinderCover set={set} styleId={style} name={customText ? name : ""} compact />
          </View>
          <View style={s.previewCopy}>
            <Text style={s.previewKicker}>LIVE COVER PREVIEW</Text>
            <Text style={s.previewName}>{customText ? name : set.name}</Text>
            <Text style={s.previewMeta}>{STYLES.find(([id]) => id === style)?.[1]} · {tier.toUpperCase()}</Text>
            <TouchableOpacity style={s.changeSet} onPress={() => setPicker((value) => !value)}><Text style={s.changeSetText}>Change expansion</Text></TouchableOpacity>
          </View>
        </View>
        {editing ? null : (
          <>
            <Text style={s.label}>BINDER CONFIGURATION</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={s.nameInput}
            />
            <View style={s.chips}>
              {TIERS.filter(
                (x) => x !== "grandmaster" || set.grandmasterAvailable,
              ).map((x) => (
                <FilterChip
                  key={x}
                  label={x.toUpperCase()}
                  active={tier === x}
                  onPress={() => setTier(x)}
                />
              ))}
            </View>
            <View style={s.chips}>
              <FilterChip
                label="SET"
                active={kind === "set"}
                onPress={() => setKind("set")}
              />
              <FilterChip
                label="FREEFORM"
                active={kind === "freeform"}
                onPress={() => setKind("freeform")}
              />
              {[9, 16, 24].map((x) => (
                <FilterChip
                  key={x}
                  label={`${x}P`}
                  active={layout === x}
                  onPress={() => setLayout(x)}
                />
              ))}
            </View>
          </>
        )}
        <Text style={s.label}>CHOOSE A COVER</Text>
        <View style={s.coverGrid}>
          {STYLES.map(([id, label], index) => (
            <TouchableOpacity key={id} style={[s.coverChoice, style === id && s.coverChoiceActive]} onPress={() => setStyle(id)}>
              <View style={s.coverThumb}><BinderCover set={set} styleId={id} compact /></View>
              <View style={s.coverChoiceFooter}><Text style={[s.coverIndex, style === id && s.coverChoiceText]}>{String(index + 1).padStart(2, "0")}</Text><Text style={[s.coverChoiceLabel, style === id && s.coverChoiceText]} numberOfLines={1}>{label}</Text></View>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={s.label}>TEXT EMBOSS OVERLAYS</Text>
        <View style={s.switchRow}>
          <Text style={s.switchText}>Include Custom Title Text</Text>
          <Switch
            value={customText}
            onValueChange={setCustomText}
            trackColor={{ false: colors.border, true: colors.purple }}
            thumbColor={colors.bg}
          />
        </View>
      </ScrollView>
      <TouchableOpacity style={s.save} onPress={save}>
        <Text style={s.saveText}>
          {editing ? "Apply Portfolio Cover" : "Create Binder"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  content: { paddingBottom: 100 },
  previewStage: { minHeight: 224, marginTop: 12, borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 14, flexDirection: "row", alignItems: "center" },
  preview: { width: 132, height: 184, overflow: "hidden", shadowColor: colors.purple, shadowOpacity: .28, shadowRadius: 14, shadowOffset: { width: 0, height: 7 }, elevation: 8 },
  previewCopy: { flex: 1, paddingLeft: 16 },
  previewKicker: { color: colors.purple, fontSize: 8, fontWeight: "800", letterSpacing: 1 },
  previewName: { color: colors.text, fontSize: 18, fontWeight: "800", marginTop: 8 },
  previewMeta: { color: colors.textSecondary, fontSize: 9, marginTop: 5 },
  changeSet: { alignSelf: "flex-start", marginTop: 16, borderRadius: 9, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 10, paddingVertical: 8 },
  changeSetText: { color: colors.text, fontSize: 8, fontWeight: "700" },
  label: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 9,
  },
  nameInput: {
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.card,
    color: colors.text,
    paddingHorizontal: 11,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  coverGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 10 },
  coverChoice: { width: "31.5%", borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 6 },
  coverChoiceActive: { borderColor: colors.purple, backgroundColor: colors.purpleSoft },
  coverThumb: { width: "100%", aspectRatio: .72, overflow: "hidden", borderRadius: 8 },
  coverChoiceFooter: { marginTop: 6 },
  coverIndex: { color: colors.textTertiary, fontSize: 7, fontWeight: "800" },
  coverChoiceLabel: { color: colors.text, fontSize: 8, fontWeight: "700", marginTop: 2 },
  coverChoiceText: { color: colors.purple },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchText: { color: colors.text, fontSize: 10 },
  save: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 13,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: { color: colors.bg, fontSize: 11, fontWeight: "800" },
  picker: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 9,
    maxHeight: 260,
  },
  search: {
    height: 38,
    backgroundColor: colors.card,
    borderRadius: 7,
    color: colors.text,
    paddingHorizontal: 10,
  },
  setRow: { flexDirection: "row", justifyContent: "space-between", padding: 9 },
  setName: { color: colors.text, fontSize: 9 },
  setCode: { color: colors.textTertiary, fontSize: 8 },
});
