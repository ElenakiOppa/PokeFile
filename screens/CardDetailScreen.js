import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme';
import TopBar from '../components/TopBar';
import { getCardById, CARD_DETAIL } from '../data';

export default function CardDetailScreen({ navigate, goBack, params = {} }) {
  const cardId = params.cardId || CARD_DETAIL.id;
  const card = getCardById(cardId, CARD_DETAIL);
  const [liked, setLiked] = useState(Boolean(card.collected));
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TopBar variant="back" onBackPress={goBack} avatarUri={null} onAvatarPress={() => navigate('Profile')} />
      </View>

      <View style={styles.actionsRow}>
        <View />
        <TouchableOpacity onPress={() => setMenuOpen((v) => !v)}>
          <Text style={styles.iconText}>⋮</Text>
        </TouchableOpacity>
      </View>

      {menuOpen && (
        <View style={styles.menuCard}>
          {[
            ['View All Variants', () => navigate('Variants', { cardId: card.id })],
            ['Add to Collection', () => navigate('AddToCollection', { cardId: card.id })],
            ['Edit Owned Card', () => navigate('EditOwnedCard', { cardId: card.id })],
            ['Move/Add to Binder', () => navigate('ChooseBinder', { cardId: card.id })],
            ['Zoom Card', () => navigate('CardZoom', { cardId: card.id })],
          ].map(([label, action]) => (
            <TouchableOpacity key={label} style={styles.menuItem} onPress={action}>
              <Text style={styles.menuItemText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.imageWrap}>
        <TouchableOpacity onPress={() => navigate('CardZoom', { cardId: card.id })}>
          <Image
            source={{ uri: card.image }}
            style={styles.image}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.heartBtn} onPress={() => setLiked((v) => !v)}>
          <Text style={[styles.heartIcon, liked && { color: colors.purple }]}>{liked ? '♥' : '♡'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.name}>{card.name}</Text>
        <Text style={styles.number}>#{card.number || card.id}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.rarity}>{card.rarity || 'Ultra Rare'} · {card.number || '003/120'}</Text>
          {card.collected ? (
            <TouchableOpacity onPress={() => navigate('EditOwnedCard', { cardId: card.id })}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>In Collection</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => navigate('AddToCollection', { cardId: card.id })}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Add to Collection</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailCol}>
            <Text style={styles.detailLabel}>SET</Text>
            <Text style={styles.detailValue}>{card.setName || card.setId || 'Set'}</Text>
            <Text style={styles.detailSub}>{card.language || 'English'}</Text>
          </View>
          <View style={styles.detailCol}>
            <Text style={styles.detailLabel}>VALUE</Text>
            <View style={styles.statusRow}>
              <Text style={styles.detailValue}>€{Number(card.value || 0).toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigate('ChooseBinder', { cardId: card.id })}>
            <Text style={styles.actionText}>Choose Binder</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigate('AddToCollection', { cardId: card.id })}>
            <Text style={styles.actionText}>Add to Collection</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingBottom: 4 },
  actionsRow: {
    flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 24, marginTop: 8,
  },
  iconText: { color: colors.text, fontSize: 20 },
  menuCard: {
    position: 'absolute', right: 24, top: 88, backgroundColor: colors.card, width: 220,
    borderRadius: 12, paddingVertical: 8, zIndex: 10, borderWidth: 1, borderColor: colors.border,
  },
  menuItem: { paddingVertical: 10, paddingHorizontal: 14 },
  menuItemText: { color: colors.text, fontSize: 13 },
  imageWrap: { marginTop: 12, paddingHorizontal: 24 },
  image: { width: '100%', height: 420, borderRadius: 14, backgroundColor: colors.card },
  heartBtn: {
    position: 'absolute', top: 12, right: 36, width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
  },
  heartIcon: { color: colors.text, fontSize: 18 },
  infoBlock: { paddingHorizontal: 24, marginTop: 20, paddingBottom: 40 },
  name: { color: colors.text, fontSize: 26, fontWeight: '500' },
  number: { color: colors.textSecondary, fontSize: 14, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, justifyContent: 'space-between' },
  rarity: { color: colors.textSecondary, fontSize: 13 },
  badge: {
    backgroundColor: colors.purpleSoft, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
    borderWidth: 1, borderColor: colors.purple,
  },
  badgeText: { color: colors.purple, fontSize: 11, fontWeight: '600' },
  detailsRow: {
    flexDirection: 'row', marginTop: 24, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 20,
  },
  detailCol: { flex: 1 },
  detailLabel: { color: colors.textTertiary, fontSize: 10, fontWeight: '600', letterSpacing: 1 },
  detailValue: { color: colors.text, fontSize: 15, fontWeight: '500', marginTop: 6 },
  detailSub: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  checkmark: {
    color: colors.purple, fontSize: 12, marginLeft: 8, borderWidth: 1, borderColor: colors.purple,
    width: 18, height: 18, borderRadius: 9, textAlign: 'center', lineHeight: 17,
  },
  actionRow: { flexDirection: 'row', marginTop: 20, gap: 10 },
  actionBtn: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  actionText: { color: colors.text, fontSize: 12, fontWeight: '600' },
});
