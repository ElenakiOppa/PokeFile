
import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme';
import { getSetById } from '../data';

export default function BinderSettingsScreen({ goBack, params = {} }) {
  const set = getSetById(params.binderId || params.setId || 'pitch-black');
  const [name, setName] = useState(set.name);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} hitSlop={12}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.avatar}>
          <Text style={styles.avatarText}>PH</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={{ uri: set.logo }}
        style={styles.cover}
        resizeMode="contain"
      />

      <Text style={styles.label}>NAME</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} placeholderTextColor={colors.textTertiary} />

      <Text style={styles.label}>GOAL</Text>
      <TouchableOpacity style={styles.pickerRow}>
        <Text style={styles.pickerValue}>{set.type || 'Master Set'}</Text>
        <Text style={styles.pickerChevron}>⌄</Text>
      </TouchableOpacity>

      <Text style={styles.label}>SORT BY</Text>
      <TouchableOpacity style={styles.pickerRow}>
        <Text style={styles.pickerValue}>Set Number</Text>
        <Text style={styles.pickerChevron}>⌄</Text>
      </TouchableOpacity>

      <Text style={styles.label}>COVER</Text>
      <TouchableOpacity style={styles.pickerRow}>
        <Text style={styles.pickerValue}>{set.name}</Text>
        <Text style={styles.pickerChevron}>›</Text>
      </TouchableOpacity>

      <View style={styles.statsRow}>
        <Stat value={String(set.totalCards)} label="Cards" />
        <Stat value={String(set.language === 'English' ? 4 : 2)} label="Formats" />
        <Stat value={String(set.percent)} label="Set %" />
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={goBack}>
        <Text style={styles.saveBtnText}>Save Cover</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Stat({ value, label }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 16 },
  back: { color: colors.text, fontSize: 28, fontWeight: '300' },
  avatar: {
    width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.borderStrong,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: colors.text, fontSize: 10, fontWeight: '600' },
  cover: { width: '100%', height: 140, borderRadius: 12, marginTop: 16, backgroundColor: colors.card },
  label: { color: colors.textTertiary, fontSize: 11, fontWeight: '600', letterSpacing: 1.5, marginTop: 22 },
  input: { backgroundColor: colors.card, borderRadius: 10, padding: 14, marginTop: 8, color: colors.text, fontSize: 14 },
  pickerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.card, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, marginTop: 8,
  },
  pickerValue: { color: colors.text, fontSize: 14 },
  pickerChevron: { color: colors.textSecondary, fontSize: 14 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 28 },
  statValue: { color: colors.text, fontSize: 22, fontWeight: '300' },
  statLabel: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
  saveBtn: { backgroundColor: colors.purple, borderRadius: 24, paddingVertical: 15, alignItems: 'center', marginTop: 30, marginBottom: 30 },
  saveBtnText: { color: colors.text, fontSize: 14, fontWeight: '600' },
});
