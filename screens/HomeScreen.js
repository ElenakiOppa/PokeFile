import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { colors, type } from '../theme';
import ProgressBar from '../components/ProgressBar';
import TopBar from '../components/TopBar';
import { BINDERS, HOME_STACK_CARDS, PROFILE } from '../data';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigate }) {
  const [binderIndex, setBinderIndex] = useState(0);
  const hasBinders = BINDERS.length > 0;
  const binder = hasBinders ? BINDERS[binderIndex] : null;

  const goPrev = () => {
    if (!hasBinders) return;
    setBinderIndex((i) => (i === 0 ? BINDERS.length - 1 : i - 1));
  };

  const goNext = () => {
    if (!hasBinders) return;
    setBinderIndex((i) => (i === BINDERS.length - 1 ? 0 : i + 1));
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <TopBar
        variant="brand"
        onMenuPress={() => navigate('Menu')}
        onAvatarPress={() => navigate('Profile')}
      />
      <View style={styles.brandRow}>
        <Text style={type.brand}>POKÉ HAUS</Text>
        {__DEV__ && (
          <TouchableOpacity onPress={() => navigate('DevMenu')}>
            <Text style={styles.devMenuLink}>All screens →</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.collectionSection}>
        <Text style={type.label}>COLLECTION</Text>
        <TouchableOpacity onPress={() => navigate('CollectionAll')}>
          <Text style={type.hugeNumber}>{PROFILE.stats.cards}</Text>
        </TouchableOpacity>
        <Text style={styles.cardsLabel}>cards</Text>
      </View>

      <View style={styles.cardStack}>
        <Image source={{ uri: HOME_STACK_CARDS.left }} style={[styles.cardImage, styles.cardLeft]} resizeMode="contain" />
        <Image source={{ uri: HOME_STACK_CARDS.right }} style={[styles.cardImage, styles.cardRight]} resizeMode="contain" />
        <Image source={{ uri: HOME_STACK_CARDS.center }} style={[styles.cardImage, styles.cardCenter]} resizeMode="contain" />

        <TouchableOpacity style={styles.viewCollectionButton} onPress={() => navigate('CollectionOverview')}>
          <View style={styles.circleButton}>
            <Text style={styles.arrowText}>→</Text>
          </View>
          <Text style={styles.viewCollectionText}>View collection</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.binderSection}>
        {hasBinders ? (
          <>
            <Text style={type.label}>CURRENT BINDER</Text>

            <View style={styles.binderTitleRow}>
              <Text style={styles.binderTitle}>{binder.label}</Text>
              <TouchableOpacity
                style={styles.circleButtonLarge}
                onPress={() => navigate('BinderDetail', { binderId: binder.id })}
              >
                <Text style={styles.arrowText}>→</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.binderSubtitle}>{binder.subtitle.toUpperCase()}</Text>

            <Text style={styles.percentText}>
              <Text style={styles.percentBold}>{binder.percent}%</Text> complete
            </Text>
            <View style={{ marginTop: 10 }}>
              <ProgressBar percent={binder.percent} />
            </View>

            <View style={styles.paginationRow}>
              <TouchableOpacity onPress={goPrev} hitSlop={10}>
                <Text style={styles.chevron}>‹</Text>
              </TouchableOpacity>

              <View style={styles.dotsRow}>
                {BINDERS.map((b, i) => (
                  <TouchableOpacity key={b.id} onPress={() => setBinderIndex(i)}>
                    <View style={[styles.dot, i === binderIndex ? styles.dotActive : styles.dotInactive]} />
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity onPress={goNext} hitSlop={10}>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.emptyBinderState}>
            <Text style={styles.emptyBinderTitle}>No binders yet</Text>
            <Text style={styles.emptyBinderText}>Start a binder when you are ready to organize sets.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 40, backgroundColor: colors.bg },
  brandRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, marginTop: 20,
  },
  devMenuLink: { color: colors.textTertiary, fontSize: 11, fontWeight: '500' },
  collectionSection: { paddingHorizontal: 24, marginTop: 28 },
  cardsLabel: { color: colors.textSecondary, fontSize: 20, fontWeight: '300', marginTop: -4 },
  cardStack: { height: 400, marginTop: 8, alignItems: 'center' },
  cardImage: { position: 'absolute', width: width * 0.48, height: 320, borderRadius: 12 },
  cardLeft: { left: width * 0.06, top: 36, transform: [{ rotate: '-8deg' }], opacity: 0.9 },
  cardRight: { right: width * 0.02, top: 46, transform: [{ rotate: '8deg' }], opacity: 0.9 },
  cardCenter: { top: 8, width: width * 0.54, height: 360 },
  viewCollectionButton: { position: 'absolute', bottom: 0, left: 24 },
  circleButton: {
    width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: colors.borderStrong,
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  circleButtonLarge: {
    width: 56, height: 56, borderRadius: 28, borderWidth: 1, borderColor: colors.borderStrong,
    justifyContent: 'center', alignItems: 'center',
  },
  arrowText: { color: colors.text, fontSize: 18 },
  viewCollectionText: { color: colors.text, fontSize: 13, fontWeight: '500' },
  binderSection: {
    paddingHorizontal: 24, marginTop: 20, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 24,
  },
  binderTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  binderTitle: { color: colors.text, fontSize: 46, fontWeight: '300', lineHeight: 48, flexShrink: 1 },
  binderSubtitle: { color: colors.purple, fontSize: 13, fontWeight: '600', letterSpacing: 2, marginTop: 8 },
  percentText: { color: colors.textSecondary, fontSize: 15, marginTop: 16 },
  percentBold: { color: colors.text, fontWeight: '700' },
  paginationRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  chevron: { color: colors.textSecondary, fontSize: 20 },
  dotsRow: { flexDirection: 'row' },
  dot: { width: 7, height: 7, borderRadius: 4, marginHorizontal: 4 },
  dotActive: { backgroundColor: colors.purple },
  dotInactive: { backgroundColor: 'rgba(255,255,255,0.25)' },
  emptyBinderState: {
    paddingVertical: 28,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBinderTitle: { color: colors.text, fontSize: 18, fontWeight: '500' },
  emptyBinderText: { color: colors.textSecondary, fontSize: 12, marginTop: 8, textAlign: 'center' },
});
