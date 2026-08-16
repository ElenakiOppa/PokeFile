
import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme';
import { getCardById, CARD_DETAIL } from '../data';

export default function WishlistDetailScreen({ goBack, navigate, params = {} }) {
  const [priority, setPriority] = useState('Medium');
  const card = getCardById(params.cardId || params.wishlistId || CARD_DETAIL.id, CARD_DETAIL);
  const [targetPrice] = useState(String(Number(card.value || 0).toFixed(2)));
  const [notes, setNotes] = useState('');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} hitSlop={12}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigate('CardDetail', { cardId: card.id })}>
        <Image
          source={{ uri: card.image }}
          style={styles.image}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <View style={styles.titleRow}>
        <View>
          <Text style={styles.name}>{card.name}</Text>
          <Text style={styles.sub}>#{card.number || card.id} · {card.setName || card.setId || 'Unknown set'}</Text>
        </View>
        <View style={styles.wantedBadge}>
          <Text style={styles.wantedText}>WANTED</Text>
        </View>
      </View>

      <Text style={styles.label}>TARGET PRICE</Text>
      <View style={styles.priceRow}>
        <Text style={styles.priceValue}>€{targetPrice}</Text>
        <TouchableOpacity>
          <Text style={styles.editLink}>Edit</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>PRIORITY</Text>
      <View style={styles.priorityRow}>
        {['Low', 'Medium', 'High'].map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.priorityChip, priority === p && styles.priorityChipActive]}
            onPress={() => setPriority(p)}
          >
            <Text style={[styles.priorityText, priority === p && styles.priorityTextActive]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>NOTES</Text>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="Optional notes..."
        placeholderTextColor={colors.textTertiary}
        style={styles.notesInput}
        multiline
      />

      <TouchableOpacity style={styles.removeBtn} onPress={goBack}>
        <Text style={styles.removeBtnText}>Remove from Wishlist</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  header: { paddingTop: 16 },
  back: { color: colors.text, fontSize: 28, fontWeight: '300' },
  image: { width: '100%', height: 200, borderRadius: 14, marginTop: 12, backgroundColor: colors.card },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 16 },
  name: { color: colors.text, fontSize: 22, fontWeight: '500' },
  sub: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
  wantedBadge: { backgroundColor: colors.purpleSoft, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: colors.purple },
  wantedText: { color: colors.purple, fontSize: 10, fontWeight: '700' },
  label: { color: colors.textTertiary, fontSize: 11, fontWeight: '600', letterSpacing: 1.5, marginTop: 26 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  priceValue: { color: colors.text, fontSize: 22, fontWeight: '300' },
  editLink: { color: colors.purple, fontSize: 13, fontWeight: '600' },
  priorityRow: { flexDirection: 'row', marginTop: 10 },
  priorityChip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 18, borderWidth: 1, borderColor: colors.border, marginRight: 8 },
  priorityChipActive: { backgroundColor: colors.purple, borderColor: colors.purple },
  priorityText: { color: colors.textSecondary, fontSize: 13 },
  priorityTextActive: { color: colors.text, fontWeight: '600' },
  notesInput: {
    backgroundColor: colors.card, borderRadius: 10, padding: 14, marginTop: 8,
    color: colors.text, fontSize: 14, minHeight: 70, textAlignVertical: 'top',
  },
  removeBtn: { borderRadius: 24, paddingVertical: 15, alignItems: 'center', marginTop: 32, marginBottom: 40, borderWidth: 1, borderColor: '#e74c3c' },
  removeBtnText: { color: '#e74c3c', fontSize: 14, fontWeight: '600' },
});
