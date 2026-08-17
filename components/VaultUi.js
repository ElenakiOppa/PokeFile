import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";

export function VaultHeader({ title, goBack, onRight, rightIcon = "ellipsis-horizontal" }) {
  return (
    <View style={s.header}>
      <View style={s.headerLeft}>
        {goBack ? (
          <TouchableOpacity style={s.iconButton} onPress={goBack} hitSlop={10}>
            <Ionicons name="chevron-back" size={17} color={colors.text} />
          </TouchableOpacity>
        ) : null}
        <Text style={s.headerTitle}>{title}</Text>
      </View>
      {onRight ? (
        <TouchableOpacity style={s.iconButton} onPress={onRight} hitSlop={10}>
          <Ionicons name={rightIcon} size={16} color={colors.text} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export function SectionLabel({ children, action, onAction }) {
  return (
    <View style={s.sectionRow}>
      <Text style={s.sectionLabel}>{children}</Text>
      {action ? <TouchableOpacity onPress={onAction}><Text style={s.sectionAction}>{action}</Text></TouchableOpacity> : null}
    </View>
  );
}

export function MiniSparkline({ values = [], height = 52, color = colors.purple }) {
  const [width, setWidth] = useState(0);
  const safe = values.length > 1 ? values.map(Number) : [0, Number(values[0] || 0)];
  const min = Math.min(...safe);
  const max = Math.max(...safe);
  const spread = max - min || 1;
  const pts = safe.map((value, index) => ({
    x: 2 + (index / Math.max(1, safe.length - 1)) * Math.max(0, width - 4),
    y: height - 5 - ((value - min) / spread) * (height - 10),
  }));
  return (
    <View style={{ width: "100%", height, position: "relative" }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 ? pts.slice(0, -1).map((point, index) => {
        const next = pts[index + 1];
        const length = Math.hypot(next.x - point.x, next.y - point.y);
        const angle = Math.atan2(next.y - point.y, next.x - point.x);
        return <View key={index} style={{ position: "absolute", height: 2, width: length, left: (point.x + next.x - length) / 2, top: (point.y + next.y) / 2, backgroundColor: color, transform: [{ rotate: `${angle}rad` }] }} />;
      }) : null}
    </View>
  );
}

export const vaultUi = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 28 },
  panel: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 16 },
  label: { color: colors.textSecondary, fontSize: 10, fontWeight: "600", textTransform: "uppercase" },
  input: { height: 42, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, color: colors.text, paddingHorizontal: 12, fontSize: 12 },
  primary: { height: 48, borderRadius: 14, backgroundColor: colors.purple, alignItems: "center", justifyContent: "center" },
  primaryText: { color: colors.bg, fontSize: 12, fontWeight: "800" },
});

const s = StyleSheet.create({
  header: { minHeight: 64, paddingHorizontal: 24, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  headerTitle: { color: colors.text, fontSize: 20, fontWeight: "800" },
  iconButton: { width: 34, height: 34, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  sectionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionLabel: { color: colors.textSecondary, fontSize: 11, fontWeight: "700", textTransform: "uppercase" },
  sectionAction: { color: colors.purple, fontSize: 10, fontWeight: "600" },
});
