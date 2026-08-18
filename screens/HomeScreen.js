import React, { useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { CARD_LIBRARY } from '../data';
import { calculateVaultPortfolio, formatMoney } from '../lib/valueEngine';
import { useAppContext } from '../AppContext';

const { width } = Dimensions.get('window');
const ACQUISITION_WIDTH = Math.min(174, width * 0.43);

export default function HomeScreen({ navigate, binders = [], collectionQuantities = {}, vaultAssets = [], rawAcquisitions = {}, valueSnapshots = [] }) {
  console.log('🔥🔥🔥 HOME SCREEN DEBUG CODE IS RUNNING 🔥🔥🔥');
  const { preferences } = useAppContext();
  const debugCardLibraryDuplicates = useMemo(() => {
  const byId = new Map();

  for (const card of CARD_LIBRARY) {
    const id = String(card?.id || '');

    if (!byId.has(id)) {
      byId.set(id, []);
    }

    byId.get(id).push(card);
  }

  return [...byId.entries()]
    .filter(([id, cards]) => id && cards.length > 1)
    .map(([id, cards]) => ({
      id,
      count: cards.length,
      cards: cards.map((card) => ({
        id: card.id,
        collectibleKey: card.collectibleKey,
        setId: card.setId,
        setName: card.setName,
        number: card.number,
        name: card.name,
        variant: card.variant,
        variantKey: card.variantKey,
        finish: card.finish,
        image: card.image,
        value: card.value,
        source: card.source,
        sourceCardId: card.sourceCardId,
        sourceVariantId: card.sourceVariantId,
      })),
    }));
}, []);

console.log('🔥 CARD_LIBRARY SIZE', CARD_LIBRARY.length);
console.log(
  '🔥 CARD_LIBRARY DUPLICATE IDS COUNT',
  debugCardLibraryDuplicates.length
);

console.log(
  '🔥 TARGET DUPLICATES',
  debugCardLibraryDuplicates.filter((entry) =>
    ['me5-28:normal', 'me5-35:normal'].includes(entry.id)
  )
);
console.log(
  '🔥 FIRST 10 DUPLICATE IDS',
  debugCardLibraryDuplicates.slice(0, 10).map((entry) => ({
    id: entry.id,
    count: entry.count,
  }))
);
  const currency = preferences.currency || 'EUR';
  const portfolio = useMemo(() => calculateVaultPortfolio({ ownership: collectionQuantities, cards: CARD_LIBRARY, assets: vaultAssets, rawAcquisitions, currency }), [collectionQuantities, vaultAssets, rawAcquisitions, currency]);
  const ownedCards = useMemo(() => CARD_LIBRARY.filter((card) => Number(collectionQuantities[card.id] || 0) > 0).sort((a, b) => Number(b.value || 0) - Number(a.value || 0)), [collectionQuantities]);
  const acquisitions = ownedCards.slice(0, 3);
  const gainers = ownedCards.length > 3 ? ownedCards.slice(3, 6) : ownedCards.slice(0, 3);
  const gradedAssets = vaultAssets.filter((asset) => asset.type === 'graded');
  const averageGrade = gradedAssets.length ? gradedAssets.reduce((sum, asset) => sum + Number(asset.grade || 0), 0) / gradedAssets.length : 0;
  const masterSets = binders.filter((binder) => ['master', 'grandmaster'].includes(String(binder.tier || '').toLowerCase())).length;
  const previousValue = Number(valueSnapshots[valueSnapshots.length - 2]?.totalValue || 0);
  const changePercent = previousValue > 0 ? ((portfolio.totalValue - previousValue) / previousValue) * 100 : null;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigate('Menu')} accessibilityLabel="Open menu"><Ionicons name="menu" size={18} color={colors.text} /></TouchableOpacity>
        <View style={styles.headerCopy}><Text style={styles.headerEyebrow}>INDEX OVERVIEW</Text><Text style={styles.headerTitle}>Elite Registry</Text></View>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigate('Search')} accessibilityLabel="Search"><Ionicons name="search" size={17} color={colors.text} /></TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryTopRow}>
          <Text style={styles.summaryLabel}>ESTIMATED PORTFOLIO VALUE</Text>
          {changePercent != null ? <View style={styles.changePill}><Text style={[styles.changeText, changePercent < 0 && styles.changeNegative]}>{changePercent >= 0 ? '+' : ''}{changePercent.toFixed(1)}%</Text></View> : null}
        </View>
        <Text style={styles.summaryValue}>{formatMoney(portfolio.totalValue, currency)}</Text>
        <Text style={styles.summaryMeta}>Updated now • Secured Private Vault</Text>
        <View style={styles.statRow}>
          <SummaryStat label="GRADED CARDS" value={String(gradedAssets.length)} />
          <SummaryStat label="MASTER SETS" value={String(masterSets)} />
          <SummaryStat label="AVG. GRADE" value={averageGrade ? `PSA ${averageGrade.toFixed(1)}` : '—'} />
        </View>
      </View>

      <SectionHeader title="RECENT ACQUISITIONS" action="View All" onPress={() => navigate('CollectionAll')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.acquisitionRow}>
        {acquisitions.map((card) => (
          <TouchableOpacity key={card.id} style={styles.acquisitionCard} onPress={() => navigate('CardDetail', { cardId: card.id })}>
            <Image source={{ uri: card.image }} style={styles.acquisitionImage} resizeMode="contain" />
            <Text style={styles.acquisitionName} numberOfLines={1}>{card.name}</Text>
            <Text style={styles.acquisitionMeta} numberOfLines={1}>{card.setName || card.setId}{card.number ? ` #${card.number}` : ''}</Text>
            <Text style={styles.acquisitionValue} numberOfLines={1}>{card.rarity || card.variant || card.finish || 'Indexed'} · {formatMoney(Number(card.value || 0), currency)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <SectionHeader title="TRENDING INDEX GAINERS" />
      <View style={styles.gainerList}>
        {gainers.map((card, index) => (
          <TouchableOpacity key={card.id} style={styles.gainerRow} onPress={() => navigate('CardDetail', { cardId: card.id })}>
            <Image source={{ uri: card.image }} style={styles.gainerImage} resizeMode="contain" />
            <View style={styles.gainerCopy}><Text style={styles.gainerName} numberOfLines={1}>{card.name}{card.number ? ` #${card.number}` : ''}</Text><Text style={styles.gainerMeta} numberOfLines={1}>{card.setName || card.setId || 'Pokéfile Index'}</Text></View>
            <View style={styles.gainerValueWrap}><Text style={styles.gainerValue}>{formatMoney(Number(card.value || 0), currency)}</Text><Text style={styles.gainerChange}>{index === 0 ? 'INDEX LEADER' : 'MARKET TRACKED'}</Text></View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const SummaryStat = ({ label, value }) => <View style={styles.summaryStat}><Text style={styles.summaryStatLabel}>{label}</Text><Text style={styles.summaryStatValue}>{value}</Text></View>;
const SectionHeader = ({ title, action, onPress }) => <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{title}</Text>{action ? <TouchableOpacity onPress={onPress}><Text style={styles.sectionAction}>{action}</Text></TouchableOpacity> : null}</View>;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 12 },
  header: { height: 63, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  headerButton: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  headerCopy: { flex: 1, marginHorizontal: 12 },
  headerEyebrow: { color: colors.purple, fontSize: 11, lineHeight: 14, fontWeight: '600' },
  headerTitle: { color: colors.text, fontSize: 18, lineHeight: 23, fontWeight: '700', marginTop: 2 },
  summaryCard: { marginHorizontal: 16, marginTop: 16, borderRadius: 20, borderWidth: 1, borderColor: colors.purple, backgroundColor: colors.surface, padding: 20 },
  summaryTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  changePill: { backgroundColor: colors.purpleSoft, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  changeText: { color: colors.purple, fontSize: 11, fontWeight: '600' },
  changeNegative: { color: colors.red },
  summaryValue: { color: colors.text, fontSize: 32, lineHeight: 42, fontWeight: '700', marginTop: 16 },
  summaryMeta: { color: colors.textTertiary, fontSize: 12, marginTop: 4 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, paddingTop: 8 },
  summaryStat: { flex: 1 },
  summaryStatLabel: { color: colors.textSecondary, fontSize: 11, fontWeight: '400' },
  summaryStatValue: { color: colors.purple, fontSize: 16, fontWeight: '700', marginTop: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 12, marginBottom: 12 },
  sectionTitle: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
  sectionAction: { color: colors.purple, fontSize: 12, fontWeight: '600' },
  acquisitionRow: { paddingHorizontal: 16, gap: 12 },
  acquisitionCard: { width: ACQUISITION_WIDTH, minHeight: 284, alignItems: 'center' },
  acquisitionImage: { width: '100%', height: 232, borderRadius: 8 },
  acquisitionName: { color: colors.text, fontSize: 12, fontWeight: '700', marginTop: 6, maxWidth: '100%' },
  acquisitionMeta: { color: colors.textTertiary, fontSize: 10, marginTop: 2 },
  acquisitionValue: { color: colors.purple, fontSize: 10, fontWeight: '600', marginTop: 2 },
  gainerList: { paddingHorizontal: 16, gap: 8 },
  gainerRow: { minHeight: 57, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center' },
  gainerImage: { width: 25, height: 35, marginRight: 10 },
  gainerCopy: { flex: 1, minWidth: 0 },
  gainerName: { color: colors.text, fontSize: 13, fontWeight: '600' },
  gainerMeta: { color: colors.textTertiary, fontSize: 11, marginTop: 2 },
  gainerValueWrap: { alignItems: 'flex-end', marginLeft: 8 },
  gainerValue: { color: colors.text, fontSize: 13, fontWeight: '700' },
  gainerChange: { color: colors.purple, fontSize: 8, fontWeight: '600', marginTop: 2 },
});
