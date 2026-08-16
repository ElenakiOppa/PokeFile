
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { colors } from '../theme';
import TopBar from '../components/TopBar';
import ProgressBar from '../components/ProgressBar';
import { SETS } from '../data';

const { width } = Dimensions.get('window');
const CARD_W = (width - 24 * 2 - 16) / 2;

export default function SeriesViewScreen({ navigate, goBack }) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} hitSlop={12}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <TopBar variant="title" onMenuPress={() => navigate('Menu')} onAvatarPress={() => navigate('Profile')} />
      </View>

      <View style={styles.titleBlock}>
        <Image
          source={{ uri: SETS[0]?.logo || 'https://images.scrydex.com/pokemon/me5-logo/logo' }}
          style={styles.banner}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>{SETS.length} expansions</Text>
      </View>

      <View style={styles.grid}>
        {SETS.map((set) => (
          <TouchableOpacity
            key={set.id}
            style={[styles.card, { width: CARD_W }]}
            onPress={() => navigate('SetDetail', { setId: set.id })}
          >
            <Image
              source={{ uri: set.logo }}
              style={styles.cardImage}
              resizeMode="contain"
            />
            <Text style={styles.cardName}>{set.name}</Text>
            <Text style={styles.cardPercent}>{set.percent}%</Text>
            <View style={{ marginTop: 6 }}>
              <ProgressBar percent={set.percent} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { position: 'relative' },
  back: { position: 'absolute', top: 16, left: 24, color: colors.text, fontSize: 28, fontWeight: '300', zIndex: 2 },
  titleBlock: { paddingHorizontal: 24, marginTop: 16 },
  banner: { width: '100%', height: 140, borderRadius: 12, backgroundColor: colors.card },
  subtitle: { color: colors.textSecondary, fontSize: 13, marginTop: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 24, marginTop: 20, paddingBottom: 40 },
  card: { marginBottom: 24 },
  cardImage: { width: '100%', height: 150, borderRadius: 10, backgroundColor: colors.card },
  cardName: { color: colors.text, fontSize: 14, fontWeight: '500', marginTop: 10 },
  cardPercent: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
});
