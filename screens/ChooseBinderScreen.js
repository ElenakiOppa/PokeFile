
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme';
import { getSetById } from '../data';
import BinderBook from '../components/BinderBook';

export default function ChooseBinderScreen({ goBack, navigate, params = {}, binders = [], addCardToBinder = () => {} }) {
  const freeformBinders = binders.filter((binder) => binder.kind === 'freeform');
  const [selected, setSelected] = useState(freeformBinders[0]?.id || null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} hitSlop={12}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Select binder</Text>
      <Text style={styles.subtitle}>Where should this card go?</Text>

      {freeformBinders.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No binders yet.</Text>
        </View>
      ) : (
        <ScrollView style={{ marginTop: 20 }} showsVerticalScrollIndicator={false}>
          {freeformBinders.map((b) => (
            <TouchableOpacity
              key={b.id}
              style={[styles.row, selected === b.id && styles.rowActive]}
              onPress={() => setSelected(b.id)}
            >
              <View style={styles.thumb}><BinderBook set={getSetById(b.setId)} binder={b} width={50} /></View>
              <View style={{ marginLeft: 14, flex: 1 }}>
                <Text style={styles.name}>{b.name}</Text>
                <Text style={styles.sub}>{b.tier.toUpperCase()} · {b.pocketLayout || 9}-POCKET</Text>
              </View>
              <View style={[styles.radio, selected === b.id && styles.radioActive]} />
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.createRow} onPress={() => navigate('CoverDesigner')}>
            <Text style={styles.createPlus}>+</Text>
            <Text style={styles.createText}>Create new binder</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmButton, !selected && styles.confirmDisabled]}
            disabled={!selected}
            onPress={() => { addCardToBinder(selected, params.cardId); goBack(); }}
          ><Text style={styles.confirmText}>Add to binder</Text></TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  header: { paddingTop: 16 },
  back: { color: colors.text, fontSize: 28, fontWeight: '300' },
  title: { color: colors.text, fontSize: 24, fontWeight: '500', marginTop: 16 },
  subtitle: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
  row: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border,
    borderRadius: 14, padding: 12, marginBottom: 14,
  },
  rowActive: { borderColor: colors.purple, backgroundColor: colors.purpleSoft },
  thumb: { width: 50, height: 68, borderRadius: 6, backgroundColor: colors.card },
  name: { color: colors.text, fontSize: 15, fontWeight: '500' },
  sub: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: colors.borderStrong },
  radioActive: { backgroundColor: colors.purple, borderColor: colors.purple },
  createRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  createPlus: { color: colors.purple, fontSize: 20, marginRight: 10 },
  createText: { color: colors.purple, fontSize: 14, fontWeight: '500' },
  emptyCard: {
    marginTop: 20,
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  emptyText: { color: colors.textSecondary, fontSize: 13 },
  confirmButton: { backgroundColor: colors.purple, borderRadius: 999, paddingVertical: 15, alignItems: 'center', marginVertical: 18 },
  confirmDisabled: { opacity: 0.35 }, confirmText: { color: colors.text, fontSize: 14, fontWeight: '700' },
});
