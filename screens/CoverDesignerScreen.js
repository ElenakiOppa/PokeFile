
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme';

const STYLES = [
  { id: 's1', name: 'Pitch Black', color: '111111' },
  { id: 's2', name: 'Ascended Host', color: '9a3412' },
  { id: 's3', name: 'Set Nurtain', color: '4c1d95' },
  { id: 's4', name: 'Collection Velvet', color: '1e293b' },
];

export default function CoverDesignerScreen({ goBack }) {
  const [selected, setSelected] = useState('s1');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} hitSlop={12}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity hitSlop={12}>
          <Text style={styles.search}>⌕</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Design your cover</Text>
      <Text style={styles.subtitle}>Pick a style</Text>

      <Text style={styles.label}>TYPE</Text>

      <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 8 }}>
        {STYLES.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={styles.row}
            onPress={() => setSelected(s.id)}
          >
            <Image
              source={{ uri: `https://via.placeholder.com/80x80/${s.color}/ffffff?text=+` }}
              style={styles.swatch}
            />
            <Text style={styles.rowText}>{s.name}</Text>
            <View style={[styles.radio, selected === s.id && styles.radioActive]} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.saveBtn} onPress={goBack}>
        <Text style={styles.saveBtnText}>Save Cover</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 16 },
  back: { color: colors.text, fontSize: 28, fontWeight: '300' },
  search: { color: colors.text, fontSize: 18 },
  title: { color: colors.text, fontSize: 26, fontWeight: '500', marginTop: 20 },
  subtitle: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
  label: { color: colors.textTertiary, fontSize: 11, fontWeight: '600', letterSpacing: 1.5, marginTop: 28 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  swatch: { width: 44, height: 44, borderRadius: 8, backgroundColor: colors.card },
  rowText: { color: colors.text, fontSize: 15, marginLeft: 14, flex: 1 },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: colors.borderStrong },
  radioActive: { backgroundColor: colors.purple, borderColor: colors.purple },
  saveBtn: { backgroundColor: colors.purple, borderRadius: 24, paddingVertical: 15, alignItems: 'center', marginBottom: 30 },
  saveBtnText: { color: colors.text, fontSize: 14, fontWeight: '600' },
});
