import React, { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { getSetById } from '../data';
import { getSetRequirements, isOwned } from '../lib/collectibles';
import { getLiveSetValuations } from '../lib/liveSetValuation';
import { applyCardFilters, setFilterKey } from '../lib/cardFilters';

export default function ChecklistScreen({ navigate, goBack, params = {}, collectionQuantities = {}, setCardQuantity = () => {}, setFiltersByKey = {} }) {
  const setId = params.setId || 'pitch-black';
  const set = getSetById(setId);
  const tier = String(params.tier || 'master').toLowerCase();
  const requirements = useMemo(() => getSetRequirements(set, tier), [set, tier]);
  const filterKey = setFilterKey(set?.id, tier);
  const cards = useMemo(() => applyCardFilters(requirements, setFiltersByKey[filterKey], collectionQuantities), [requirements, setFiltersByKey, filterKey, collectionQuantities]);
  const ownedById = useMemo(() => Object.fromEntries(requirements.map((card) => [card.id, isOwned(collectionQuantities, card)])), [requirements, collectionQuantities]);
  const ownedCount = requirements.reduce((sum, card) => sum + (ownedById[card.id] ? 1 : 0), 0);
  const percent = requirements.length ? (ownedCount / requirements.length) * 100 : 0;
  const [pricing, setPricing] = useState({ status: 'loading' });

  useEffect(() => {
    if (!set) return undefined;
    let active = true;
    setPricing({ status: 'loading' });
    getLiveSetValuations(set)
      .then((result) => { if (active) setPricing({ status: 'ready', ...result }); })
      .catch((error) => { if (active) setPricing({ status: 'error', message: error.message }); });
    return () => { active = false; };
  }, [set]);

  const tierPrices = pricing.valuations?.[tier]?.requirementPrices || {};

  const toggle = (card) => setCardQuantity(card.id, ownedById[card.id] ? 0 : 1);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerAction} onPress={goBack} hitSlop={10} accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={20} color="#f4f4f5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{set.name}</Text>
        <TouchableOpacity style={styles.headerAction} onPress={() => navigate('SetFilters', { setId: set.id, tier, cardCount: requirements.length })} hitSlop={10} accessibilityLabel="Filters">
          <Ionicons name="options-outline" size={18} color="#f4f4f5" />
        </TouchableOpacity>
      </View>

      <View style={styles.summary}>
        <View style={styles.statsRow}>
          <View>
            <Text style={styles.eyebrow}>{tier.toUpperCase()} INDEX PROGRESS</Text>
            <Text style={styles.count}>{ownedCount} / {requirements.length}</Text>
          </View>
          <Text style={styles.percent}>{percent.toFixed(1)}% Complete</Text>
        </View>
        <View style={styles.track}><View style={[styles.fill, { width: `${Math.min(100, percent)}%` }]} /></View>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {cards.map((card) => {
          const owned = ownedById[card.id];
          const value = Number(tierPrices[String(card.collectibleKey || card.id)] || 0);
          return (
            <View key={card.id} style={[styles.row, owned && styles.rowOwned]}>
              <TouchableOpacity style={[styles.checkbox, owned && styles.checkboxOwned]} onPress={() => toggle(card)} accessibilityLabel={owned ? `Remove ${card.name} from collection` : `Add ${card.name} to collection`}>
                {owned ? <Ionicons name="checkmark" size={15} color="#080808" /> : null}
              </TouchableOpacity>
              <Image source={{ uri: card.image }} style={styles.thumbnail} resizeMode="cover" />
              <TouchableOpacity style={styles.meta} onPress={() => navigate('CardDetail', { cardId: card.id })} activeOpacity={0.75}>
                <View style={styles.nameRow}>
                  <Text style={styles.number}>#{String(card.number || '').padStart(3, '0')}</Text>
                  <Text style={styles.name} numberOfLines={1}>{card.name}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.finish} numberOfLines={1}>{card.variant || card.finish || card.rarity || 'Standard'}</Text>
                  {value > 0 ? <Text style={styles.value}>€{value.toFixed(2)}</Text> : pricing.status === 'loading' ? <Text style={styles.pricePending}>Updating…</Text> : null}
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigate('CardDetail', { cardId: card.id })} hitSlop={10} accessibilityLabel={`View ${card.name}`}>
                <Ionicons name="chevron-forward" size={16} color="#71717a" />
              </TouchableOpacity>
            </View>
          );
        })}
        {!cards.length ? <Text style={styles.noResults}>No cards match these filters.</Text> : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#080808' },
  header: { height: 57, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)', flexDirection: 'row', alignItems: 'center' },
  headerAction: { width: 20, height: 28, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, color: '#f4f4f5', fontSize: 18, fontWeight: '700', marginHorizontal: 12 },
  summary: { padding: 24, gap: 16, backgroundColor: '#121212', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  statsRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  eyebrow: { color: colors.purple, fontSize: 12, fontWeight: '600' },
  count: { color: '#f4f4f5', fontSize: 28, lineHeight: 35, fontWeight: '700', marginTop: 4 },
  percent: { color: '#a1a1aa', fontSize: 14, fontWeight: '600', marginBottom: 4 },
  track: { height: 8, borderRadius: 4, backgroundColor: '#18181b', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4, backgroundColor: colors.purple },
  list: { flex: 1 },
  listContent: { padding: 16, gap: 8, paddingBottom: 28 },
  row: { minHeight: 80, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#121212', padding: 12, gap: 12, flexDirection: 'row', alignItems: 'center' },
  rowOwned: { borderColor: 'rgba(212,175,55,0.25)' },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 1.5, borderColor: '#71717a', alignItems: 'center', justifyContent: 'center' },
  checkboxOwned: { backgroundColor: colors.purple, borderColor: colors.purple },
  thumbnail: { width: 40, height: 56, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#18181b' },
  meta: { flex: 1, minWidth: 0, gap: 3 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  number: { color: '#71717a', fontSize: 11, fontWeight: '600' },
  name: { flex: 1, color: '#f4f4f5', fontSize: 14, fontWeight: '600' },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  finish: { maxWidth: '68%', color: '#a1a1aa', fontSize: 12 },
  value: { color: colors.purple, fontSize: 12 },
  pricePending: { color: '#71717a', fontSize: 11 },
  noResults: { color: '#a1a1aa', textAlign: 'center', marginTop: 36, fontSize: 13 },
});
