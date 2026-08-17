import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

export function RegistrySettingsHeader({ title, eyebrow, goBack }) {
  return <View style={s.header}>
    {goBack ? <TouchableOpacity style={s.back} onPress={goBack}><Ionicons name="chevron-back" size={18} color={colors.text} /></TouchableOpacity> : null}
    <View style={s.headerCopy}><Text style={s.title}>{title}</Text><Text style={s.eyebrow}>{eyebrow}</Text></View>
  </View>;
}

export function RegistryToggle({ title, description, value, onChange }) {
  return <View style={s.toggleRow}><View style={s.toggleCopy}><Text style={s.toggleTitle}>{title}</Text><Text style={s.toggleDescription}>{description}</Text></View><Switch value={value} onValueChange={onChange} trackColor={{ false: colors.card, true: colors.purple }} thumbColor={value ? colors.bg : colors.textTertiary} /></View>;
}

export function RegistryMenuRow({ icon, title, value, onPress, danger = false, disabled = false }) {
  return <TouchableOpacity style={[s.menuRow, disabled && s.disabled]} onPress={onPress} disabled={disabled}>
    <View style={s.menuLeft}><View style={s.iconBox}><Ionicons name={icon} size={17} color={danger ? colors.red : colors.purple} /></View><Text style={[s.menuTitle, danger && s.danger]}>{title}</Text></View>
    <View style={s.menuRight}>{value ? <Text style={s.menuValue}>{value}</Text> : null}{!disabled ? <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} /> : null}</View>
  </TouchableOpacity>;
}

export const registrySettingsStyles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 24, paddingBottom: 36 },
  sectionLabel: { color: colors.textTertiary, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', marginTop: 20, marginBottom: 10 },
  panel: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 16 },
});

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingTop: 72, paddingBottom: 20, paddingHorizontal: 24 },
  back: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  headerCopy: { flex: 1 },
  title: { color: colors.text, fontSize: 20, fontWeight: '800' },
  eyebrow: { color: colors.textTertiary, fontSize: 10, textTransform: 'uppercase', marginTop: 2 },
  toggleRow: { minHeight: 80, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  toggleCopy: { flex: 1, paddingRight: 12 },
  toggleTitle: { color: colors.text, fontSize: 14, fontWeight: '700' },
  toggleDescription: { color: colors.textSecondary, fontSize: 11, lineHeight: 15, marginTop: 4 },
  menuRow: { minHeight: 64, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  disabled: { opacity: 0.45 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: { width: 34, height: 34, borderRadius: 8, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  menuTitle: { color: colors.text, fontSize: 13, fontWeight: '600', flexShrink: 1 },
  danger: { color: colors.red },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  menuValue: { color: colors.textSecondary, fontSize: 12 },
});
