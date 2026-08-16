
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme';

const LANGUAGES = ['English', 'Français', 'Español', 'Deutsch', '日本語'];

export default function LanguageScreen({ goBack }) {
  const [selected, setSelected] = useState('English');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} hitSlop={12}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>LANGUAGE</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={{ marginTop: 20 }} showsVerticalScrollIndicator={false}>
        {LANGUAGES.map((lang) => (
          <TouchableOpacity key={lang} style={styles.row} onPress={() => setSelected(lang)}>
            <Text style={styles.rowText}>{lang}</Text>
            {selected === lang && <Text style={styles.check}>✓</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16 },
  back: { color: colors.text, fontSize: 28, fontWeight: '300', width: 24 },
  title: { color: colors.text, fontSize: 13, fontWeight: '600', letterSpacing: 1.5 },
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 16, borderTopWidth: 1, borderTopColor: colors.border,
  },
  rowText: { color: colors.text, fontSize: 16 },
  check: { color: colors.purple, fontSize: 16, fontWeight: '700' },
});
