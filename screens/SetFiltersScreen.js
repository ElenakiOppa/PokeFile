
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme';
import FilterChip from '../components/FilterChip';

const RARITY = ['All', 'Common', 'Uncommon', 'Rare', 'Ultra Rare', 'Secret Rare'];
const FINISH = ['All', 'Holo', 'Reverse Holo'];
const SHOW = ['All Cards', 'Owned', 'Missing'];

export default function SetFiltersScreen({ goBack }) {
  const [show, setShow] = useState('All Cards');
  const [rarity, setRarity] = useState('All');
  const [finish, setFinish] = useState('All');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FILTERS</Text>
        <TouchableOpacity onPress={goBack}>
          <Text style={styles.clear}>CLEAR</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>SHOW</Text>
        <View style={styles.chipRow}>
          {SHOW.map((s) => (
            <FilterChip key={s} label={s} active={show === s} onPress={() => setShow(s)} />
          ))}
        </View>

        <Text style={styles.sectionLabel}>RARITY</Text>
        <View style={styles.chipRow}>
          {RARITY.map((r) => (
            <FilterChip key={r} label={r} active={rarity === r} onPress={() => setRarity(r)} />
          ))}
        </View>

        <Text style={styles.sectionLabel}>FINISH</Text>
        <View style={styles.chipRow}>
          {FINISH.map((f) => (
            <FilterChip key={f} label={f} active={finish === f} onPress={() => setFinish(f)} />
          ))}
        </View>

        <Text style={styles.sectionLabel}>SORT BY</Text>
        <TouchableOpacity style={styles.sortRow}>
          <Text style={styles.sortText}>Number</Text>
          <Text style={styles.sortChevron}>⌄</Text>
        </TouchableOpacity>
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
  sortRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.card, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
  },
  sortText: { color: colors.text, fontSize: 14 },
  sortChevron: { color: colors.textSecondary, fontSize: 14 },
  applyBtn: {
    backgroundColor: colors.purple, borderRadius: 24, paddingVertical: 15,
    alignItems: 'center', marginBottom: 30, marginTop: 20,
  },
  applyText: { color: colors.text, fontSize: 14, fontWeight: '600' },
});
