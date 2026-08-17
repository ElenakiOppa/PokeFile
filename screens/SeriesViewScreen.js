import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { SETS } from '../data';
import { getLiveSetValuations } from '../lib/liveSetValuation';

const { width } = Dimensions.get('window');
const HORIZONTAL_PADDING = 16;
const GRID_GAP = 12;
const CARD_WIDTH = (width - (HORIZONTAL_PADDING * 2) - GRID_GAP) / 2;

const formatValuation = (value) => value == null
  ? 'Unavailable'
  : new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const seriesLabel = (name) => /series$/i.test(name) ? name : `${name} Series`;
const CATALOGS = [
  { key: 'English', label: 'English' },
  { key: 'Japanese', label: 'Japanese' },
  { key: 'Pocket Expansion', label: 'Pocket' },
];

export default function SeriesViewScreen({ navigate, params = {} }) {
  const requestedCatalog = params.category || params.catalog;
  const [catalog, setCatalog] = useState(CATALOGS.some((item) => item.key === requestedCatalog) ? requestedCatalog : 'English');
  const groups = useMemo(() => {
    const map = new Map();
    SETS.filter((set) => set.category === catalog).forEach((set) => {
      const key = set.series || (set.language === 'Pocket' ? 'Pokémon TCG Pocket' : 'Other Series');
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(set);
    });
    return [...map.entries()].map(([name, sets]) => ({ name, sets }));
  }, [catalog]);
  const requested = params.seriesId || params.series;
  const initial = groups.find((group) => group.name === requested)?.name || groups[0]?.name || '';
  const [expanded, setExpanded] = useState(initial);
  const [liveValues, setLiveValues] = useState({});

  useEffect(() => {
    if (!groups.some((group) => group.name === expanded)) setExpanded(groups[0]?.name || '');
  }, [catalog, groups, expanded]);

  useEffect(() => {
    const sets = groups.find((group) => group.name === expanded)?.sets || [];
    const pending = sets.filter((set) => !liveValues[set.id]);
    if (!pending.length) return undefined;
    let active = true;
    setLiveValues((current) => Object.fromEntries([
      ...Object.entries(current),
      ...pending.map((set) => [set.id, { status: 'loading' }]),
    ]));
    Promise.all(pending.map(async (set) => {
      try {
        const result = await getLiveSetValuations(set);
        return [set.id, { status: 'ready', ...result }];
      } catch (error) {
        return [set.id, { status: 'error', message: error.message }];
      }
    })).then((entries) => {
      if (active) setLiveValues((current) => ({ ...current, ...Object.fromEntries(entries) }));
    });
    return () => { active = false; };
  }, [expanded, groups]);

  const valuationLabel = (set) => {
    const state = liveValues[set.id];
    if (!state || state.status === 'loading') return 'Updating live value…';
    if (state.status === 'error') return 'Live value unavailable';
    const quote = state.valuations?.complete;
    if (!quote?.priced) return 'Valuation unavailable';
    return `Valuation: ${formatValuation(quote.value)}`;
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigate('Menu')} accessibilityLabel="Open menu">
            <Ionicons name="menu" size={18} color="#f4f4f5" />
          </TouchableOpacity>
          <View>
            <Text style={styles.eyebrow}>EXPANSIONS CHRONOLOGY</Text>
            <Text style={styles.title}>Browse Series</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigate('Search')} accessibilityLabel="Search sets">
          <Ionicons name="search" size={17} color="#f4f4f5" />
        </TouchableOpacity>
      </View>

      <View style={styles.catalogTabs}>
        {CATALOGS.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[styles.catalogTab, catalog === item.key && styles.catalogTabActive]}
            onPress={() => setCatalog(item.key)}
            activeOpacity={0.75}
          >
            <Text style={[styles.catalogTabText, catalog === item.key && styles.catalogTabTextActive]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {groups.map((group) => {
          const open = expanded === group.name;
          return (
            <View key={group.name} style={styles.group}>
              <TouchableOpacity style={[styles.seriesHeader, open && styles.seriesHeaderOpen]} onPress={() => setExpanded(open ? '' : group.name)} activeOpacity={0.75}>
                <Text style={[styles.seriesName, open && styles.seriesNameOpen]}>{seriesLabel(group.name)}</Text>
                <Ionicons name={open ? 'chevron-down' : 'chevron-forward'} size={15} color={open ? colors.purple : '#a1a1aa'} />
              </TouchableOpacity>
              {open ? (
                <View style={styles.grid}>
                  {group.sets.map((set) => {
                    return (
                      <TouchableOpacity key={set.id} style={styles.setCard} onPress={() => navigate('SetDetail', { setId: set.id })} activeOpacity={0.78}>
                        <View style={styles.logoWell}>
                          <Image source={{ uri: set.logo }} style={styles.logo} resizeMode="contain" />
                        </View>
                        <Text style={styles.setName} numberOfLines={1}>{set.name}</Text>
                        <Text style={styles.valuation}>{valuationLabel(set)}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#080808' },
  header: { height: 63, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerButton: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#121212', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  eyebrow: { color: colors.purple, fontSize: 11, lineHeight: 14, fontWeight: '600' },
  title: { color: '#f4f4f5', fontSize: 18, lineHeight: 23, fontWeight: '700', marginTop: 2 },
  catalogTabs: { marginHorizontal: HORIZONTAL_PADDING, marginTop: 4, padding: 4, borderRadius: 13, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#121212', flexDirection: 'row', gap: 4 },
  catalogTab: { flex: 1, minHeight: 34, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  catalogTabActive: { backgroundColor: colors.purple },
  catalogTabText: { color: '#a1a1aa', fontSize: 10, fontWeight: '700' },
  catalogTabTextActive: { color: '#080808' },
  scroll: { flex: 1 },
  content: { padding: HORIZONTAL_PADDING, gap: 16, paddingBottom: 28 },
  group: { gap: 12 },
  seriesHeader: { minHeight: 42, paddingHorizontal: 12, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#121212', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  seriesHeaderOpen: { borderColor: 'rgba(212,175,55,0.25)' },
  seriesName: { color: '#f4f4f5', fontSize: 14, fontWeight: '700' },
  seriesNameOpen: { color: colors.purple },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GRID_GAP },
  setCard: { width: CARD_WIDTH, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#121212', padding: 12, gap: 7 },
  logoWell: { width: '100%', height: 70, alignItems: 'center', justifyContent: 'center' },
  logo: { width: '88%', height: 61 },
  setName: { color: '#f4f4f5', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  valuation: { color: '#a1a1aa', fontSize: 10, textAlign: 'center' },
});
