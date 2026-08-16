
import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme';
import { CARD_DETAIL } from '../data';

export default function EditOwnedCardScreen({ goBack }) {
  const card = CARD_DETAIL;
  const [qty, setQty] = useState(1);
  const [condition] = useState('Near Mint');
  const [price, setPrice] = useState('12.00');
  const [notes, setNotes] = useState('');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} hitSlop={12}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardRow}>
        <Image
          source={{ uri: card.image }}
          style={styles.thumb}
          resizeMode="contain"
        />
        <View style={{ marginLeft: 16 }}>
          <Text style={styles.name}>{card.name}</Text>
          <Text style={styles.number}>#{card.id}</Text>
          <Text style={styles.rarity}>{card.rarity}</Text>
        </View>
      </View>

      <Text style={styles.label}>QUANTITY</Text>
      <View style={styles.qtyRow}>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty((q) => Math.max(1, q - 1))}>
          <Text style={styles.qtyBtnText}>–</Text>
        </TouchableOpacity>
        <Text style={styles.qtyValue}>{qty}</Text>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty((q) => q + 1)}>
          <Text style={styles.qtyBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>CONDITION</Text>
      <TouchableOpacity style={styles.pickerRow}>
        <Text style={styles.pickerValue}>{condition}</Text>
        <Text style={styles.pickerChevron}>⌄</Text>
      </TouchableOpacity>

      <Text style={styles.label}>PURCHASE PRICE</Text>
      <View style={styles.priceRow}>
        <Text style={styles.currency}>€</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
          style={styles.priceInput}
          placeholderTextColor={colors.textTertiary}
        />
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

      <TouchableOpacity style={styles.saveBtn} onPress={goBack}>
        <Text style={styles.saveBtnText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  header: { paddingTop: 16 },
  back: { color: colors.text, fontSize: 28, fontWeight: '300' },
  cardRow: { flexDirection: 'row', marginTop: 16, alignItems: 'center' },
  thumb: { width: 80, height: 110, borderRadius: 8, backgroundColor: colors.card },
  name: { color: colors.text, fontSize: 18, fontWeight: '500' },
  number: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  rarity: { color: colors.textTertiary, fontSize: 12, marginTop: 2 },
  label: { color: colors.textTertiary, fontSize: 11, fontWeight: '600', letterSpacing: 1.5, marginTop: 24 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  qtyBtn: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: colors.borderStrong,
    justifyContent: 'center', alignItems: 'center',
  },
  qtyBtnText: { color: colors.text, fontSize: 18 },
  qtyValue: { color: colors.text, fontSize: 18, marginHorizontal: 24, minWidth: 20, textAlign: 'center' },
  pickerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.card, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, marginTop: 8,
  },
  pickerValue: { color: colors.text, fontSize: 14 },
  pickerChevron: { color: colors.textSecondary, fontSize: 14 },
  priceRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 10,
    paddingHorizontal: 14, marginTop: 8, height: 46,
  },
  currency: { color: colors.textSecondary, fontSize: 14, marginRight: 6 },
  priceInput: { flex: 1, color: colors.text, fontSize: 14 },
  notesInput: {
    backgroundColor: colors.card, borderRadius: 10, padding: 14, marginTop: 8,
    color: colors.text, fontSize: 14, minHeight: 70, textAlignVertical: 'top',
  },
  saveBtn: { backgroundColor: colors.purple, borderRadius: 24, paddingVertical: 15, alignItems: 'center', marginTop: 32, marginBottom: 40 },
  saveBtnText: { color: colors.text, fontSize: 14, fontWeight: '600' },
});
