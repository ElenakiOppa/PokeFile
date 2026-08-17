
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme';
import FilterChip from '../components/FilterChip';
import { CARD_LIBRARY, SETS } from '../data';

const SET_OPTIONS = ['All Sets', ...Array.from(new Set(SETS.map((set) => set.name).filter(Boolean)))];
const RARITY = ['All', ...Array.from(new Set(CARD_LIBRARY.map((card) => card.rarity).filter(Boolean))).sort()];
const CONDITION = ['All', 'Raw', 'Near Mint', 'Lightly Played', 'Moderately Played', 'Heavily Played', 'Damaged', 'PSA 10', 'PSA 9', 'PSA 8'];
const OWNERSHIP = ['All Cards', 'Owned', 'Missing'];
const DEFAULTS = { set: 'All Sets', rarity: 'All', condition: 'All', ownership: 'Owned' };

export default function CollectionFiltersScreen({ goBack, collectionFilters = DEFAULTS, setCollectionFilters = () => {} }) {
  const [set, setSet] = useState(collectionFilters.set || DEFAULTS.set);
  const [rarity, setRarity] = useState(collectionFilters.rarity || DEFAULTS.rarity);
  const [condition, setCondition] = useState(collectionFilters.condition || DEFAULTS.condition);
  const [ownership, setOwnership] = useState(collectionFilters.ownership || DEFAULTS.ownership);
  const clear = () => {
    setSet(DEFAULTS.set);
    setRarity(DEFAULTS.rarity);
    setCondition(DEFAULTS.condition);
    setOwnership(DEFAULTS.ownership);
  };
  const apply = () => {
    setCollectionFilters({ set, rarity, condition, ownership });
    goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FILTERS</Text>
        <TouchableOpacity onPress={clear}>
          <Text style={styles.clear}>CLEAR</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>SETS</Text>
        <View style={styles.chipRow}>
          {SET_OPTIONS.map((s) => <FilterChip key={s} label={s} active={set === s} onPress={() => setSet(s)} />)}
        </View>

        <Text style={styles.sectionLabel}>RARITY</Text>
        <View style={styles.chipRow}>
          {RARITY.map((r) => <FilterChip key={r} label={r} active={rarity === r} onPress={() => setRarity(r)} />)}
        </View>

        <Text style={styles.sectionLabel}>CONDITION</Text>
        <View style={styles.chipRow}>
          {CONDITION.map((c) => <FilterChip key={c} label={c} active={condition === c} onPress={() => setCondition(c)} />)}
        </View>

        <Text style={styles.sectionLabel}>OWNERSHIP</Text>
        <View style={styles.chipRow}>
          {OWNERSHIP.map((o) => <FilterChip key={o} label={o} active={ownership === o} onPress={() => setOwnership(o)} />)}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.applyBtn} onPress={apply}>
        <Text style={styles.applyText}>Apply Filters</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24, paddingTop: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.text, fontSize: 22, fontWeight: '600', letterSpacing: 1 },
  clear: { color: colors.purple, fontSize: 12, fontWeight: '600' },
  sectionLabel: { color: colors.textTertiary, fontSize: 11, fontWeight: '600', letterSpacing: 1.5, marginTop: 28, marginBottom: 10 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  applyBtn: { backgroundColor: colors.purple, borderRadius: 24, paddingVertical: 15, alignItems: 'center', marginBottom: 30, marginTop: 20 },
  applyText: { color: colors.text, fontSize: 14, fontWeight: '600' },
});
