import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { colors } from "../theme";
import RegistryHeader from "../components/RegistryHeader";
import { getSetById } from "../data";
import {
  getMissingRequirements,
  getSetRequirements,
} from "../lib/collectibles";
import { applyCardFilters, setFilterKey } from "../lib/cardFilters";
export default function MissingListScreen({
  goBack,
  navigate,
  params = {},
  binders = [],
  collectionQuantities = {},
  addRequirementsToWishlist = () => {},
  setFiltersByKey = {},
}) {
  const binder = binders.find((x) => x.id === params.binderId);
  const set = getSetById(binder?.setId || params.setId);
  const requirements = useMemo(
    () => getSetRequirements(set, binder?.tier || params.tier),
    [set, binder?.tier, params.tier],
  );
  const allMissing = useMemo(
    () => getMissingRequirements(requirements, collectionQuantities),
    [requirements, collectionQuantities],
  );
  const filterKey = setFilterKey(set?.id, binder?.tier || params.tier);
  const missing = useMemo(() => applyCardFilters(allMissing, setFiltersByKey[filterKey], collectionQuantities), [allMissing, setFiltersByKey, filterKey, collectionQuantities]);
  const [added, setAdded] = useState(false);
  const percent = requirements.length
    ? Math.round(
        ((requirements.length - allMissing.length) / requirements.length) * 100,
      )
    : 0;
  return (
    <View style={s.page}>
      <RegistryHeader
        title="Missing List"
        eyebrow="PORTFOLIO COMPLETION INDEX"
        onBack={goBack}
        onSearch={() =>
          navigate("SetFilters", {
            setId: set.id,
            tier: binder?.tier || params.tier,
            cardCount: requirements.length,
          })
        }
      />
      <View style={s.summary}>
        <View style={s.ring}>
          <Text style={s.ringText}>{percent}%</Text>
        </View>
        <View>
          <Text style={s.remaining}>{missing.length} Cards Remaining</Text>
          <Text style={s.budget}>Exact verified requirements</Text>
        </View>
      </View>
      <View style={s.listHead}>
        <Text style={s.label}>MISSING CARDS CHECKLIST ({missing.length})</Text>
        <TouchableOpacity
          disabled={!missing.length || added}
          onPress={() => {
            addRequirementsToWishlist(missing);
            setAdded(true);
          }}
        >
          <Text style={s.addAll}>{added ? "ADDED" : "ADD ALL"}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={missing}
        keyExtractor={(x) => x.collectibleKey}
        contentContainerStyle={s.list}
        ListEmptyComponent={
          <Text style={s.complete}>
            Binder complete — every exact requirement is owned.
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={s.row}
            onPress={() => navigate("CardDetail", { cardId: item.id })}
          >
            <Image source={{ uri: item.image }} style={s.image} />
            <View style={s.info}>
              <Text style={s.name}>{item.name}</Text>
              <Text style={s.meta}>
                #{item.number} · {item.finish}
              </Text>
            </View>
            <View style={s.action}>
              <Text style={s.price}>
                {Number(item.value) > 0
                  ? `€${Number(item.value).toFixed(2)}`
                  : "—"}
              </Text>
              <Text style={s.find}>FIND CARD</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  summary: {
    height: 88,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginTop: 8,
  },
  ring: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 4,
    borderColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  ringText: { color: colors.purple, fontSize: 14, fontWeight: "800" },
  remaining: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
    marginLeft: 16,
  },
  budget: {
    color: colors.textSecondary,
    fontSize: 9,
    marginLeft: 16,
    marginTop: 4,
  },
  listHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  label: { color: colors.textSecondary, fontSize: 9, fontWeight: "700" },
  addAll: { color: colors.purple, fontSize: 8, fontWeight: "800" },
  list: { paddingTop: 10, paddingBottom: 40 },
  row: {
    height: 68,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "center",
    padding: 9,
    marginBottom: 9,
  },
  image: { width: 38, height: 50, borderRadius: 4 },
  info: { flex: 1, marginLeft: 11 },
  name: { color: colors.text, fontSize: 11, fontWeight: "800" },
  meta: { color: colors.purple, fontSize: 8, marginTop: 5 },
  action: { alignItems: "flex-end" },
  price: { color: colors.text, fontSize: 11, fontWeight: "800" },
  find: {
    color: colors.purple,
    fontSize: 7,
    fontWeight: "800",
    backgroundColor: colors.purpleSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 5,
  },
  complete: {
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 30,
    fontSize: 10,
  },
});
