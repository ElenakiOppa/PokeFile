import React, { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme';
import { CARD_LIBRARY } from '../data';

export default function TradesScreen({ navigate, collectionQuantities = {}, wishlistItems = [] }) {
  const [tab, setTab] = useState('Available');
  const duplicates = useMemo(() => CARD_LIBRARY.filter((card) => Number(collectionQuantities[card.id] || 0) > 1), [collectionQuantities]);
  const items = tab === 'Available' ? duplicates : wishlistItems;
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}><Text style={styles.eyebrow}>TRADE DESK</Text><Text style={styles.title}>Trades</Text><Text style={styles.subtitle}>Match duplicates with cards you want.</Text></View>
      <View style={styles.tabs}>
        {['Available', 'Wanted'].map((item) => <TouchableOpacity key={item} style={[styles.tab, tab === item && styles.tabActive]} onPress={() => setTab(item)}><Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item}</Text></TouchableOpacity>)}
      </View>
      <View style={styles.list}>
        {items.length ? items.map((item) => {
          const card = item.card || CARD_LIBRARY.find((entry) => entry.id === item.id) || item;
          return <TouchableOpacity key={item.collectibleKey || item.id} style={styles.row} onPress={() => navigate('CardDetail', { cardId: card.id })}>
            <Image source={{ uri: card.image }} style={styles.image} resizeMode="contain" />
            <View style={styles.copy}><Text style={styles.name} numberOfLines={1}>{card.name}</Text><Text style={styles.meta} numberOfLines={1}>{card.setName || card.setId} · #{card.number}</Text></View>
            <View style={styles.badge}><Text style={styles.badgeText}>{tab === 'Available' ? `×${Math.max(1, Number(collectionQuantities[card.id] || 0) - 1)}` : 'WANT'}</Text></View>
          </TouchableOpacity>;
        }) : <View style={styles.empty}><Text style={styles.emptyTitle}>{tab === 'Available' ? 'No duplicates available' : 'No wanted cards yet'}</Text><Text style={styles.emptyText}>{tab === 'Available' ? 'Cards with more than one owned copy appear here automatically.' : 'Wishlist cards appear here automatically.'}</Text></View>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg }, content: { paddingBottom: 24 },
  header: { paddingHorizontal: 16, paddingTop: 20 }, eyebrow: { color: colors.purple, fontSize: 8, fontWeight: '700' }, title: { color: colors.text, fontSize: 24, fontWeight: '800', marginTop: 3 }, subtitle: { color: colors.textSecondary, fontSize: 9, marginTop: 4 },
  tabs: { flexDirection: 'row', marginHorizontal: 16, marginTop: 16, backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 3 }, tab: { flex: 1, height: 34, borderRadius: 9, alignItems: 'center', justifyContent: 'center' }, tabActive: { backgroundColor: colors.purple }, tabText: { color: colors.textSecondary, fontSize: 9, fontWeight: '700' }, tabTextActive: { color: colors.bg },
  list: { paddingHorizontal: 16, marginTop: 12, gap: 8 }, row: { minHeight: 66, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 8, flexDirection: 'row', alignItems: 'center' }, image: { width: 46, height: 52, borderRadius: 7, backgroundColor: colors.card }, copy: { flex: 1, marginLeft: 10 }, name: { color: colors.text, fontSize: 11, fontWeight: '700' }, meta: { color: colors.textTertiary, fontSize: 7, marginTop: 4 }, badge: { borderRadius: 10, backgroundColor: colors.purpleSoft, paddingHorizontal: 8, paddingVertical: 5 }, badgeText: { color: colors.purple, fontSize: 7, fontWeight: '800' },
  empty: { borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 24, alignItems: 'center' }, emptyTitle: { color: colors.text, fontSize: 14, fontWeight: '700' }, emptyText: { color: colors.textSecondary, fontSize: 9, textAlign: 'center', marginTop: 6 },
});
