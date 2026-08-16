import React, { useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { colors } from '../theme';
import TopBar from '../components/TopBar';
import ProgressBar from '../components/ProgressBar';
import { getSetById } from '../data';

const { width } = Dimensions.get('window');
const COLS = 3;
const GAP = 10;
const CARD_W = (width - 24 * 2 - GAP * (COLS - 1)) / COLS;

export default function BinderDetailScreen({ navigate, params = {} }) {
  const binderId = params.binderId || 'pitch-black';
  const binder = useMemo(() => getSetById(binderId), [binderId]);
  const total = binder.totalCards;
  const percent = binder.percent;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TopBar variant="title" onMenuPress={() => navigate('Menu')} onAvatarPress={() => navigate('Profile')} />

      <View style={styles.titleRow}>
        <Text style={styles.title}>{binder.name.toUpperCase()}</Text>
        <TouchableOpacity onPress={() => navigate('BinderSettings', { binderId })}>
          <Text style={styles.filterIcon}>≡</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>{binder.type.toUpperCase()} SET</Text>

      <View style={styles.progressRow}>
        <Text style={styles.percentText}>
          <Text style={styles.percentBold}>{percent}%</Text> complete
        </Text>
        <Text style={styles.countText}>{Math.max(1, Math.round((percent / 100) * total))} / {total}</Text>
      </View>
      <View style={{ marginTop: 8 }}>
        <ProgressBar percent={percent} />
      </View>

      <View style={styles.grid}>
        {binder.cards.map((card) => (
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
            <TouchableOpacity style={styles.addChip} onPress={() => navigate('AddToCollection', { cardId: card.id })}>
              <Text style={styles.addChipText}>+ Collect</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  titleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, marginTop: 24,
  },
  title: { color: colors.text, fontSize: 32, fontWeight: '400', letterSpacing: 1 },
  filterIcon: { color: colors.text, fontSize: 22 },
  subtitle: { color: colors.purple, fontSize: 13, fontWeight: '600', letterSpacing: 2, paddingHorizontal: 24, marginTop: 6 },
  progressRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, marginTop: 20,
  },
  percentText: { color: colors.textSecondary, fontSize: 14 },
  percentBold: { color: colors.text, fontWeight: '700' },
  countText: { color: colors.textSecondary, fontSize: 14 },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
    paddingHorizontal: 24, marginTop: 24, paddingBottom: 40,
  },
  cardTile: { marginBottom: 16 },
  cardImage: { width: '100%', borderRadius: 8, backgroundColor: colors.card },
  cardName: { color: colors.text, fontSize: 11, fontWeight: '500', marginTop: 6 },
  cardNumber: { color: colors.textTertiary, fontSize: 10, marginTop: 1 },
  cardValue: { color: colors.purple, fontSize: 10, fontWeight: '600', marginTop: 3 },
  addChip: { marginTop: 8, alignSelf: 'flex-start', backgroundColor: colors.purpleSoft, borderWidth: 1, borderColor: colors.purple, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  addChipText: { color: colors.text, fontSize: 9, fontWeight: '600' },
});
