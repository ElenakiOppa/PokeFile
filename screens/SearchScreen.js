
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { CARD_LIBRARY, SETS } from '../data';
import RegistryHeader from '../components/RegistryHeader';

const RECENT = [
  ...CARD_LIBRARY.slice(0, 3).map((card) => ({ id: card.id, label: card.name, type: 'card' })),
  ...SETS.slice(0, 2).map((set) => ({ id: set.id, label: set.name, type: 'set' })),
];
const SUGGESTIONS = [
  { id: SETS[0]?.id || 'pitch-black', label: SETS[0]?.name || 'Pitch Black', type: 'set' },
  { id: CARD_LIBRARY[2]?.id || 'me5-49', label: CARD_LIBRARY[2]?.name || 'Mew ex', type: 'card' },
  { id: 'series', label: 'Mega Evolution', type: 'series' },
];

export default function SearchScreen({ navigate, goBack, binders = [] }) {
  const [query, setQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState('All');
  const [rarityFilter, setRarityFilter] = useState('All');
  const normalizedQuery = query.trim().toLowerCase();
  const results = normalizedQuery ? [
    ...(typeFilter === 'All' || typeFilter === 'Cards' ? CARD_LIBRARY.filter((card) => `${card.name} ${card.number} ${card.variant}`.toLowerCase().includes(normalizedQuery) && (rarityFilter === 'All' || card.rarity === rarityFilter)).slice(0, 20).map((card) => ({ id: card.id, label: `${card.name} · ${card.variant}`, type: 'card' })) : []),
    ...(typeFilter === 'All' || typeFilter === 'Sets' ? SETS.filter((set) => `${set.name} ${set.code}`.toLowerCase().includes(normalizedQuery)).slice(0, 10).map((set) => ({ id: set.id, label: set.name, type: 'set' })) : []),
    ...(typeFilter === 'All' || typeFilter === 'Binders' ? binders.filter((binder) => binder.name.toLowerCase().includes(normalizedQuery)).map((binder) => ({ id: binder.id, label: binder.name, type: 'binder' })) : []),
  ] : [];

  const handleResultPress = (item) => {
    if (item.type === 'card') {
      navigate('CardDetail', { cardId: item.id });
      return;
    }
    if (item.type === 'set') {
      navigate('SetDetail', { setId: item.id });
      return;
    }
    if (item.type === 'binder') {
      navigate('BinderDetail', { binderId: item.id });
      return;
    }
    navigate('SeriesView', { seriesId: item.id });
  };

  return (
    <View style={styles.container}>
      <RegistryHeader eyebrow="POKEFILE INDEX" title="Scan & Search" onBack={goBack} onRightPress={() => setFiltersOpen(true)} />
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Find any collectible.</Text>
        <Text style={styles.heroMeta}>Search the live Pokéfile card, set and binder index.</Text>
      </View>
      <View style={styles.inputRow}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search cards, sets, binders..."
          placeholderTextColor={colors.textTertiary}
          style={styles.input}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {normalizedQuery ? <><Text style={styles.sectionLabel}>RESULTS</Text>
        {results.length ? results.map((item) => (
          <TouchableOpacity key={`${item.type}-${item.id}`} style={styles.rowItem} onPress={() => handleResultPress(item)}>
            {item.type === 'card' ? <Image source={{ uri: CARD_LIBRARY.find((card) => card.id === item.id)?.image }} style={styles.resultImage} resizeMode="contain" /> : <View style={styles.resultMark}><Text style={styles.rowIcon}>→</Text></View>}<Text style={styles.rowText}>{item.label}</Text>
          </TouchableOpacity>
        )) : <TouchableOpacity style={styles.rowItem} onPress={() => navigate('NoSearchResults')}><Text style={styles.rowText}>No results. View search help →</Text></TouchableOpacity>}</> : <>
        <Text style={styles.sectionLabel}>RECENT SEARCHES</Text>
        {RECENT.map((item) => (
          <TouchableOpacity key={`${item.type}-${item.id}`} style={styles.rowItem} onPress={() => handleResultPress(item)}>
            <Text style={styles.rowIcon}>↻</Text>
            <Text style={styles.rowText}>{item.label}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionLabel}>SUGGESTIONS</Text>
        {SUGGESTIONS.map((item) => (
          <TouchableOpacity key={`${item.type}-${item.id}`} style={styles.rowItem} onPress={() => handleResultPress(item)}>
            <Text style={styles.rowIcon}>↗</Text>
            <Text style={styles.rowText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
        </>}
      </ScrollView>
      <Modal visible={filtersOpen} transparent animationType="slide" onRequestClose={() => setFiltersOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.filterSheet}>
            <View style={styles.filterHeader}><View><Text style={styles.filterEyebrow}>SEARCH INDEX</Text><Text style={styles.filterTitle}>Filters</Text></View><TouchableOpacity style={styles.filterClose} onPress={() => setFiltersOpen(false)}><Ionicons name="close" size={22} color={colors.text} /></TouchableOpacity></View>
            <Text style={styles.filterLabel}>RESULT TYPE</Text>
            <View style={styles.filterChips}>{['All','Cards','Sets','Binders'].map((value) => <TouchableOpacity key={value} style={[styles.filterChip, typeFilter === value && styles.filterChipOn]} onPress={() => setTypeFilter(value)}><Text style={[styles.filterChipText, typeFilter === value && styles.filterChipTextOn]}>{value}</Text></TouchableOpacity>)}</View>
            <Text style={styles.filterLabel}>CARD RARITY</Text>
            <ScrollView style={styles.rarityScroll} contentContainerStyle={styles.filterChips} showsVerticalScrollIndicator={false}>{['All', ...Array.from(new Set(CARD_LIBRARY.map((card) => card.rarity).filter(Boolean))).sort()].map((value) => <TouchableOpacity key={value} style={[styles.filterChip, rarityFilter === value && styles.filterChipOn]} onPress={() => setRarityFilter(value)}><Text style={[styles.filterChipText, rarityFilter === value && styles.filterChipTextOn]}>{value}</Text></TouchableOpacity>)}</ScrollView>
            <TouchableOpacity style={styles.apply} onPress={() => setFiltersOpen(false)}><Text style={styles.applyText}>Apply Search Filters</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  hero: { paddingHorizontal: 20, paddingTop: 24 },
  heroTitle: { color: colors.text, fontSize: 30, fontWeight: '800' },
  heroMeta: { color: colors.textSecondary, fontSize: 14, lineHeight: 20, marginTop: 8 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: 16, borderWidth: 1, borderColor: colors.purple, paddingHorizontal: 16, marginTop: 22, marginHorizontal: 20, height: 60,
  },
  searchIcon: { color: colors.textSecondary, fontSize: 16, marginRight: 8 },
  input: { flex: 1, color: colors.text, fontSize: 16 },
  sectionLabel: { color: colors.purple, fontSize: 10, fontWeight: '800', letterSpacing: 1.4, marginTop: 28, marginBottom: 10, marginHorizontal: 20 },
  rowItem: { minHeight: 72, flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 9, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  rowIcon: { color: colors.textSecondary, fontSize: 14, width: 24 },
  rowText: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '700' },
  resultImage: { width: 34, height: 46, marginRight: 10 },
  resultMark: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: colors.border, marginRight: 10, alignItems: 'center', justifyContent: 'center', paddingLeft: 7 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,.72)', justifyContent: 'flex-end' },
  filterSheet: { minHeight: 420, borderTopLeftRadius: 26, borderTopRightRadius: 26, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bg, padding: 22, paddingBottom: 34 },
  filterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, filterEyebrow: { color: colors.purple, fontSize: 9, fontWeight: '800', letterSpacing: 1.4 }, filterTitle: { color: colors.text, fontSize: 28, fontWeight: '800', marginTop: 5 }, filterClose: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  filterLabel: { color: colors.textSecondary, fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginTop: 24, marginBottom: 10 }, filterChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, filterChip: { minHeight: 40, paddingHorizontal: 15, borderRadius: 20, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }, filterChipOn: { borderColor: colors.purple, backgroundColor: colors.purpleSoft }, filterChipText: { color: colors.textSecondary, fontSize: 12, fontWeight: '700' }, filterChipTextOn: { color: colors.purple }, apply: { height: 54, borderRadius: 15, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center', marginTop: 28 }, applyText: { color: colors.bg, fontSize: 13, fontWeight: '800' },
  rarityScroll: { maxHeight: 210 },
});
