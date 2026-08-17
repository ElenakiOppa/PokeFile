import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import HolographicCard from "./HolographicCard";
import UserAvatar from "./UserAvatar";
function MissingArtwork({ card }) {
  return (
    <View style={[s.card, s.missing]}>
      <Text style={s.missingMark}>◇</Text>
      <Text style={s.missingName} numberOfLines={2}>
        {card?.name || "Artwork unavailable"}
      </Text>
    </View>
  );
}
export default function FlexBinderPresentation({
  data,
  onCardPress,
  exportMode = false,
  failedSlots = new Set(),
  onExportSlotResolved,
  onExportLayout,
}) {
  const cards = data?.cards || Array(9).fill(null),
    filled = cards.filter(Boolean).length;
  return (
    <View
      style={[s.page, exportMode && s.export]}
      onLayout={exportMode ? onExportLayout : undefined}
    >
      <View style={s.user}>
        <UserAvatar size={30} name={data?.collectorName} />
        <Text style={s.userName}>
          {data?.collectorName || "Pokéfile Collector"}
        </Text>
        <View style={s.share}>
          <Ionicons
            name="share-social-outline"
            size={15}
            color={colors.purple}
          />
        </View>
      </View>
      <Text style={s.title}>{data?.title || "My Flex Showcase"}</Text>
      <Text style={s.meta}>{filled} ACQUISITIONS · PERSONAL VAULT</Text>
      {data?.description ? (
        <Text style={s.description}>{data.description}</Text>
      ) : null}
      <View style={s.grid}>
        {cards.map((card, i) => {
          const failed = Boolean(card && (failedSlots.has(i) || !card.image));
          const item = failed ? (
            <MissingArtwork card={card} />
          ) : card ? (
            <HolographicCard
              uri={card.image}
              style={s.card}
              interactive={!exportMode}
              onImageLoad={
                exportMode
                  ? () => onExportSlotResolved?.(i, "loaded")
                  : undefined
              }
              onImageError={
                exportMode
                  ? () => onExportSlotResolved?.(i, "failed")
                  : undefined
              }
            />
          ) : (
            <View style={[s.card, s.empty]}>
              <Text style={s.emptyText}>{String(i + 1).padStart(2, "0")}</Text>
            </View>
          );
          return onCardPress && card ? (
            <TouchableOpacity
              key={`${card.collectibleKey}-${i}`}
              style={s.cell}
              onPress={() => onCardPress(card)}
            >
              {item}
            </TouchableOpacity>
          ) : (
            <View key={card?.collectibleKey || `empty-${i}`} style={s.cell}>
              {item}
            </View>
          );
        })}
      </View>
      <View style={s.verify}>
        <Ionicons
          name="shield-checkmark-outline"
          size={15}
          color={colors.purple}
        />
        <Text style={s.verifyText}>
          POKÉFILE SECURED COLLECTION VERIFICATION
        </Text>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  page: {
    backgroundColor: colors.bg,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 25,
  },
  export: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 62,
    paddingVertical: 74,
  },
  user: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.purpleSoft,
    borderWidth: 1,
    borderColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: colors.purple, fontSize: 8, fontWeight: "800" },
  userName: {
    color: colors.text,
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 8,
    flex: 1,
  },
  share: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: colors.text, fontSize: 24, fontWeight: "800", marginTop: 16 },
  meta: { color: colors.purple, fontSize: 8, fontWeight: "700", marginTop: 4 },
  description: { color: colors.textSecondary, fontSize: 9, marginTop: 7 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 24 },
  cell: { width: "31.4%", aspectRatio: 0.716 },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    backgroundColor: colors.card,
  },
  empty: {
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: { color: colors.textTertiary, fontSize: 8 },
  missing: {
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    padding: 7,
  },
  missingMark: { color: colors.purple, fontSize: 18 },
  missingName: {
    color: colors.text,
    fontSize: 7,
    textAlign: "center",
    marginTop: 5,
  },
  verify: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 28,
    justifyContent: "center",
  },
  verifyText: { color: colors.textSecondary, fontSize: 8, fontWeight: "700" },
});
