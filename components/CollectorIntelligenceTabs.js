import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

const TABS = [
  ['CollectorDNA', 'DNA', 'finger-print-outline'],
  ['Insights', 'Insights', 'trending-up-outline'],
  ['Milestones', 'Milestones', 'ribbon-outline'],
];

export default function CollectorIntelligenceTabs({ active, navigate }) {
  return <View style={s.tabs}>{TABS.map(([route, label, icon]) => {
    const selected = active === route;
    return <TouchableOpacity key={route} style={[s.tab, selected && s.tabOn]} onPress={() => selected ? null : navigate(route)} activeOpacity={0.72}>
      <Ionicons name={icon} size={18} color={selected ? colors.purple : colors.textTertiary} />
      <Text style={[s.text, selected && s.textOn]}>{label}</Text>
    </TouchableOpacity>;
  })}</View>;
}

const s = StyleSheet.create({
  tabs: { height: 52, marginHorizontal: 20, marginBottom: 14, padding: 4, borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: 'row' },
  tab: { flex: 1, borderRadius: 11, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center' },
  tabOn: { backgroundColor: colors.purpleSoft },
  text: { color: colors.textTertiary, fontSize: 10, fontWeight: '700' },
  textOn: { color: colors.purple, fontWeight: '800' },
});
