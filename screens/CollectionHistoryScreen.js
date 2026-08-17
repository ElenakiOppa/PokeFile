import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";
import TopBar from "../components/TopBar";
import { historyDateLabel } from "../lib/history";
const verb = {
  "card-added": "Added",
  "card-removed": "Removed",
  "quantity-changed": "Quantity changed",
  "binder-created": "Created binder",
  "binder-completed": "Completed",
  "wishlist-acquired": "Moved to collection",
  "milestone-unlocked": "Milestone unlocked",
  "graded-asset-added": "Added graded asset",
  "graded-asset-removed": "Removed graded asset",
  "sealed-asset-added": "Added sealed asset",
  "sealed-asset-removed": "Removed sealed asset",
  "vault-quantity-changed": "Vault quantity changed",
  "purchase-information-updated": "Purchase information updated",
  "manual-valuation-changed": "Manual valuation changed",
  "wishlist-target-changed": "Wishlist target changed",
};
export default function CollectionHistoryScreen({
  goBack,
  historyEvents = [],
}) {
  const groups = useMemo(
    () =>
      historyEvents
        .slice()
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .reduce((map, event) => {
          const label = historyDateLabel(event.timestamp);
          (map[label] ||= []).push(event);
          return map;
        }, {}),
    [historyEvents],
  );
  return (
    <ScrollView style={s.container}>
      <TopBar variant="back" onBackPress={goBack} />
      <View style={s.content}>
        <Text style={s.label}>COLLECTION HISTORY</Text>
        <Text style={s.title}>The story of your collection.</Text>
        {Object.keys(groups).length ? (
          Object.entries(groups).map(([date, events]) => (
            <View key={date} style={s.group}>
              <Text style={s.date}>{date}</Text>
              {events.map((event) => (
                <View key={event.id} style={s.event}>
                  <Text style={s.verb}>{verb[event.type] || event.type}</Text>
                  <Text style={s.name}>
                    {event.name ||
                      event.binderName ||
                      event.milestoneTitle ||
                      "Collection"}
                  </Text>
                  {event.finish ? (
                    <Text style={s.meta}>{event.finish}</Text>
                  ) : null}
                  {event.oldValue !== undefined ? (
                    <Text style={s.meta}>
                      {event.oldValue} → {event.newValue}
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>
          ))
        ) : (
          <Text style={s.empty}>
            Meaningful collection activity will appear here as you add cards and
            build binders.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 24, paddingBottom: 50 },
  label: {
    color: colors.purple,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2.2,
    marginTop: 22,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "300",
    marginTop: 14,
    marginBottom: 38,
  },
  group: { marginBottom: 34 },
  date: {
    color: colors.textTertiary,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.8,
    marginBottom: 8,
  },
  event: { borderTopWidth: 1, borderColor: colors.border, paddingVertical: 15 },
  verb: {
    color: colors.purple,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },
  name: { color: colors.text, fontSize: 17, marginTop: 5 },
  meta: { color: colors.textSecondary, fontSize: 10, marginTop: 3 },
  empty: { color: colors.textSecondary, fontSize: 12, lineHeight: 19 },
});
