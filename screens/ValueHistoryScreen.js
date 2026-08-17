import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import { formatMoney } from "../lib/valueEngine";
import { useAppContext } from "../AppContext";
import { MiniSparkline, SectionLabel, VaultHeader } from "../components/VaultUi";

const RANGES = { "1W": 8, "1M": 31, "3M": 93, "1Y": 366, ALL: Infinity };

export default function ValueHistoryScreen({ navigate, goBack, valueSnapshots = [] }) {
  const { preferences } = useAppContext();
  const currency = preferences.currency || "EUR";
  const [range, setRange] = useState("3M");
  const points = useMemo(() => {
    const days = RANGES[range];
    const cutoff = Date.now() - days * 86400000;
    return valueSnapshots.filter((p) => days === Infinity || new Date(p.timestamp).getTime() >= cutoff).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }, [valueSnapshots, range]);
  const values = points.map((p) => Number(p.totalValue || 0));
  const first = values[0] || 0;
  const last = values[values.length - 1] || 0;
  const change = last - first;
  const peak = values.length ? Math.max(...values) : 0;
  const floor = values.length ? Math.min(...values) : 0;
  const average = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  const peakPoint = points.find((p) => Number(p.totalValue) === peak);
  const floorPoint = points.find((p) => Number(p.totalValue) === floor);
  const dateText = (timestamp) => timestamp ? new Date(timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "No history";

  return <View style={s.screen}>
    <VaultHeader title="Portfolio Analytics" goBack={goBack} />
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.curveLabel}>ACTIVE VALUE CURVE</Text>
      <Text style={s.total}>{formatMoney(last, currency)}</Text>
      <Text style={[s.change, change < 0 && s.loss]}>{change >= 0 ? "+" : ""}{formatMoney(change, currency)} ({first ? `${change >= 0 ? "+" : ""}${((change / first) * 100).toFixed(2)}%` : "0.00%"}) over {range}</Text>
      <View style={s.ranges}>{Object.keys(RANGES).map((item) => <TouchableOpacity key={item} style={[s.range, range === item && s.rangeOn]} onPress={() => setRange(item)}><Text style={[s.rangeText, range === item && s.rangeTextOn]}>{item}</Text></TouchableOpacity>)}</View>
      <View style={s.chartPanel}>{values.length ? <MiniSparkline values={values} height={185} /> : <View style={s.empty}><Text style={s.emptyTitle}>No history yet</Text><Text style={s.emptyText}>Value snapshots appear after your portfolio changes.</Text></View>}</View>
      <View style={s.statistics}><SectionLabel>Index Statistics</SectionLabel><View style={s.statsGrid}>
        <Stat title="Peak Valuation" value={formatMoney(peak, currency)} meta={dateText(peakPoint?.timestamp)} />
        <Stat title="Floor Valuation" value={formatMoney(floor, currency)} meta={dateText(floorPoint?.timestamp)} />
        <Stat title="Vault Average" value={formatMoney(average, currency)} meta={`${points.length} value snapshots`} />
        <Stat title="Total Net Gain" value={`${change >= 0 ? "+" : ""}${formatMoney(change, currency)}`} meta="Since selected period" accent={change >= 0} loss={change < 0} />
      </View></View>
      <View style={s.vaultTabs}><VaultTab icon="shield-checkmark-outline" label="Vault" onPress={() => navigate("Vault")} /><VaultTab icon="add-circle-outline" label="Add" onPress={() => navigate("AddGradedAsset")} /><VaultTab icon="analytics-outline" label="History" active onPress={() => {}} /></View>
    </ScrollView>
  </View>;
}

const Stat = ({ title, value, meta, accent, loss }) => <View style={s.stat}><Text style={s.statTitle}>{title}</Text><Text style={[s.statValue, accent && s.gain, loss && s.loss]} numberOfLines={1} adjustsFontSizeToFit>{value}</Text><Text style={s.statMeta}>{meta}</Text></View>;
const VaultTab = ({ icon, label, active, onPress }) => <TouchableOpacity style={s.vaultTab} onPress={onPress}><Ionicons name={icon} size={19} color={active ? colors.purple : colors.textTertiary} /><Text style={[s.vaultTabText, active && s.vaultTabActive]}>{label}</Text></TouchableOpacity>;

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg }, content: { paddingHorizontal: 24, paddingBottom: 18 },
  curveLabel: { color: colors.textSecondary, fontSize: 10, textAlign: "center", marginTop: 8 }, total: { color: colors.text, fontSize: 32, fontWeight: "800", textAlign: "center", marginTop: 6 }, change: { color: "#10B981", fontSize: 9, fontWeight: "600", textAlign: "center", marginTop: 7 }, loss: { color: colors.red }, gain: { color: "#10B981" },
  ranges: { height: 42, marginTop: 24, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 4, flexDirection: "row" }, range: { flex: 1, borderRadius: 9, alignItems: "center", justifyContent: "center" }, rangeOn: { borderWidth: 1, borderColor: colors.purple, backgroundColor: colors.purpleSoft }, rangeText: { color: colors.textSecondary, fontSize: 9, fontWeight: "600" }, rangeTextOn: { color: colors.purple, fontWeight: "800" },
  chartPanel: { height: 205, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, marginTop: 16, padding: 16, justifyContent: "center" }, empty: { alignItems: "center" }, emptyTitle: { color: colors.text, fontSize: 13, fontWeight: "700" }, emptyText: { color: colors.textSecondary, fontSize: 9, marginTop: 6 },
  statistics: { marginTop: 22 }, statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 10, marginTop: 12 }, stat: { width: "48.5%", minHeight: 90, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 14 }, statTitle: { color: colors.textTertiary, fontSize: 9 }, statValue: { color: colors.text, fontSize: 16, fontWeight: "800", marginTop: 7 }, statMeta: { color: colors.textTertiary, fontSize: 7, marginTop: 5 },
  vaultTabs: { height: 58, marginHorizontal: -24, marginTop: 24, paddingHorizontal: 24, borderTopWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: "row", justifyContent: "space-between" }, vaultTab: { width: 72, alignItems: "center", justifyContent: "center" }, vaultTabText: { color: colors.textTertiary, fontSize: 8, marginTop: 3 }, vaultTabActive: { color: colors.purple, fontWeight: "700" },
});
