
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme';
import FilterChip from '../components/FilterChip';
import { SETS } from '../data';

const SET_OPTIONS = ['All Sets', ...SETS.slice(0, 8).map((set) => set.name)];
const RARITY = ['All', 'Rare', 'Ultra Rare', 'Secret Rare'];
const CONDITION = ['All', 'Near Mint', 'Lightly Played', 'Damaged'];
const OWNERSHIP = ['All Cards', 'Owned', 'Missing'];

export default function CollectionFiltersScreen({ goBack }) {
  const [set, setSet] = useState('All Sets');
  const [rarity, setRarity] = useState('All');
  const [condition, setCondition] = useState('All');
  const [ownership, setOwnership] = useState('All Cards');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FILTERS</Text>
        <TouchableOpacity onPress={goBack}>
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

      <TouchableOpacity style={styles.applyBtn} onPress={goBack}>
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
