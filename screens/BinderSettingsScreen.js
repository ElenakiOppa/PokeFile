import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import RegistryHeader from "../components/RegistryHeader";
import BinderCover from "../components/BinderCover";
import { getSetById } from "../data";
export default function BinderSettingsScreen({
  navigate,
  goBack,
  params = {},
  binders = [],
  updateBinder = () => {},
}) {
  const binder = useMemo(
    () => binders.find((x) => x.id === params.binderId),
    [binders, params.binderId],
  );
  const set = getSetById(binder?.setId || params.setId || "me5");
  const [name, setName] = useState(binder?.name || set.name);
  const [description, setDescription] = useState(binder?.description || "");
  const [publicMode, setPublicMode] = useState(Boolean(binder?.publicMode));
  const save = () => {
    if (binder)
      updateBinder(binder.id, {
        name: name.trim() || set.name,
        description,
        publicMode,
      });
    goBack();
  };
  return (
    <View style={s.page}>
      <RegistryHeader
        title="Binder Settings"
        eyebrow="CONFIGURE INSTANCE"
        onBack={goBack}
        onSearch={() =>
          navigate("SetFilters", { setId: set.id, tier: binder?.tier })
        }
      />
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <Label text="BINDER TITLE" />
        <TextInput value={name} onChangeText={setName} style={s.input} />
        <Label text="DESCRIPTION" />
        <TextInput
          value={description}
          onChangeText={setDescription}
          multiline
          style={s.description}
          placeholder="Describe this registry…"
          placeholderTextColor={colors.textTertiary}
        />
        <Label text="VAULT COVER PREVIEW" />
        <TouchableOpacity
          style={s.coverRow}
          onPress={() =>
            navigate("CoverDesigner", {
              binderId: binder?.id,
              setId: set.id,
              tier: binder?.tier,
            })
          }
        >
          <View style={s.cover}>
            <BinderCover
              set={set}
              binder={binder}
              styleId={binder?.coverStyle || "classic"}
              compact
            />
          </View>
          <View style={s.coverCopy}>
            <Text style={s.coverName}>
              {binder?.coverStyleLabel || "Portfolio Cover"}
            </Text>
            <Text style={s.coverLink}>Customize with Designer</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
        <View style={s.switchRow}>
          <View>
            <Text style={s.switchTitle}>Public Presentation Mode</Text>
            <Text style={s.switchSub}>
              Allow other collectors to view this binder.
            </Text>
          </View>
          <Switch
            value={publicMode}
            onValueChange={setPublicMode}
            trackColor={{ false: colors.border, true: colors.purple }}
            thumbColor={colors.bg}
          />
        </View>
        <View style={s.danger}>
          <View style={s.dangerTitle}>
            <Ionicons name="trash-outline" size={15} color={colors.red} />
            <Text style={s.dangerTitleText}>Danger Zone</Text>
          </View>
          <Text style={s.dangerText}>
            Deleting this registry would permanently untrack its binder
            configuration.
          </Text>
          <TouchableOpacity
            style={s.delete}
            onPress={() =>
              Alert.alert(
                "Delete Binder",
                "Binder deletion is intentionally protected.",
              )
            }
          >
            <Text style={s.deleteText}>Delete Binder Portfolio</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity style={s.save} onPress={save}>
        <Text style={s.saveText}>Save Configurations</Text>
      </TouchableOpacity>
    </View>
  );
}
function Label({ text }) {
  return <Text style={s.label}>{text}</Text>;
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  content: { paddingBottom: 100 },
  label: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    height: 43,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9,
    backgroundColor: colors.card,
    color: colors.text,
    paddingHorizontal: 12,
    fontSize: 11,
  },
  description: {
    height: 80,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9,
    backgroundColor: colors.card,
    color: colors.text,
    padding: 12,
    fontSize: 10,
    textAlignVertical: "top",
  },
  coverRow: {
    height: 88,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 11,
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  cover: { width: 48, height: 66, overflow: "hidden" },
  coverCopy: { flex: 1, marginLeft: 12 },
  coverName: { color: colors.text, fontSize: 11, fontWeight: "700" },
  coverLink: { color: colors.purple, fontSize: 9, marginTop: 4 },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  switchTitle: { color: colors.text, fontSize: 11, fontWeight: "800" },
  switchSub: { color: colors.textSecondary, fontSize: 9, marginTop: 4 },
  danger: {
    borderWidth: 1,
    borderColor: colors.red,
    borderRadius: 12,
    backgroundColor: "rgba(192,57,43,.16)",
    padding: 15,
    marginTop: 20,
  },
  dangerTitle: { flexDirection: "row", gap: 7, alignItems: "center" },
  dangerTitleText: { color: colors.red, fontSize: 11, fontWeight: "800" },
  dangerText: { color: colors.red, fontSize: 9, lineHeight: 14, marginTop: 10 },
  delete: {
    alignSelf: "flex-start",
    backgroundColor: colors.red,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
  },
  deleteText: { color: "#fff", fontSize: 8, fontWeight: "800" },
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
});
