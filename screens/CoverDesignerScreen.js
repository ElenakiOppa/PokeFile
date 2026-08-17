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
  ["classic", "Geometric"],
  ["artwork", "Foil Sparkle"],
  ["line", "Cosmic Waves"],
  ["minimal", "Minimalist"],
  ["marble", "Marble"],
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
        <View style={s.preview}>
          <BinderCover
            set={set}
            styleId={style}
            name={customText ? name : ""}
            compact
          />
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
        <Text style={s.label}>BASE PALETTE & GRADIENTS</Text>
        <View style={s.palette}>
          {["#D6B42C", "#315BC5", "#08785F", "#B9252B", "#3B4658"].map(
            (c, i) => (
              <TouchableOpacity
                key={c}
                style={[s.dot, { backgroundColor: c }, i === 0 && s.dotActive]}
                onPress={() => setStyle(STYLES[i]?.[0] || style)}
              />
            ),
          )}
        </View>
        <Text style={s.label}>METALLIC GEOMETRIC PATTERNS</Text>
        <View style={s.patterns}>
          {STYLES.slice(0, 4).map(([id, label]) => (
            <TouchableOpacity
              key={id}
              style={[s.pattern, style === id && s.patternActive]}
              onPress={() => setStyle(id)}
            >
              <Text
                style={[s.patternText, style === id && s.patternTextActive]}
              >
                {label}
              </Text>
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
  preview: {
    width: 200,
    height: 270,
    alignSelf: "center",
    marginTop: 16,
    overflow: "hidden",
  },
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
  palette: { flexDirection: "row", gap: 12 },
  dot: { width: 38, height: 38, borderRadius: 19 },
  dotActive: { borderWidth: 2, borderColor: colors.text },
  patterns: { flexDirection: "row", gap: 8 },
  pattern: {
    paddingHorizontal: 11,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.card,
  },
  patternActive: { borderColor: colors.purple },
  patternText: { color: colors.textSecondary, fontSize: 8 },
  patternTextActive: { color: colors.purple },
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
