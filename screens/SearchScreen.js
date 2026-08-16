
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme';
import { CARD_LIBRARY, SETS } from '../data';

const RECENT = [
  ...CARD_LIBRARY.slice(0, 3).map((card) => ({ id: card.id, label: card.name, type: 'card' })),
  ...SETS.slice(0, 2).map((set) => ({ id: set.id, label: set.name, type: 'set' })),
];
const SUGGESTIONS = [
  { id: SETS[0]?.id || 'pitch-black', label: SETS[0]?.name || 'Pitch Black', type: 'set' },
  { id: CARD_LIBRARY[2]?.id || 'me5-49', label: CARD_LIBRARY[2]?.name || 'Mew ex', type: 'card' },
  { id: 'series', label: 'Mega Evolution', type: 'series' },
];

export default function SearchScreen({ navigate, goBack }) {
  const [query, setQuery] = useState('');

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
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} hitSlop={12}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>SEARCH</Text>

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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  header: { flexDirection: 'row', paddingTop: 16 },
  back: { color: colors.text, fontSize: 28, fontWeight: '300' },
  title: { color: colors.text, fontSize: 36, fontWeight: '300', marginTop: 12 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: 12, paddingHorizontal: 14, marginTop: 20, height: 46,
  },
  searchIcon: { color: colors.textSecondary, fontSize: 16, marginRight: 8 },
  input: { flex: 1, color: colors.text, fontSize: 14 },
  sectionLabel: { color: colors.textTertiary, fontSize: 11, fontWeight: '600', letterSpacing: 1.5, marginTop: 28, marginBottom: 8 },
  rowItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  rowIcon: { color: colors.textSecondary, fontSize: 14, width: 24 },
  rowText: { color: colors.text, fontSize: 15 },
});
