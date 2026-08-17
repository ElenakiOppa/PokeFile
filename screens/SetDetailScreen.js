
import React, { useMemo, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { colors } from '../theme';
import { getSetById, rarityRank } from '../data';
import { getSetRequirements, isOwned } from '../lib/collectibles';

const { width } = Dimensions.get('window');
const COLS = 3;
const GAP = 10;
const CARD_W = (width - 24 * 2 - GAP * (COLS - 1)) / COLS;
const TABS = ['Complete', 'Master', 'Grandmaster'];

export default function SetDetailScreen({ navigate, goBack, params = {}, collectionQuantities = {}, setCardQuantity = () => {} }) {
  const [tab, setTab] = useState('Master');
  const [filters, setFilters] = useState({ show: 'All Cards', rarity: 'All', finish: 'All', sortBy: 'Number' });
  const setId = params.setId || 'pitch-black';
  const set = useMemo(() => getSetById(setId), [setId]);
  const availableTabs = TABS.filter((item) => item !== 'Grandmaster' || set.grandmasterAvailable);

  const tierCards = useMemo(() => {
    if (!set) return [];
    return getSetRequirements(set, tab.toLowerCase());
  }, [set, tab]);

  const visibleCards = useMemo(() => {
    const cards = tierCards.filter((card) => {
      const owned = isOwned(collectionQuantities, card);
      if (filters.show === 'Owned' && !owned) return false;
      if (filters.show === 'Missing' && owned) return false;
      if (filters.rarity !== 'All' && String(card.rarity) !== filters.rarity) return false;
      if (filters.finish !== 'All' && !String(card.variant || '').toLowerCase().includes(filters.finish.toLowerCase())) return false;
      return true;
    });
    if (filters.sortBy === 'Name') return cards.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    if (filters.sortBy === 'Rarity') return cards.sort((a, b) => rarityRank(a.rarity) - rarityRank(b.rarity) || Number(a.sourceOrder || 0) - Number(b.sourceOrder || 0));
    if (filters.sortBy === 'Price: High to Low') return cards.sort((a, b) => Number(b.value || 0) - Number(a.value || 0));
    if (filters.sortBy === 'Price: Low to High') return cards.sort((a, b) => Number(a.value || 0) - Number(b.value || 0));
    return cards;
  }, [tierCards, filters, collectionQuantities]);

  const totalOwnedCount = tierCards.reduce((total, card) => total + (isOwned(collectionQuantities, card) ? 1 : 0), 0);
  const completionPercent = tierCards.length ? Math.round((totalOwnedCount / tierCards.length) * 100) : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={goBack} hitSlop={12}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{set.name.toUpperCase()}</Text>
      </View>

      <View style={styles.progressRow}>
        <Text style={styles.percentText}>
          <Text style={styles.percentBold}>{completionPercent}%</Text> complete
        </Text>
        <Text style={styles.countText}>{totalOwnedCount} / {tierCards.length}</Text>
      </View>

      <View style={styles.tabs}>
        {availableTabs.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.tab, tab === item && styles.tabActive]}
            onPress={() => setTab(item)}
          >
            <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.toolsRow}>
        <TouchableOpacity style={styles.toolButton} onPress={() => navigate('SetCardGrid', { setId: set.id, tier: tab.toLowerCase() })}><Text style={styles.toolText}>Grid</Text></TouchableOpacity>
        <TouchableOpacity style={styles.toolButton} onPress={() => navigate('Checklist', { setId: set.id, tier: tab.toLowerCase() })}><Text style={styles.toolText}>Checklist</Text></TouchableOpacity>
        <TouchableOpacity style={styles.toolButton} onPress={() => navigate('SetFilters', { setId: set.id, tier: tab.toLowerCase(), filters, onApply: setFilters })}><Text style={styles.toolText}>Filters</Text></TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {visibleCards.map((card) => (
          <View key={card.id} style={[styles.cardTile, { width: CARD_W }]}>
            <TouchableOpacity onPress={() => navigate('CardDetail', { cardId: card.id })} activeOpacity={0.8}>
              <Image
                source={{ uri: card.image }}
                style={[styles.cardImage, { height: CARD_W * 1.4 }]}
                resizeMode="contain"
              />
              <Text style={styles.cardName} numberOfLines={1}>{card.name}</Text>
            </TouchableOpacity>
            <Text style={styles.cardNumber}>{card.number}</Text>
            <View style={styles.cardMetaRow}>
              <View style={styles.cardMetaText}>
                <Text style={styles.cardVariant} numberOfLines={1}>{card.variant}</Text>
                <Text style={styles.cardValue}>€{Number(card.value || 0).toFixed(2)}</Text>
              </View>
              <TouchableOpacity
                style={[styles.collectButton, collectionQuantities[card.id] > 0 && styles.collectButtonActive]}
                onPress={() => setCardQuantity(card.id, collectionQuantities[card.id] > 0 ? 0 : 1)}
                accessibilityRole="button"
                accessibilityLabel={`${collectionQuantities[card.id] > 0 ? 'Remove' : 'Add'} ${card.name} ${card.variant} ${collectionQuantities[card.id] > 0 ? 'from' : 'to'} collection`}
              >
                <Text style={styles.collectButtonText}>{collectionQuantities[card.id] > 0 ? '✓ 1' : '+ Collect'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingTop: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, marginBottom: 20 },
  back: { color: colors.text, fontSize: 28, fontWeight: '300', marginRight: 16 },
  title: { color: colors.text, fontSize: 24, fontWeight: '600', flexShrink: 1 },
  progressRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24,
  },
  percentText: { color: colors.textSecondary, fontSize: 14 },
  percentBold: { color: colors.text, fontWeight: '700' },
  countText: { color: colors.textSecondary, fontSize: 14 },
  tabs: { flexDirection: 'row', paddingHorizontal: 24, marginTop: 18, marginBottom: 18 },
  tab: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 16, marginRight: 8, borderWidth: 1, borderColor: colors.border },
  tabActive: { backgroundColor: colors.purple, borderColor: colors.purple },
  tabText: { color: colors.textSecondary, fontSize: 11, fontWeight: '600' },
  tabTextActive: { color: colors.text },
  toolsRow: { flexDirection: 'row', paddingHorizontal: 24, marginBottom: 18, gap: 8 },
  toolButton: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  toolText: { color: colors.textSecondary, fontSize: 11, fontWeight: '600' },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingBottom: 40,
  },
  cardTile: { marginBottom: 16 },
  cardImage: { width: '100%', borderRadius: 8, backgroundColor: colors.card },
  cardName: { color: colors.text, fontSize: 11, fontWeight: '500', marginTop: 6 },
  cardNumber: { color: colors.textTertiary, fontSize: 10, marginTop: 1 },
  cardVariant: { color: colors.textSecondary, fontSize: 9, marginTop: 2 },
  cardValue: { color: colors.purple, fontSize: 10, fontWeight: '600', marginTop: 3 },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4, marginTop: 2 },
  cardMetaText: { flex: 1, minWidth: 0 },
  collectButton: { backgroundColor: colors.purpleSoft, borderWidth: 1, borderColor: colors.purple, borderRadius: 999, paddingHorizontal: 7, paddingVertical: 5 },
  collectButtonActive: { backgroundColor: colors.purple },
  collectButtonText: { color: colors.text, fontSize: 8, fontWeight: '700' },
});
