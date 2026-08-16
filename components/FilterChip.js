
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function FilterChip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
    >
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1, borderColor: colors.border, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8, marginRight: 8, marginBottom: 8,
  },
  chipActive: { backgroundColor: colors.purple, borderColor: colors.purple },
  text: { color: colors.textSecondary, fontSize: 13 },
  textActive: { color: colors.text, fontWeight: '600' },
});
