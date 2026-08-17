import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useAppContext } from '../AppContext';
import { RegistrySettingsHeader, RegistryToggle, registrySettingsStyles as shared } from '../components/RegistrySettingsUi';

const ACCENTS = ['#D6B42C', '#16C79A', '#3B82F6', '#8B5CF6', '#EC4899'];
const MODES = [{ value: 'Dark', label: 'Dark Mode', icon: 'moon-outline' }, { value: 'Light', label: 'Light Mode', icon: 'sunny-outline' }, { value: 'System', label: 'System', icon: 'desktop-outline' }];

export default function AppearanceScreen({ goBack }) {
  const { preferences, updatePreferences } = useAppContext();
  const theme = preferences.theme || 'Dark';
  const accent = preferences.accent || ACCENTS[0];
  const density = preferences.density || 'Comfortable';
  const animations = preferences.animations !== false;
  return <View style={shared.page}>
    <RegistrySettingsHeader title="Appearance" eyebrow="Display Architecture" goBack={goBack} />
    <View style={shared.content}>
      <Text style={shared.sectionLabel}>Registry Theme Mode</Text>
      <View style={s.modeRow}>{MODES.map(mode => <TouchableOpacity key={mode.value} style={[s.modeCard, theme === mode.value && s.active]} onPress={() => updatePreferences({ theme: mode.value })}><Ionicons name={mode.icon} size={24} color={theme === mode.value ? colors.purple : colors.textTertiary} /><Text style={[s.modeText, theme === mode.value && s.activeText]}>{mode.label}</Text></TouchableOpacity>)}</View>
      <Text style={shared.sectionLabel}>Active Accent Palette</Text>
      <View style={[shared.panel, s.accents]}>{ACCENTS.map(value => <TouchableOpacity key={value} style={[s.accentRing, accent === value && { borderColor: value }]} onPress={() => updatePreferences({ accent: value })}><View style={[s.accentDot, { backgroundColor: value }]} /></TouchableOpacity>)}</View>
      <Text style={shared.sectionLabel}>Index Display Layout</Text>
      <View style={[shared.panel, s.segment]}>{[['Compact','Small'],['Comfortable','Medium'],['Large','Large']].map(([value,label]) => <TouchableOpacity key={value} style={[s.segmentItem, density === value && s.segmentOn]} onPress={() => updatePreferences({ density: value })}><Text style={[s.segmentText, density === value && s.activeText]}>{label}</Text></TouchableOpacity>)}</View>
      <View style={s.animation}><RegistryToggle title="Interface Animations" description="Smooth motion effects and transitions" value={animations} onChange={value => updatePreferences({ animations: value })} /></View>
    </View>
  </View>;
}

const s = StyleSheet.create({
  modeRow: { flexDirection: 'row', gap: 12 },
  modeCard: { flex: 1, height: 86, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', gap: 11 },
  active: { borderColor: colors.purple, borderWidth: 1.5 },
  modeText: { color: colors.textSecondary, fontSize: 11, fontWeight: '700' },
  activeText: { color: colors.purple },
  accents: { height: 64, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10 },
  accentRing: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  accentDot: { width: 22, height: 22, borderRadius: 11 },
  segment: { height: 48, padding: 4, flexDirection: 'row' },
  segmentItem: { flex: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  segmentOn: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  segmentText: { color: colors.textSecondary, fontSize: 12, fontWeight: '700' },
  animation: { marginTop: 24 },
});
