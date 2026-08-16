
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { getCardById, getCardVariants, CARD_DETAIL } from '../data';

const TABS = ['All', 'Holo', 'Reverse Holo', 'Full Art'];

export default function VariantsScreen({ goBack, params = {} }) {
  const cardId = params.cardId || CARD_DETAIL.id;
  const card = getCardById(cardId, CARD_DETAIL);
  const allVariants = getCardVariants(cardId);
  const [tab, setTab] = useState('All');
  const [selected, setSelected] = useState(allVariants[0]?.id || `${cardId}-normal`);

  const filteredVariants =
    tab === 'All'
      ? allVariants
      : allVariants.filter((variant) => variant.label.toLowerCase().includes(tab.toLowerCase().replace(' ', '')) || variant.variant?.toLowerCase().includes(tab.toLowerCase().replace(' ', '')));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} hitSlop={12}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.name}>{card.name}</Text>
      <Text style={styles.number}>#{card.id}</Text>

      <View style={styles.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.grid}>
        {filteredVariants.map((v) => (
          <TouchableOpacity
            key={v.id}
            style={[styles.variantCard, selected === v.id && styles.variantCardActive]}
            onPress={() => setSelected(v.id)}
          >
            <Image
              source={{ uri: v.image || card.image }}
              style={styles.variantImage}
              resizeMode="contain"
            />
            <Text style={styles.variantLabel}>{v.label}</Text>
            <Text style={styles.variantNumber}>{v.number}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  header: { paddingTop: 16 },
  back: { color: colors.text, fontSize: 28, fontWeight: '300' },
  name: { color: colors.text, fontSize: 26, fontWeight: '500', marginTop: 12 },
  number: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  tabs: { flexDirection: 'row', marginTop: 20 },
  tab: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 16, marginRight: 8, borderWidth: 1, borderColor: colors.border },
  tabActive: { backgroundColor: colors.purple, borderColor: colors.purple },
  tabText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  tabTextActive: { color: colors.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 24 },
  variantCard: {
    width: '31%', borderRadius: 12, padding: 6, borderWidth: 1.5, borderColor: 'transparent', marginBottom: 16,
  },
  variantCardActive: { borderColor: colors.purple, backgroundColor: colors.purpleSoft },
  variantImage: { width: '100%', height: 110, borderRadius: 8, backgroundColor: colors.card },
  variantLabel: { color: colors.text, fontSize: 11, fontWeight: '500', marginTop: 8 },
  variantNumber: { color: colors.textTertiary, fontSize: 10, marginTop: 2 },
});
