
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { useAppContext } from '../AppContext';

const ACCENTS = ['#8B5CF6', '#3B82F6', '#22C55E', '#F97316', '#EC4899'];

export default function AppearanceScreen({ goBack }) {
  const { preferences, updatePreferences } = useAppContext();
  const theme = preferences.theme || 'Dark';
  const accent = preferences.accent || ACCENTS[0];
  const density = preferences.density || 'Comfortable';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} hitSlop={12}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>APPEARANCE</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.label}>THEME</Text>
      <View style={styles.themeRow}>
        {['Dark', 'Light'].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.themeChip, theme === t && styles.themeChipActive]}
            onPress={() => updatePreferences({ theme: t })}
          >
            <Text style={[styles.themeChipText, theme === t && styles.themeChipTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>ACCENT COLOR</Text>
      <View style={styles.swatchRow}>
        {ACCENTS.map((c) => (
          <TouchableOpacity key={c} onPress={() => updatePreferences({ accent: c })} style={styles.swatchWrap}>
            <View style={[styles.swatch, { backgroundColor: c }, accent === c && styles.swatchActive]} />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>DENSITY</Text>
      <View style={styles.themeRow}>
        {['Comfortable', 'Compact'].map((d) => (
          <TouchableOpacity
            key={d}
            style={[styles.themeChip, density === d && styles.themeChipActive]}
            onPress={() => updatePreferences({ density: d })}
          >
            <Text style={[styles.themeChipText, density === d && styles.themeChipTextActive]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16 },
  back: { color: colors.text, fontSize: 28, fontWeight: '300', width: 24 },
  title: { color: colors.text, fontSize: 13, fontWeight: '600', letterSpacing: 1.5 },
  label: { color: colors.textTertiary, fontSize: 11, fontWeight: '600', letterSpacing: 1.5, marginTop: 30 },
  themeRow: { flexDirection: 'row', marginTop: 12 },
  themeChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: colors.border, marginRight: 10 },
  themeChipActive: { backgroundColor: colors.purple, borderColor: colors.purple },
  themeChipText: { color: colors.textSecondary, fontSize: 13 },
  themeChipTextActive: { color: colors.text, fontWeight: '600' },
  swatchRow: { flexDirection: 'row', marginTop: 14 },
  swatchWrap: { marginRight: 14 },
  swatch: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: 'transparent' },
  swatchActive: { borderColor: colors.text },
});
