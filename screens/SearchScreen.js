
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
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
  const normalizedQuery = query.trim().toLowerCase();
  const results = normalizedQuery ? [
    ...CARD_LIBRARY.filter((card) => `${card.name} ${card.number} ${card.variant}`.toLowerCase().includes(normalizedQuery)).slice(0, 20).map((card) => ({ id: card.id, label: `${card.name} · ${card.variant}`, type: 'card' })),
    ...SETS.filter((set) => `${set.name} ${set.code}`.toLowerCase().includes(normalizedQuery)).slice(0, 10).map((set) => ({ id: set.id, label: set.name, type: 'set' })),
    ...binders.filter((binder) => binder.name.toLowerCase().includes(normalizedQuery)).map((binder) => ({ id: binder.id, label: binder.name, type: 'binder' })),
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
      <RegistryHeader eyebrow="POKEFILE INDEX" title="Scan & Search" onBack={goBack} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  hero: { paddingHorizontal: 16, paddingTop: 20 },
  heroTitle: { color: colors.text, fontSize: 24, fontWeight: '700' },
  heroMeta: { color: colors.textSecondary, fontSize: 11, marginTop: 5 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: 13, borderWidth: 1, borderColor: colors.purple, paddingHorizontal: 14, marginTop: 18, marginHorizontal: 14, height: 50,
  },
  searchIcon: { color: colors.textSecondary, fontSize: 16, marginRight: 8 },
  input: { flex: 1, color: colors.text, fontSize: 14 },
  sectionLabel: { color: colors.purple, fontSize: 9, fontWeight: '800', letterSpacing: 1.2, marginTop: 24, marginBottom: 8, marginHorizontal: 14 },
  rowItem: { minHeight: 58, flexDirection: 'row', alignItems: 'center', marginHorizontal: 14, marginBottom: 7, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  rowIcon: { color: colors.textSecondary, fontSize: 14, width: 24 },
  rowText: { flex: 1, color: colors.text, fontSize: 13, fontWeight: '600' },
  resultImage: { width: 34, height: 46, marginRight: 10 },
  resultMark: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: colors.border, marginRight: 10, alignItems: 'center', justifyContent: 'center', paddingLeft: 7 },
});
