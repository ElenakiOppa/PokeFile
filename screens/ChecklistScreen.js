
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { colors } from '../theme';
import TopBar from '../components/TopBar';
import { getSetById } from '../data';

const { width } = Dimensions.get('window');
const COLS = 3;
const GAP = 10;
const CARD_W = (width - 24 * 2 - GAP * (COLS - 1)) / COLS;

export default function ChecklistScreen({ navigate, goBack, params = {} }) {
  const setId = params.setId || 'pitch-black';
  const set = getSetById(setId);
  const [owned, setOwned] = useState(Object.fromEntries(set.cards.map((c) => [c.id, Boolean(c.collected)])));

  const toggle = (id) => setOwned((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={goBack} hitSlop={12}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <TopBar variant="title" onMenuPress={() => navigate('Menu')} onAvatarPress={() => navigate('Profile')} />
      </View>

      <Text style={styles.title}>{set.name.toUpperCase()}</Text>
      <Text style={styles.subtitle}>In your binder</Text>

      <View style={styles.grid}>
        {set.cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[styles.tile, { width: CARD_W }]}
            onPress={() => toggle(card.id)}
          >
            <Image
              source={{ uri: card.image }}
              style={[styles.image, { height: CARD_W * 1.4 }, !owned[card.id] && styles.imageDim]}
              resizeMode="contain"
            />
            <View style={[styles.checkbox, owned[card.id] && styles.checkboxActive]}>
              {owned[card.id] && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.cardNumber}>{card.number}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  headerRow: { position: 'relative' },
  back: { position: 'absolute', top: 16, left: 24, color: colors.text, fontSize: 28, fontWeight: '300', zIndex: 2 },
  title: { color: colors.text, fontSize: 30, fontWeight: '400', paddingHorizontal: 24, marginTop: 20 },
  subtitle: { color: colors.textSecondary, fontSize: 13, paddingHorizontal: 24, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 24, marginTop: 20, paddingBottom: 40 },
  tile: { marginBottom: 20 },
  image: { width: '100%', borderRadius: 8, backgroundColor: colors.card },
  imageDim: { opacity: 0.35 },
  checkbox: {
    position: 'absolute', top: 6, right: 6, width: 20, height: 20, borderRadius: 10,
    borderWidth: 1.5, borderColor: colors.text, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  checkboxActive: { backgroundColor: colors.purple, borderColor: colors.purple },
  checkmark: { color: colors.text, fontSize: 11, fontWeight: '700' },
  cardNumber: { color: colors.textTertiary, fontSize: 10, marginTop: 6 },
});
