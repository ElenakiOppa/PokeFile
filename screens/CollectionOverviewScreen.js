
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme';
import { CARD_LIBRARY, PROFILE } from '../data';

export default function CollectionOverviewScreen({ navigate, goBack, collectionQuantities = {}, binders = [] }) {
  const collectedCards = CARD_LIBRARY.filter((card) => Number(collectionQuantities[card.id] || 0) > 0);
  const recentCard = collectedCards[0] || null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} hitSlop={12}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.label}>COLLECTION OVERVIEW</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.statsRow}>
        <Stat value={String(Object.values(collectionQuantities).reduce((sum, quantity) => sum + Number(quantity || 0), 0))} label="Cards" />
        <Stat value={String(PROFILE.stats.sets)} label="Sets" />
        <Stat value={String(binders.length)} label="Binders" />
      </View>

      <View style={styles.valueBlock}>
        <Text style={styles.valueAmount}>€{collectedCards.reduce((sum, card) => sum + Number(card.value || 0) * Number(collectionQuantities[card.id] || 0), 0).toFixed(2)}</Text>
        <Text style={styles.valueLabel}>Collection Value</Text>
      </View>

      <TouchableOpacity style={styles.filtersBtn} onPress={() => navigate('CollectionFilters')}>
        <Text style={styles.filtersBtnText}>Apply Filters</Text>
      </TouchableOpacity>

      {recentCard ? (
        <TouchableOpacity
          style={styles.recentCard}
          onPress={() => navigate('CardDetail', { cardId: recentCard.id })}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: recentCard.image }}
            style={styles.recentThumb}
            resizeMode="contain"
          />
          <View style={{ marginLeft: 14 }}>
            <Text style={styles.recentName}>{recentCard.name}</Text>
            <Text style={styles.recentPrice}>€{Number(recentCard.value || 0).toFixed(2)}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Your collection is empty</Text>
          <Text style={styles.emptyText}>When you add cards, they will show up here.</Text>
        </View>
      )}
    </ScrollView>
  );
}

function Stat({ value, label }) {
  return (
    <View style={{ alignItems: 'flex-start' }}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20 },
  back: { color: colors.text, fontSize: 28, fontWeight: '300' },
  label: { color: colors.textTertiary, fontSize: 11, fontWeight: '600', letterSpacing: 1.5, flex: 1, textAlign: 'center' },
  headerSpacer: { width: 28 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, width: '70%' },
  statValue: { color: colors.text, fontSize: 26, fontWeight: '300' },
  statLabel: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
  valueBlock: { marginTop: 28 },
  valueAmount: { color: colors.text, fontSize: 34, fontWeight: '300' },
  valueLabel: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
  filtersBtn: { backgroundColor: colors.purple, borderRadius: 24, paddingVertical: 14, alignItems: 'center', marginTop: 24 },
  filtersBtnText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  recentCard: { flexDirection: 'row', alignItems: 'center', marginTop: 32, marginBottom: 40 },
  recentThumb: { width: 60, height: 80, borderRadius: 8, backgroundColor: colors.card },
  recentName: { color: colors.text, fontSize: 15, fontWeight: '500' },
  recentPrice: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
  emptyState: { marginTop: 32, padding: 20, borderRadius: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '600' },
  emptyText: { color: colors.textSecondary, fontSize: 13, marginTop: 8 },
});
