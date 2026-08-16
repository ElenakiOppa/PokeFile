
import React, { useMemo, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { colors } from '../theme';
import { getSetById } from '../data';

const { width } = Dimensions.get('window');
const COLS = 3;
const GAP = 10;
const CARD_W = (width - 24 * 2 - GAP * (COLS - 1)) / COLS;
const TABS = ['Complete', 'Master', 'Grandmaster'];
const TAB_DEFINITIONS = {
  Complete: {
    short: 'Complete Set',
    text:
      'A Complete Set means owning exactly one copy of every uniquely numbered card listed in the main set checklist. It includes every base card from number 1 up to the final standard number of the expansion, including Secret Rares, Full Arts, and Illustration Rares that extend beyond the base numbering. It ignores card variant differences: a standard card and a reverse-holo version only count as one entry for that numbered card.',
  },
  Master: {
    short: 'Master Set',
    text:
      'A Master Set includes every single card and pullable variation available directly inside that expansion\'s booster packs. It includes the Complete Set plus every parallel foil variant, which means you need both the standard print and the Reverse-Holofoils and other booster-pack variants for each applicable card, along with Secret Rares, Gold cards, and Alternate Arts.',
  },
  Grandmaster: {
    short: 'Grandmaster Set',
    text:
      'A Grandmaster Set is the ultimate tier, encompassing the Master Set plus every external variant and promotional card tied to that expansion era. That includes retailer and event-stamped cards, holiday and special print variants, product exclusives, and associated promo cards packaged outside of standard booster packs.',
  },
};

export default function SetDetailScreen({ navigate, goBack, params = {} }) {
  const [tab, setTab] = useState('Master');
  const setId = params.setId || 'pitch-black';
  const set = useMemo(() => getSetById(setId), [setId]);

  const visibleCards = useMemo(() => {
    if (!set?.cards?.length) return [];

    if (tab === 'Complete') {
      const seen = new Set();
      return set.cards.filter((card) => {
        const key = String(card.number || '').trim();
        if (!key || card.isPromo || card.isSpecialEvent) return false;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    if (tab === 'Master') {
      return set.cards.filter((card) => !card.isPromo && !card.isSpecialEvent);
    }

    return set.cards;
  }, [set, tab]);

  const selectedDefinition = TAB_DEFINITIONS[tab] || TAB_DEFINITIONS.Master;

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
          <Text style={styles.percentBold}>{set.percent}%</Text> complete
        </Text>
        <Text style={styles.countText}>{Math.max(1, Math.round((set.percent / 100) * set.totalCards))} / {set.totalCards}</Text>
      </View>

      <View style={styles.tabs}>
        {TABS.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.tab, tab === item && styles.tabActive]}
            onPress={() => setTab(item)}
          >
            <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>{selectedDefinition.short}</Text>
        <Text style={styles.infoText}>{selectedDefinition.text}</Text>
      </View>

      <View style={styles.grid}>
        {visibleCards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[styles.cardTile, { width: CARD_W }]}
            onPress={() => navigate('CardDetail', { cardId: card.id })}
          >
            <Image
              source={{ uri: card.image }}
              style={[styles.cardImage, { height: CARD_W * 1.4 }]}
              resizeMode="contain"
            />
            <Text style={styles.cardName} numberOfLines={1}>{card.name}</Text>
            <Text style={styles.cardNumber}>{card.number}</Text>
            <Text style={styles.cardValue}>€{Number(card.value || 0).toFixed(2)}</Text>
          </TouchableOpacity>
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
  infoBox: { marginHorizontal: 24, marginBottom: 20, borderRadius: 12, backgroundColor: colors.card, padding: 14 },
  infoTitle: { color: colors.text, fontSize: 13, fontWeight: '600', marginBottom: 8 },
  infoText: { color: colors.textSecondary, fontSize: 12, lineHeight: 18 },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingBottom: 40,
  },
  cardTile: { marginBottom: 16 },
  cardImage: { width: '100%', borderRadius: 8, backgroundColor: colors.card },
  cardName: { color: colors.text, fontSize: 11, fontWeight: '500', marginTop: 6 },
  cardNumber: { color: colors.textTertiary, fontSize: 10, marginTop: 1 },
  cardValue: { color: colors.purple, fontSize: 10, fontWeight: '600', marginTop: 3 },
});
