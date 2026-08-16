import React, { useMemo, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { colors, type } from '../theme';
import TopBar from '../components/TopBar';
import ProgressBar from '../components/ProgressBar';
import { SETS_BY_CATEGORY } from '../data';

const { width } = Dimensions.get('window');
const CARD_W = (width - 24 * 2 - 16) / 2;
const CATEGORY_OPTIONS = ['English', 'Japanese', 'Pocket Expansion'];

export default function AllSetsScreen({ navigate }) {
  const [category, setCategory] = useState('English');
  const visibleSets = useMemo(() => SETS_BY_CATEGORY[category] || [], [category]);
  const inProgressCount = visibleSets.filter((s) => s.percent > 0 && s.percent < 100).length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TopBar variant="title" onMenuPress={() => navigate('Menu')} onAvatarPress={() => navigate('Profile')} />

      <View style={styles.titleBlock}>
        <Text style={styles.title}>ALL{'\n'}SETS</Text>
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
        {visibleSets.map((set) => (
          <TouchableOpacity
            key={set.id}
            style={[styles.card, { width: CARD_W }]}
            onPress={() => navigate('SetDetail', { setId: set.id })}
          >
            <Image
              source={{ uri: set.logo }}
              style={styles.cardImage}
              resizeMode="contain"
            />
            <Text style={styles.cardName}>{set.name}</Text>
            <Text style={styles.cardPercent}>{set.percent}%</Text>
            <View style={{ marginTop: 6 }}>
              <ProgressBar percent={set.percent} color={colors.purple} height={2} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  titleBlock: { paddingHorizontal: 24, marginTop: 20 },
  title: { color: colors.text, fontSize: 48, fontWeight: '300', lineHeight: 48 },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginTop: 14 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 24, marginTop: 18, gap: 8 },
  filterChip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  filterChipActive: { backgroundColor: colors.purple, borderColor: colors.purple },
  filterText: { color: colors.textSecondary, fontSize: 11, fontWeight: '600' },
  filterTextActive: { color: colors.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 24, marginTop: 24, paddingBottom: 40 },
  card: { marginBottom: 24 },
  cardImage: { width: '100%', height: 160, borderRadius: 10, backgroundColor: colors.card },
  cardName: { color: colors.text, fontSize: 14, fontWeight: '500', marginTop: 10 },
  cardPercent: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
});
