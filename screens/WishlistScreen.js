import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors, type } from '../theme';
import TopBar from '../components/TopBar';
import { WISHLIST } from '../data';

export default function WishlistScreen({ navigate }) {
  const [items, setItems] = useState(WISHLIST);

  const toggleFavorite = (id) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, favorited: !it.favorited } : it)));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TopBar variant="title" onMenuPress={() => navigate('Menu')} onAvatarPress={() => navigate('Profile')} />

      <View style={styles.titleRow}>
        <View>
          <Text style={type.label}>WISHLIST</Text>
          <Text style={type.hugeNumber}>{String(items.length).padStart(2, '0')}</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigate('Search')}>
          <Text style={styles.addPlus}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.row}
            onPress={() => navigate('WishlistDetail', { wishlistId: item.id, cardId: item.id })}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.thumb}
              resizeMode="contain"
            />
            <View style={styles.rowInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemNumber}>{item.number}</Text>
              <Text style={styles.itemSet}>{item.set}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleFavorite(item.id)} hitSlop={10}>
              <Text style={[styles.heart, item.favorited && { color: colors.purple }]}>
                {item.favorited ? '♥' : '♡'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity hitSlop={10} style={{ marginLeft: 14 }}>
              <Text style={styles.dots}>⋮</Text>
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
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 24, marginTop: 20,
  },
  addBtn: {
    width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.borderStrong,
    justifyContent: 'center', alignItems: 'center', marginTop: 6,
  },
  addPlus: { color: colors.text, fontSize: 22, fontWeight: '300' },
  list: { paddingHorizontal: 24, marginTop: 28, paddingBottom: 40 },
  row: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  thumb: { width: 52, height: 52, borderRadius: 8, backgroundColor: colors.card },
  rowInfo: { flex: 1, marginLeft: 14 },
  itemName: { color: colors.text, fontSize: 15, fontWeight: '500' },
  itemNumber: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  itemSet: { color: colors.textTertiary, fontSize: 11, marginTop: 1 },
  heart: { color: colors.text, fontSize: 20 },
  dots: { color: colors.textSecondary, fontSize: 18 },
});
