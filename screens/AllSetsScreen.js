import React, { useMemo, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme';
import ProgressBar from '../components/ProgressBar';
import { SETS_BY_CATEGORY } from '../data';

const CATEGORY_OPTIONS = ['English', 'Japanese', 'Pocket Expansion'];

export default function AllSetsScreen({ navigate, collectionQuantities = {} }) {
  const [category, setCategory] = useState('English');
  const visibleSets = useMemo(() => SETS_BY_CATEGORY[category] || [], [category]);
  const progressBySet = useMemo(() => Object.fromEntries(visibleSets.map((set) => {
    const cards = set.masterCards || set.cards || [];
    const owned = cards.reduce(
      (sum, card) => sum + (Number(collectionQuantities[card.id] || 0) > 0 ? 1 : 0),
      0
    );
    return [set.id, {
      owned,
      total: cards.length,
      percent: cards.length ? Math.round((owned / cards.length) * 100) : 0,
    }];
  })), [visibleSets, collectionQuantities]);
  const inProgressCount = visibleSets.filter((set) => {
    const progress = progressBySet[set.id];
    return progress?.owned > 0 && progress?.owned < progress?.total;
  }).length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.titleBlock}>
        <Text style={styles.eyebrow}>POKÉMON TCG</Text>
        <Text style={styles.title}>Expansions</Text>
        <Text style={styles.subtitle}>
          {visibleSets.length} {category} sets · <Text style={{ color: colors.purple }}>{inProgressCount} in progress</Text>
        </Text>
      </View>

      <View style={styles.filterRow}>
        {CATEGORY_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.filterChip, category === option && styles.filterChipActive]}
            onPress={() => setCategory(option)}
          >
            <Text style={[styles.filterText, category === option && styles.filterTextActive]}>{option.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.grid}>
        {visibleSets.map((set) => {
          const progress = progressBySet[set.id] || { owned: 0, total: set.masterTotal || 0, percent: 0 };
          return (
          <TouchableOpacity
            key={set.id}
            style={styles.card}
            onPress={() => navigate('SetDetail', { setId: set.id })}
          >
            <Image
              source={{ uri: set.logo }}
              style={styles.cardImage}
              resizeMode="contain"
            />
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{set.name}</Text>
              <Text style={styles.cardPercent}>{progress.owned} of {progress.total} cards · {progress.percent}%</Text>
              <View style={styles.progressWrap}>
                <ProgressBar percent={progress.percent} color={colors.purple} height={2} />
              </View>
            </View>
            <Text style={styles.cardChevron}>›</Text>
          </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  titleBlock: { paddingHorizontal: 24, paddingTop: 24 },
  eyebrow: { color: colors.textTertiary, fontSize: 8, fontWeight: '700', letterSpacing: 1.3 },
  title: { color: colors.text, fontSize: 29, fontWeight: '700', marginTop: 4 },
  subtitle: { color: colors.textSecondary, fontSize: 10, marginTop: 5 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 24, marginTop: 18, gap: 8 },
  filterChip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  filterChipActive: { backgroundColor: colors.purple, borderColor: colors.purple },
  filterText: { color: colors.textSecondary, fontSize: 11, fontWeight: '600' },
  filterTextActive: { color: colors.text },
  grid: { paddingHorizontal: 24, marginTop: 22, paddingBottom: 40 },
  card: { minHeight: 90, marginBottom: 10, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 10, flexDirection: 'row', alignItems: 'center' },
  cardImage: { width: 74, height: 66, borderRadius: 9, backgroundColor: colors.card },
  cardInfo: { flex: 1, minWidth: 0, marginLeft: 13 },
  cardName: { color: colors.text, fontSize: 13, fontWeight: '700' },
  cardPercent: { color: colors.textSecondary, fontSize: 9, marginTop: 5 },
  progressWrap: { marginTop: 9 },
  cardChevron: { color: colors.textTertiary, fontSize: 18, marginLeft: 12 },
});
