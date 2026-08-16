
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme';
import { CARD_LIBRARY } from '../data';

const RECENT = CARD_LIBRARY.slice(0, 5).map((card) => ({ id: card.id, label: card.name }));

export default function MyCollectionScreen({ navigate, goBack }) {
  const [query, setQuery] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} hitSlop={12}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addPlus}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Search for a card</Text>

      <View style={styles.inputRow}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search card name or number..."
          placeholderTextColor={colors.textTertiary}
          style={styles.input}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>RECENT SEARCHES</Text>
        {RECENT.map((item) => (
          <TouchableOpacity key={item.id} style={styles.rowItem} onPress={() => navigate('CardDetail', { cardId: item.id })}>
            <Text style={styles.rowIcon}>↻</Text>
            <Text style={styles.rowText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.scanBtn}>
        <Text style={styles.scanIcon}>▢</Text>
        <Text style={styles.scanText}>Scan Card</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 16 },
  back: { color: colors.text, fontSize: 28, fontWeight: '300' },
  addBtn: {
    width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.borderStrong,
    justifyContent: 'center', alignItems: 'center',
  },
  addPlus: { color: colors.text, fontSize: 18 },
  title: { color: colors.text, fontSize: 22, fontWeight: '500', marginTop: 20 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: 12, paddingHorizontal: 14, marginTop: 16, height: 46,
  },
  searchIcon: { color: colors.textSecondary, fontSize: 16, marginRight: 8 },
  input: { flex: 1, color: colors.text, fontSize: 14 },
  sectionLabel: { color: colors.textTertiary, fontSize: 11, fontWeight: '600', letterSpacing: 1.5, marginTop: 26, marginBottom: 8 },
  rowItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  rowIcon: { color: colors.textSecondary, fontSize: 14, width: 24 },
  rowText: { color: colors.text, fontSize: 15 },
  scanBtn: {
    flexDirection: 'row', backgroundColor: colors.purple, borderRadius: 24, paddingVertical: 15,
    justifyContent: 'center', alignItems: 'center', marginBottom: 30,
  },
  scanIcon: { color: colors.text, fontSize: 14, marginRight: 8 },
  scanText: { color: colors.text, fontSize: 14, fontWeight: '600' },
});
