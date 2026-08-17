import React, { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { CARD_LIBRARY } from '../data';

export default function TradesScreen({ navigate, collectionQuantities = {}, wishlistItems = [] }) {
  const [tab, setTab] = useState('Available');
  const duplicates = useMemo(() => CARD_LIBRARY.filter((card) => Number(collectionQuantities[card.id] || 0) > 1), [collectionQuantities]);
  const items = tab === 'Available' ? duplicates : wishlistItems;
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}><Text style={styles.eyebrow}>TRADE DESK</Text><Text style={styles.title}>Trades</Text><Text style={styles.subtitle}>Match duplicates with cards you want.</Text></View>
      <View style={styles.overview}>
        <View><Text style={styles.overviewValue}>{duplicates.length}</Text><Text style={styles.overviewLabel}>Tradeable cards</Text></View>
        <View style={styles.overviewDivider} />
        <View><Text style={styles.overviewValue}>{wishlistItems.length}</Text><Text style={styles.overviewLabel}>Wanted cards</Text></View>
        <View style={styles.overviewIcon}><Ionicons name="swap-horizontal" size={25} color={colors.purple} /></View>
      </View>
      <View style={styles.tabs}>
        {['Available', 'Wanted'].map((item) => <TouchableOpacity key={item} style={[styles.tab, tab === item && styles.tabActive]} onPress={() => setTab(item)}><Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item}</Text></TouchableOpacity>)}
      </View>
      <View style={styles.list}>
        {items.length ? items.map((item) => {
          const card = item.card || CARD_LIBRARY.find((entry) => entry.id === item.id) || item;
          return <TouchableOpacity key={item.collectibleKey || item.id} style={styles.row} onPress={() => navigate('CardDetail', { cardId: card.id })} activeOpacity={0.75}>
            <Image source={{ uri: card.image }} style={styles.image} resizeMode="contain" />
            <View style={styles.copy}><Text style={styles.name} numberOfLines={1}>{card.name}</Text><Text style={styles.meta} numberOfLines={2}>{card.setName || card.setId} · #{card.number}</Text><Text style={styles.variant}>{card.variant || card.finish || 'Standard printing'}</Text></View>
            <View style={styles.right}><View style={styles.badge}><Text style={styles.badgeText}>{tab === 'Available' ? `×${Math.max(1, Number(collectionQuantities[card.id] || 0) - 1)}` : 'WANT'}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.textTertiary} /></View>
          </TouchableOpacity>;
        }) : <View style={styles.empty}><Text style={styles.emptyTitle}>{tab === 'Available' ? 'No duplicates available' : 'No wanted cards yet'}</Text><Text style={styles.emptyText}>{tab === 'Available' ? 'Cards with more than one owned copy appear here automatically.' : 'Wishlist cards appear here automatically.'}</Text></View>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg }, content: { paddingBottom: 36 },
  header: { paddingHorizontal: 20, paddingTop: 22 }, eyebrow: { color: colors.purple, fontSize: 10, fontWeight: '800', letterSpacing: 1.8 }, title: { color: colors.text, fontSize: 34, fontWeight: '800', marginTop: 6 }, subtitle: { color: colors.textSecondary, fontSize: 13, marginTop: 7 },
  overview: { minHeight: 112, marginHorizontal: 20, marginTop: 22, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 18 }, overviewValue: { color: colors.text, fontSize: 26, fontWeight: '800' }, overviewLabel: { color: colors.textSecondary, fontSize: 10, marginTop: 5 }, overviewDivider: { width: 1, height: 52, backgroundColor: colors.border }, overviewIcon: { marginLeft: 'auto', width: 50, height: 50, borderRadius: 16, backgroundColor: colors.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  tabs: { flexDirection: 'row', marginHorizontal: 20, marginTop: 18, backgroundColor: colors.surface, borderRadius: 15, borderWidth: 1, borderColor: colors.border, padding: 4 }, tab: { flex: 1, height: 44, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }, tabActive: { backgroundColor: colors.purple }, tabText: { color: colors.textSecondary, fontSize: 12, fontWeight: '700' }, tabTextActive: { color: colors.bg },
  list: { paddingHorizontal: 20, marginTop: 16, gap: 12 }, row: { minHeight: 112, borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 12, flexDirection: 'row', alignItems: 'center' }, image: { width: 66, height: 88, borderRadius: 9, backgroundColor: colors.card }, copy: { flex: 1, marginLeft: 14 }, name: { color: colors.text, fontSize: 15, fontWeight: '800' }, meta: { color: colors.textSecondary, fontSize: 10, lineHeight: 14, marginTop: 5 }, variant: { color: colors.purple, fontSize: 9, fontWeight: '700', marginTop: 7 }, right: { height: 74, alignItems: 'flex-end', justifyContent: 'space-between' }, badge: { borderRadius: 12, backgroundColor: colors.purpleSoft, paddingHorizontal: 10, paddingVertical: 7 }, badgeText: { color: colors.purple, fontSize: 9, fontWeight: '800' },
  empty: { borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 34, alignItems: 'center' }, emptyTitle: { color: colors.text, fontSize: 17, fontWeight: '800' }, emptyText: { color: colors.textSecondary, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 8 },
});
