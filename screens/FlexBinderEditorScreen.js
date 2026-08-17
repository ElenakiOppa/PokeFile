import React, { useMemo, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import RegistryHeader from "../components/RegistryHeader";
import { CARD_LIBRARY } from "../data";
import { collectibleKey, ownedQuantity } from "../lib/collectibles";
import {
  getPrimaryFlexBinder,
  moveFlexSlot,
  normalizeFlexBinder,
  removeFlexSlot,
  setFlexSlot,
} from "../lib/flexBinder";
export default function FlexBinderEditorScreen({
  goBack,
  navigate,
  binders = [],
  collectionQuantities = {},
  createBinder,
  updateBinder,
}) {
  const existing = getPrimaryFlexBinder(binders);
  const [draft, setDraft] = useState(() =>
    normalizeFlexBinder(
      existing || {
        id: `flex-${Date.now()}`,
        title: "My Flex",
        description: "",
      },
    ),
  );
  const [pickerSlot, setPickerSlot] = useState(null);
  const [moveFrom, setMoveFrom] = useState(null);
  const owned = useMemo(() => {
    const seen = new Set();
    return CARD_LIBRARY.filter(
      (c) =>
        ownedQuantity(collectionQuantities, c) > 0 &&
        !seen.has(collectibleKey(c)) &&
        seen.add(collectibleKey(c)),
    );
  }, [collectionQuantities]);
  const choose = (i) => {
    if (moveFrom !== null) {
      setDraft((v) => moveFlexSlot(v, moveFrom, i));
      setMoveFrom(null);
    } else setPickerSlot(i);
  };
  const save = () => {
    const title = draft.title.trim() || "My Flex",
      next = {
        ...draft,
        name: title,
        title,
        updatedAt: new Date().toISOString(),
        createdAt: draft.createdAt || new Date().toISOString(),
      };
    existing ? updateBinder(existing.id, next) : createBinder(next);
    navigate("FlexBinderPage", { binderId: next.id });
  };
  return (
    <View style={s.page}>
      <RegistryHeader
        title="Flex Showcase Editor"
        eyebrow="3X3 HIGHLIGHT ARRAY"
        onBack={goBack}
        onSearch={() => navigate("SetFilters")}
      />
      <View style={s.tip}>
        <Ionicons name="hand-left-outline" color={colors.purple} size={15} />
        <Text style={s.tipText}>
          Drag and reorder cards to curate your public profile page.
        </Text>
      </View>
      <View style={s.grid}>
        {draft.slots.map((slot, i) => (
          <TouchableOpacity
            key={i}
            style={[s.slot, moveFrom === i && s.active]}
            onPress={() => choose(i)}
            onLongPress={() => slot && setMoveFrom(i)}
          >
            {slot?.card?.image ? (
              <>
                <Image source={{ uri: slot.card.image }} style={s.card} />
                <View style={s.badge}>
                  <Text style={s.badgeText}>{i + 1}</Text>
                </View>
                <TouchableOpacity
                  style={s.remove}
                  onPress={() => setDraft((v) => removeFlexSlot(v, i))}
                >
                  <Ionicons name="close" size={12} color="#fff" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Ionicons name="add" size={19} color={colors.textSecondary} />
                <Text style={s.add}>Add Card</Text>
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={s.save} onPress={save}>
        <Text style={s.saveText}>Save Showcase Layout</Text>
      </TouchableOpacity>
      <Modal
        visible={pickerSlot !== null}
        animationType="slide"
        onRequestClose={() => setPickerSlot(null)}
      >
        <ScrollView style={s.picker}>
          <View style={s.pickerHead}>
            <Text style={s.pickerTitle}>Choose an owned card</Text>
            <TouchableOpacity onPress={() => setPickerSlot(null)}>
              <Text style={s.done}>Done</Text>
            </TouchableOpacity>
          </View>
          <View style={s.pickerGrid}>
            {owned.map((card) => (
              <TouchableOpacity
                key={collectibleKey(card)}
                style={s.pick}
                onPress={() => {
                  setDraft((v) => setFlexSlot(v, pickerSlot, card));
                  setPickerSlot(null);
                }}
              >
                <Image source={{ uri: card.image }} style={s.pickImage} />
                <Text style={s.pickName} numberOfLines={1}>
                  {card.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  tip: {
    marginHorizontal: -20,
    paddingHorizontal: 24,
    height: 58,
    backgroundColor: colors.purpleSoft,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tipText: { color: colors.purple, fontSize: 10, lineHeight: 14, flex: 1 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 22 },
  slot: {
    width: "31.4%",
    aspectRatio: 0.72,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  active: { borderColor: colors.purple, borderWidth: 2 },
  card: { width: "100%", height: "100%", borderRadius: 9 },
  badge: {
    position: "absolute",
    left: 5,
    top: 5,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: colors.bg, fontSize: 8, fontWeight: "800" },
  remove: {
    position: "absolute",
    right: 4,
    top: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(0,0,0,.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  add: { color: colors.textSecondary, fontSize: 8, marginTop: 4 },
  save: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 15,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: { color: colors.bg, fontSize: 11, fontWeight: "800" },
  picker: { flex: 1, backgroundColor: colors.bg },
  pickerHead: {
    padding: 24,
    paddingTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pickerTitle: { color: colors.text, fontSize: 20, fontWeight: "700" },
  done: { color: colors.purple, fontWeight: "800" },
  pickerGrid: {
    paddingHorizontal: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  pick: { width: "30.8%" },
  pickImage: { width: "100%", aspectRatio: 0.716 },
  pickName: { color: colors.text, fontSize: 9, marginTop: 4 },
});
