import React, { useMemo, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { SETS } from '../data';
import { getSetRequirements } from '../lib/collectibles';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 54) / 2;

const setValue = (set) => getSetRequirements(set, 'master').reduce((sum, card) => sum + Number(card.value || card.price || 0), 0);

export default function SeriesViewScreen({ navigate, params = {} }) {
  const groups = useMemo(() => {
    const map = new Map();
    SETS.forEach((set) => {
      const key = set.series || (set.language === 'Pocket' ? 'Pokémon TCG Pocket' : 'Other Series');
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(set);
    });
    return [...map.entries()].map(([name, sets]) => ({ name, sets }));
  }, []);
  const requested = params.seriesId || params.series;
  const initial = groups.find((group) => group.name === requested)?.name || groups[0]?.name || '';
  const [expanded, setExpanded] = useState(initial);

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

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {groups.map((group) => {
          const open = expanded === group.name;
          return (
            <View key={group.name} style={styles.group}>
              <TouchableOpacity style={[styles.seriesHeader, open && styles.seriesHeaderOpen]} onPress={() => setExpanded(open ? '' : group.name)} activeOpacity={0.75}>
                <Text style={[styles.seriesName, open && styles.seriesNameOpen]}>{group.name}</Text>
                <Ionicons name={open ? 'chevron-down' : 'chevron-forward'} size={15} color={open ? colors.purple : '#a1a1aa'} />
              </TouchableOpacity>
              {open ? (
                <View style={styles.grid}>
                  {group.sets.map((set) => (
                    <TouchableOpacity key={set.id} style={styles.setCard} onPress={() => navigate('SetDetail', { setId: set.id })} activeOpacity={0.78}>
                      <View style={styles.logoWell}>
                        <Image source={{ uri: set.logo }} style={styles.logo} resizeMode="contain" />
                      </View>
                      <Text style={styles.setName} numberOfLines={1}>{set.name}</Text>
                      <Text style={styles.valuation}>Valuation: €{setValue(set).toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
                    </TouchableOpacity>
                  ))}
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
  scroll: { flex: 1 },
  content: { padding: 16, gap: 16, paddingBottom: 28 },
  group: { gap: 12 },
  seriesHeader: { minHeight: 42, paddingHorizontal: 12, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#121212', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  seriesHeaderOpen: { borderColor: 'rgba(212,175,55,0.25)' },
  seriesName: { color: '#f4f4f5', fontSize: 14, fontWeight: '700' },
  seriesNameOpen: { color: colors.purple },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  setCard: { width: CARD_WIDTH, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#121212', padding: 12, gap: 7 },
  logoWell: { width: '100%', height: 70, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#181818', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  logo: { width: '88%', height: 61 },
  setName: { color: '#f4f4f5', fontSize: 12, fontWeight: '600' },
  valuation: { color: '#a1a1aa', fontSize: 10 },
});
