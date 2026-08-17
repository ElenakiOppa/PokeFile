import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useAppContext } from '../AppContext';
import { RegistrySettingsHeader, registrySettingsStyles as shared } from '../components/RegistrySettingsUi';

const LANGUAGES = [['English (US)','English'],['Español','Spanish'],['Français','French'],['Deutsch','German'],['日本語','Japanese'],['한국어','Korean'],['Português','Portuguese']];
export default function LanguageScreen({ goBack }) {
  const { preferences, updatePreferences } = useAppContext();
  const selected = preferences.language || 'English (US)';
  const [query, setQuery] = useState('');
  const rows = useMemo(() => LANGUAGES.filter(([name,translation]) => `${name} ${translation}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <View style={shared.page}><RegistrySettingsHeader title="Language" eyebrow="Localization Register" goBack={goBack} /><View style={shared.content}>
    <View style={s.search}><Ionicons name="search" size={17} color={colors.textTertiary} /><TextInput value={query} onChangeText={setQuery} placeholder="Search languages..." placeholderTextColor={colors.textSecondary} style={s.input} /></View>
    <View style={s.list}>{rows.map(([name,translation]) => { const on = selected === name; return <TouchableOpacity key={name} style={[s.row, on && s.rowOn]} onPress={() => updatePreferences({ language: name })}><View style={s.labels}><Text style={s.name}>{name}</Text>{name !== 'English (US)' ? <Text style={s.translation}>· {translation}</Text> : null}</View><View style={[s.radio, on && s.radioOn]}>{on ? <View style={s.radioDot} /> : null}</View></TouchableOpacity>; })}</View>
  </View></View>;
}
const s = StyleSheet.create({
  search: { height: 44, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  input: { flex: 1, color: colors.text, fontSize: 13, marginLeft: 10, paddingVertical: 0 },
  list: { marginTop: 18, gap: 8 },
  row: { height: 50, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowOn: { borderColor: colors.purple }, labels: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  name: { color: colors.text, fontSize: 13, fontWeight: '600' }, translation: { color: colors.textTertiary, fontSize: 11 },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center' }, radioOn: { borderColor: colors.purple }, radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.purple },
});
