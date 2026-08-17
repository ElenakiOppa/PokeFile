import React, { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import { getSetById } from "../data";
import { getSetRequirements, isOwned } from "../lib/collectibles";
import BinderBook from "../components/BinderBook";
import FlexBinderBook from "../components/FlexBinderBook";
import { getPrimaryFlexBinder } from "../lib/flexBinder";
import { useAppContext } from "../AppContext";
const W = (Dimensions.get("window").width - 64) / 2;
export default function BindersScreen({
  navigate,
  binders = [],
  collectionQuantities = {},
}) {
  const { userProfile } = useAppContext();
  const flex = getPrimaryFlexBinder(binders);
  const regular = binders.filter((b) => b.kind !== "flex");
  const stats = useMemo(
    () =>
      regular.map((b) => {
        const set = getSetById(b.setId);
        const cards =
          b.kind === "freeform"
            ? (b.slots || []).map((s) => s?.card).filter(Boolean)
            : getSetRequirements(set, b.tier);
        const owned = cards.filter((c) =>
          isOwned(collectionQuantities, c),
        ).length;
        return {
          b,
          set,
          cards,
          owned,
          p: cards.length ? Math.round((owned / cards.length) * 100) : 0,
        };
      }),
    [regular, collectionQuantities],
  );
  const completed = stats.reduce((a, x) => a + x.owned, 0),
    total = stats.reduce((a, x) => a + x.cards.length, 0);
  return (
    <View style={s.page}>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.head}>
          <View>
            <Text style={s.title}>My Vault</Text>
            <Text style={s.kicker}>PREMIUM REGISTRIES</Text>
          </View>
          <TouchableOpacity
            style={s.avatar}
            onPress={() => navigate("Profile")}
          >
            {userProfile?.avatarUri ? (
              <View />
            ) : (
              <Text style={s.avatarText}>
                {(userProfile?.displayName || "PF").slice(0, 2).toUpperCase()}
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={s.summary}>
          <Stat
            label="ACTIVE BINDERS"
            value={String(regular.length + (flex ? 1 : 0))}
          />
          <Stat
            label="COMPLETION"
            value={total ? `${Math.round((completed / total) * 100)}%` : "0%"}
          />
        </View>
        <Text style={s.section}>
          ACTIVE PORTFOLIOS ({regular.length + (flex ? 1 : 0)})
        </Text>
        <View style={s.grid}>
          {flex ? (
            <TouchableOpacity
              style={s.card}
              onPress={() => navigate("FlexBinderPage", { binderId: flex.id })}
            >
              <FlexBinderBook binder={flex} width={W - 24} />
              <Text style={s.cardName} numberOfLines={1}>
                {flex.title || flex.name}
              </Text>
              <Text style={s.progress}>
                {(flex.slots || []).filter((x) => x?.card).length} / 9 Cards
              </Text>
              <Text style={s.meta}>FLEX SHOWCASE</Text>
            </TouchableOpacity>
          ) : null}
          {stats.map(({ b, set, cards, owned, p }) => (
            <TouchableOpacity
              key={b.id}
              style={s.card}
              onPress={() => navigate("BinderDetail", { binderId: b.id })}
            >
              <BinderBook set={set} binder={b} width={W - 24} />
              <Text style={s.cardName} numberOfLines={1}>
                {b.name}
              </Text>
              <Text style={s.progress}>
                {owned} / {cards.length} Cards
              </Text>
              <Text style={s.meta}>{p}% COMPLETE</Text>
            </TouchableOpacity>
          ))}
        </View>
        {!regular.length && !flex ? (
          <View style={s.empty}>
            <Text style={s.emptyTitle}>No registries yet</Text>
            <Text style={s.emptyText}>
              Create a binder to organize your collection.
            </Text>
          </View>
        ) : null}
      </ScrollView>
      <TouchableOpacity
        style={s.fab}
        onPress={() => navigate("CoverDesigner", { mode: "create" })}
      >
        <Ionicons name="add" size={18} color={colors.bg} />
        <Text style={s.fabText}>Create Binder</Text>
      </TouchableOpacity>
    </View>
  );
}
function Stat({ label, value }) {
  return (
    <View style={s.stat}>
      <Text style={s.statLabel}>{label}</Text>
      <Text style={s.statValue}>{value}</Text>
    </View>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 24, paddingBottom: 110 },
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { color: colors.text, fontSize: 24, fontWeight: "800" },
  kicker: {
    color: colors.purple,
    fontSize: 9,
    fontWeight: "700",
    marginTop: 3,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: colors.text, fontSize: 10, fontWeight: "800" },
  summary: { flexDirection: "row", gap: 16, marginTop: 28 },
  stat: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
  },
  statLabel: { color: colors.textSecondary, fontSize: 9 },
  statValue: {
    color: colors.purple,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 5,
  },
  section: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 26,
    marginBottom: 16,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  card: {
    width: W,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
  },
  cardName: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 8,
    width: "100%",
    textAlign: "center",
  },
  progress: { color: colors.purple, fontSize: 9, marginTop: 3 },
  meta: { color: colors.textSecondary, fontSize: 9, marginTop: 3 },
  empty: {
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    alignItems: "center",
  },
  emptyTitle: { color: colors.text, fontSize: 16, fontWeight: "700" },
  emptyText: { color: colors.textSecondary, fontSize: 10, marginTop: 6 },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 18,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.purple,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 18,
  },
  fabText: { color: colors.bg, fontSize: 11, fontWeight: "800" },
});
