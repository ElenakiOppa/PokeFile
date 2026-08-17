import React, { useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { CARD_LIBRARY } from '../data';
import { calculateVaultPortfolio, formatMoney } from '../lib/valueEngine';
import { useAppContext } from '../AppContext';

const { width } = Dimensions.get('window');
const ACQUISITION_WIDTH = Math.min(154, width * 0.39);

export default function HomeScreen({ navigate, binders = [], collectionQuantities = {}, vaultAssets = [], rawAcquisitions = {}, valueSnapshots = [] }) {
  const { preferences } = useAppContext();
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
        <Text style={styles.summaryMeta}>Updated now · Secured Private Vault</Text>
        <View style={styles.statRow}>
          <SummaryStat label="GRADED CARDS" value={String(gradedAssets.length)} />
          <SummaryStat label="MASTER SETS" value={String(masterSets)} />
          <SummaryStat label="AVG. GRADE" value={averageGrade ? averageGrade.toFixed(1) : '—'} />
        </View>
      </View>

      <SectionHeader title="RECENT ACQUISITIONS" action="View All" onPress={() => navigate('CollectionAll')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.acquisitionRow}>
        {acquisitions.map((card) => (
          <TouchableOpacity key={card.id} style={styles.acquisitionCard} onPress={() => navigate('CardDetail', { cardId: card.id })}>
            <View style={styles.acquisitionImageWell}><Image source={{ uri: card.image }} style={styles.acquisitionImage} resizeMode="contain" /></View>
            <Text style={styles.acquisitionName} numberOfLines={1}>{card.name}</Text>
            <Text style={styles.acquisitionMeta} numberOfLines={1}>{card.rarity || card.variant || card.finish || 'Pokémon card'}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <SectionHeader title="TRENDING INDEX GAINERS" />
      <View style={styles.gainerList}>
        {gainers.map((card, index) => (
          <TouchableOpacity key={card.id} style={styles.gainerRow} onPress={() => navigate('CardDetail', { cardId: card.id })}>
            <View style={styles.goldDot} />
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
  content: { paddingBottom: 24 },
  header: { height: 58, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border },
  headerButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  headerCopy: { flex: 1, marginHorizontal: 10 },
  headerEyebrow: { color: colors.purple, fontSize: 8, lineHeight: 10, fontWeight: '700' },
  headerTitle: { color: colors.text, fontSize: 15, lineHeight: 19, fontWeight: '700' },
  summaryCard: { marginHorizontal: 14, marginTop: 12, borderRadius: 18, borderWidth: 1, borderColor: colors.purple, backgroundColor: colors.surface, padding: 17 },
  summaryTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { color: colors.textSecondary, fontSize: 8, fontWeight: '600' },
  changePill: { backgroundColor: 'rgba(25,190,111,0.14)', borderRadius: 10, paddingHorizontal: 7, paddingVertical: 4 },
  changeText: { color: '#20C77A', fontSize: 8, fontWeight: '700' },
  changeNegative: { color: colors.red },
  summaryValue: { color: colors.text, fontSize: 29, lineHeight: 36, fontWeight: '700', marginTop: 14 },
  summaryMeta: { color: colors.textTertiary, fontSize: 8, marginTop: 3 },
  statRow: { flexDirection: 'row', marginTop: 18 },
  summaryStat: { flex: 1 },
  summaryStatLabel: { color: colors.textTertiary, fontSize: 7, fontWeight: '600' },
  summaryStatValue: { color: colors.purple, fontSize: 14, fontWeight: '800', marginTop: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, marginTop: 15, marginBottom: 8 },
  sectionTitle: { color: colors.textSecondary, fontSize: 9, fontWeight: '600' },
  sectionAction: { color: colors.purple, fontSize: 8, fontWeight: '700' },
  acquisitionRow: { paddingHorizontal: 14, gap: 10 },
  acquisitionCard: { width: ACQUISITION_WIDTH, minHeight: 182, borderRadius: 13, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 9 },
  acquisitionImageWell: { width: '100%', height: 123, borderRadius: 9, backgroundColor: '#D9D9D9', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  acquisitionImage: { width: '88%', height: '94%' },
  acquisitionName: { color: colors.text, fontSize: 11, fontWeight: '700', marginTop: 8 },
  acquisitionMeta: { color: colors.purple, fontSize: 7, fontWeight: '600', marginTop: 2 },
  gainerList: { paddingHorizontal: 14, gap: 7 },
  gainerRow: { minHeight: 54, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center' },
  goldDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.purple, marginRight: 10 },
  gainerCopy: { flex: 1, minWidth: 0 },
  gainerName: { color: colors.text, fontSize: 10, fontWeight: '700' },
  gainerMeta: { color: colors.textTertiary, fontSize: 7, marginTop: 3 },
  gainerValueWrap: { alignItems: 'flex-end', marginLeft: 8 },
  gainerValue: { color: colors.text, fontSize: 10, fontWeight: '800' },
  gainerChange: { color: '#20C77A', fontSize: 6, fontWeight: '700', marginTop: 3 },
});
