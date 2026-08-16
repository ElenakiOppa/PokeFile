
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { colors, type } from '../theme';
import TopBar from '../components/TopBar';
import { CARD_LIBRARY } from '../data';

const { width } = Dimensions.get('window');
const COLS = 3;
const GAP = 10;
const CARD_W = (width - 24 * 2 - GAP * (COLS - 1)) / COLS;
const TABS = ['All', 'Recent', 'Favorites'];

export default function CollectionAllScreen({ navigate }) {
  const [tab, setTab] = useState('All');
  const cards = CARD_LIBRARY.filter((card) => card.collected || tab !== 'Favorites');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TopBar variant="title" onMenuPress={() => navigate('Menu')} onAvatarPress={() => navigate('Profile')} />

      <View style={styles.titleRow}>
        <View>
          <Text style={type.label}>COLLECTION</Text>
          <Text style={type.hugeNumber}>{String(cards.length).padStart(2, '0')}</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={() => navigate('CollectionFilters')}>
          <Text style={styles.filterIcon}>⌕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.grid}>
        {cards.map((card, i) => (
          <TouchableOpacity
            key={`${card.id}-${i}`}
            style={[styles.tile, { width: CARD_W }]}
            onPress={() => navigate('CardDetail', { cardId: card.id })}
          >
            <Image
              source={{ uri: card.image }}
              style={[styles.image, { height: CARD_W * 1.4 }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 24, marginTop: 20 },
  filterBtn: {
    width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.borderStrong,
    justifyContent: 'center', alignItems: 'center', marginTop: 6,
  },
  filterIcon: { color: colors.text, fontSize: 16 },
  tabs: { flexDirection: 'row', paddingHorizontal: 24, marginTop: 20 },
  tab: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 16, marginRight: 8, borderWidth: 1, borderColor: colors.border },
  tabActive: { backgroundColor: colors.purple, borderColor: colors.purple },
  tabText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  tabTextActive: { color: colors.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 24, marginTop: 20, paddingBottom: 40 },
  tile: { marginBottom: 10 },
  image: { width: '100%', borderRadius: 8, backgroundColor: colors.card },
});
