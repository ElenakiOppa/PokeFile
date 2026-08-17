import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../theme";
import TopBar from "../components/TopBar";
import { formatMoney } from "../lib/valueEngine";
import { useAppContext } from "../AppContext";
const RANGES = { "1M": 31, "3M": 93, "6M": 186, "1Y": 366, ALL: Infinity };
function Chart({ points }) {
  const [width, setWidth] = useState(0);
  if (!points.length)
    return (
      <View style={s.chartEmpty}>
        <Text style={s.emptyTitle}>No history yet.</Text>
        <Text style={s.emptyText}>
          Your collection needs a little time to become a graph.
        </Text>
      </View>
    );
  const vals = points.map((p) => Number(p.totalValue || 0)),
    min = Math.min(...vals),
    max = Math.max(...vals),
    spread = max - min || 1;
  const coordinates = points.map((point, index) => ({
    x:
      points.length === 1
        ? width / 2
        : (index / (points.length - 1)) * Math.max(0, width - 8) + 4,
    y: 206 - ((Number(point.totalValue) - min) / spread) * 168,
  }));
  return (
    <View
      style={s.chart}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
    >
      {width > 0
        ? coordinates.slice(0, -1).map((point, index) => {
            const next = coordinates[index + 1];
            const length = Math.hypot(next.x - point.x, next.y - point.y);
            const angle = Math.atan2(next.y - point.y, next.x - point.x);
            return (
              <View
                key={`line-${index}`}
                style={[
                  s.line,
                  {
                    left: (point.x + next.x) / 2 - length / 2,
                    top: (point.y + next.y) / 2,
                    width: length,
                    transform: [{ rotate: `${angle}rad` }],
                  },
                ]}
              />
            );
          })
        : null}
      {coordinates.map((coordinate, index) => {
        return (
          <View
            key={points[index].id || index}
            style={[s.dot, { left: coordinate.x - 3, top: coordinate.y - 3 }]}
          />
        );
      })}
      <View style={s.baseLine} />
    </View>
  );
}
export default function ValueHistoryScreen({ goBack, valueSnapshots = [] }) {
  const { preferences } = useAppContext();
  const [range, setRange] = useState("ALL");
  const points = useMemo(() => {
    const days = RANGES[range],
      cutoff = Date.now() - days * 86400000;
    return valueSnapshots
      .filter(
        (p) => days === Infinity || new Date(p.timestamp).getTime() >= cutoff,
      )
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }, [valueSnapshots, range]);
  const first = points[0]?.totalValue || 0,
    last = points.at(-1)?.totalValue || 0,
    change = last - first;
  return (
    <ScrollView style={s.container}>
      <TopBar variant="back" onBackPress={goBack} />
      <View style={s.content}>
        <Text style={s.label}>VALUE HISTORY</Text>
        <Text style={s.value}>
          {formatMoney(last, preferences.currency || "EUR")}
        </Text>
        <Text style={s.change}>
          {points.length > 1
            ? `${change >= 0 ? "+" : ""}${formatMoney(change, preferences.currency || "EUR")} over period`
            : "Portfolio Value"}
        </Text>
        <View style={s.ranges}>
          {Object.keys(RANGES).map((item) => (
            <TouchableOpacity
              key={item}
              style={[s.range, range === item && s.rangeOn]}
              onPress={() => setRange(item)}
            >
              <Text style={[s.rangeText, range === item && s.rangeTextOn]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Chart points={points} />
        {points.length ? (
          <View style={s.summary}>
            <Text style={s.summaryLabel}>
              {points.length} SNAPSHOT{points.length === 1 ? "" : "S"}
            </Text>
            <Text style={s.summaryText}>
              Snapshots are recorded only when the portfolio value changes.
            </Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 24 },
  label: {
    color: colors.purple,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 2,
    marginTop: 22,
  },
  value: { color: colors.text, fontSize: 42, fontWeight: "300", marginTop: 16 },
  change: { color: colors.textSecondary, fontSize: 10, marginTop: 5 },
  ranges: { flexDirection: "row", marginTop: 30, gap: 7 },
  range: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rangeOn: { backgroundColor: colors.purple, borderColor: colors.purple },
  rangeText: { color: colors.textSecondary, fontSize: 9, fontWeight: "700" },
  rangeTextOn: { color: "#fff" },
  chart: {
    height: 240,
    marginTop: 28,
    borderBottomWidth: 1,
    borderColor: colors.border,
    position: "relative",
  },
  dot: {
    position: "absolute",
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.purple,
  },
  line: {
    position: "absolute",
    height: 2,
    backgroundColor: colors.purple,
    opacity: 0.72,
  },
  baseLine: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 22,
    height: 1,
    backgroundColor: colors.border,
  },
  chartEmpty: {
    height: 240,
    marginTop: 28,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: { color: colors.text, fontSize: 18 },
  emptyText: { color: colors.textSecondary, fontSize: 10, marginTop: 8 },
  summary: { marginTop: 22 },
  summaryLabel: {
    color: colors.textTertiary,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.3,
  },
  summaryText: { color: colors.textSecondary, fontSize: 10, marginTop: 6 },
});
