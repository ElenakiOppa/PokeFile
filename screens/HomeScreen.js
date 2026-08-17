import React, { useMemo, useState } from 'react';
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
import { CARD_LIBRARY, getSetById } from '../data';
import { getSetRequirements, isOwned } from '../lib/collectibles';
import { calculateVaultPortfolio, formatMoney } from '../lib/valueEngine';
import { useAppContext } from '../AppContext';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigate, binders = [], collectionQuantities = {}, vaultAssets = [], rawAcquisitions = {}, valueSnapshots = [] }) {
  const { userProfile, preferences } = useAppContext();
  const [binderIndex, setBinderIndex] = useState(0);
  const hasBinders = binders.length > 0;
  const safeIndex = hasBinders ? binderIndex % binders.length : 0;
  const binder = hasBinders ? binders[safeIndex] : null;
  const binderSet = binder ? getSetById(binder.setId) : null;
  const binderCards = binder ? (binder.kind === 'freeform' ? (binder.slots || []).map((slot) => slot?.card).filter(Boolean) : getSetRequirements(binderSet, binder.tier)) : [];
  const binderOwned = binderCards.filter((card) => isOwned(collectionQuantities, card)).length;
  const binderPercent = binderCards.length ? Math.round((binderOwned / binderCards.length) * 100) : 0;
  const collectionCount = Object.values(collectionQuantities).reduce((sum, quantity) => sum + Number(quantity || 0), 0);
  const portfolio = useMemo(() => calculateVaultPortfolio({
    ownership: collectionQuantities,
    cards: CARD_LIBRARY,
    assets: vaultAssets,
    rawAcquisitions,
    currency: preferences.currency || 'EUR',
  }), [collectionQuantities, vaultAssets, rawAcquisitions, preferences.currency]);
  const ownedSetCount = new Set(CARD_LIBRARY.filter((card) => Number(collectionQuantities[card.id] || 0) > 0).map((card) => card.setId)).size;
  const previousValue = Number(valueSnapshots[valueSnapshots.length - 2]?.totalValue || 0);
  const changePercent = previousValue > 0 ? ((portfolio.totalValue - previousValue) / previousValue) * 100 : null;
  const showcaseCards = CARD_LIBRARY
    .filter((card) => Number(collectionQuantities[card.id] || 0) > 0)
    .sort((a, b) => Number(b.value || 0) - Number(a.value || 0))
    .slice(0, 3);

  const goPrev = () => {
    if (!hasBinders) return;
    setBinderIndex((i) => (i === 0 ? binders.length - 1 : i - 1));
  };

  const goNext = () => {
    if (!hasBinders) return;
    setBinderIndex((i) => (i === binders.length - 1 ? 0 : i + 1));
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <TopBar
        variant="brand"
        onMenuPress={() => navigate('Menu')}
        onAvatarPress={() => navigate('Profile')}
      />
      <View style={styles.portfolioHeader}>
        <Text style={styles.overline}>PORTFOLIO OVERVIEW</Text>
        <Text style={styles.greeting}>{userProfile?.displayName || 'Your collection'}</Text>
        <Text style={styles.netLabel}>NET WORTH</Text>
        <View style={styles.netRow}>
          <Text style={styles.netValue}>{formatMoney(portfolio.totalValue, portfolio.currency)}</Text>
          {changePercent != null ? <Text style={[styles.change, changePercent < 0 && styles.changeDown]}>{changePercent >= 0 ? '+' : ''}{changePercent.toFixed(1)}%</Text> : null}
        </View>
        <PortfolioSparkline snapshots={valueSnapshots} currentValue={portfolio.totalValue} />
        <View style={styles.metrics}>
          <Metric label="CARDS" value={String(collectionCount)} />
          <Metric label="SETS" value={String(ownedSetCount)} />
          <Metric label="MARKET VALUE" value={formatMoney(portfolio.totalValue, portfolio.currency)} />
        </View>
      </View>

      <View style={styles.highlightsHeader}>
        <Text style={styles.sectionTitle}>Collection Highlights</Text>
        <TouchableOpacity onPress={() => navigate('CollectionAll')}><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.highlights}>
        {showcaseCards.map((card) => (
          <TouchableOpacity key={card.id} style={styles.highlightCard} onPress={() => navigate('CardDetail', { cardId: card.id })}>
            <Image source={{ uri: card.image }} style={styles.highlightImage} resizeMode="contain" />
            <Text style={styles.highlightName} numberOfLines={1}>{card.name}</Text>
            <Text style={styles.highlightMeta} numberOfLines={1}>{card.setName} · #{card.number}</Text>
            <Text style={styles.highlightValue}>{formatMoney(card.value, portfolio.currency)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.binderSection}>
        {hasBinders ? (
          <>
            <Text style={type.label}>CURRENT BINDER</Text>

            <View style={styles.binderTitleRow}>
              <Text style={styles.binderTitle}>{binder.name}</Text>
              <TouchableOpacity
                style={styles.circleButtonLarge}
                onPress={() => navigate('BinderDetail', { binderId: binder.id })}
              >
                <Text style={styles.arrowText}>→</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.binderSubtitle}>{binder.tier.toUpperCase()} · {binderOwned}/{binderCards.length}</Text>

            <Text style={styles.percentText}>
              <Text style={styles.percentBold}>{binderPercent}%</Text> complete
            </Text>
            <View style={{ marginTop: 10 }}>
              <ProgressBar percent={binderPercent} />
            </View>

            <View style={styles.paginationRow}>
              <TouchableOpacity onPress={goPrev} hitSlop={10}>
                <Text style={styles.chevron}>‹</Text>
              </TouchableOpacity>

              <View style={styles.dotsRow}>
                {binders.map((b, i) => (
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

const Metric = ({ label, value }) => (
  <View style={styles.metricCard}>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricValue} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
  </View>
);

const PortfolioSparkline = ({ snapshots = [], currentValue = 0 }) => {
  const values = snapshots.slice(-7).map((item) => Number(item.totalValue || 0));
  if (!values.length || values[values.length - 1] !== Number(currentValue || 0)) values.push(Number(currentValue || 0));
  while (values.length < 7) values.unshift(values[0] || 0);
  const points = values.slice(-7);
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const chartWidth = width - 48;
  const step = chartWidth / (points.length - 1);
  return (
    <View style={styles.sparkline}>
      {points.slice(0, -1).map((value, index) => {
        const y1 = 42 - ((value - min) / range) * 34;
        const y2 = 42 - ((points[index + 1] - min) / range) * 34;
        const dx = step;
        const dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = `${Math.atan2(dy, dx)}rad`;
        return <View key={index} style={[styles.sparkSegment, { width: length, left: index * step, top: y1, transform: [{ rotate: angle }] }]} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: { paddingBottom: 40, backgroundColor: colors.bg },
  portfolioHeader: { paddingHorizontal: 24, marginTop: 18 },
  overline: { color: colors.textTertiary, fontSize: 8, letterSpacing: 1.4, fontWeight: '600' },
  greeting: { color: colors.text, fontSize: 21, fontWeight: '700', marginTop: 6 },
  netLabel: { color: colors.textTertiary, fontSize: 8, letterSpacing: 1.3, marginTop: 27 },
  netRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 7 },
  netValue: { color: colors.text, fontSize: 38, lineHeight: 43, fontWeight: '700', flexShrink: 1 },
  change: { color: '#35C98B', fontSize: 11, fontWeight: '700', marginLeft: 10, marginBottom: 7 },
  changeDown: { color: colors.red },
  sparkline: { height: 52, width: '100%', position: 'relative', marginTop: 14 },
  sparkSegment: { position: 'absolute', height: 2, borderRadius: 1, backgroundColor: '#C9A227' },
  metrics: { flexDirection: 'row', gap: 9, marginTop: 8 },
  metricCard: { flex: 1, minWidth: 0, height: 74, borderRadius: 13, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 13, justifyContent: 'space-between' },
  metricLabel: { color: colors.textTertiary, fontSize: 7, letterSpacing: 0.9 },
  metricValue: { color: colors.text, fontSize: 18, fontWeight: '700' },
  highlightsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginTop: 28 },
  sectionTitle: { color: colors.text, fontSize: 17, fontWeight: '700' },
  viewAll: { color: '#C9A227', fontSize: 10, fontWeight: '600' },
  highlights: { paddingHorizontal: 24, paddingTop: 13, gap: 11 },
  highlightCard: { width: width * 0.43, padding: 10, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  highlightImage: { width: '100%', height: 190, borderRadius: 10, backgroundColor: colors.card },
  highlightName: { color: colors.text, fontSize: 12, fontWeight: '700', marginTop: 9 },
  highlightMeta: { color: colors.textTertiary, fontSize: 8, marginTop: 3 },
  highlightValue: { color: '#C9A227', fontSize: 11, fontWeight: '700', marginTop: 7 },
  brandRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, marginTop: 20,
  },
  homeLogo: { alignSelf: 'flex-start' },
  devMenuLink: { color: colors.textTertiary, fontSize: 11, fontWeight: '500' },
  collectionSection: { paddingHorizontal: 24, marginTop: 28 },
  cardsLabel: { color: colors.textSecondary, fontSize: 20, fontWeight: '300', marginTop: -4 },
  cardStack: { height: 400, marginTop: 8, alignItems: 'center' },
  cardImage: { position: 'absolute', width: width * 0.48, height: 320, borderRadius: 12 },
  stackImage: { width: '100%', height: '100%', borderRadius: 12 },
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
