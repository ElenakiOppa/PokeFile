
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { colors } from '../theme';

/**
 * A single settings/preferences row.
 * type: 'chevron' (default, navigates) | 'switch' | 'value' (shows text + chevron)
 */
export default function SettingsRow({
  label,
  sublabel,
  value,
  type = 'chevron',
  switchValue,
  onSwitchChange,
  onPress,
  danger = false,
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} disabled={type === 'switch'} activeOpacity={0.7}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.label, danger && { color: '#e74c3c' }]}>{label}</Text>
        {sublabel ? <Text style={styles.sublabel}>{sublabel}</Text> : null}
      </View>

      {type === 'switch' ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: 'rgba(255,255,255,0.15)', true: colors.purple }}
          thumbColor={colors.text}
        />
      ) : (
        <View style={styles.right}>
          {value ? <Text style={styles.value}>{value}</Text> : null}
          {type !== 'value' ? <Text style={styles.chevron}>›</Text> : null}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 16, borderTopWidth: 1, borderTopColor: colors.border,
  },
  label: { color: colors.text, fontSize: 15 },
  sublabel: { color: colors.textTertiary, fontSize: 12, marginTop: 2 },
  right: { flexDirection: 'row', alignItems: 'center' },
  value: { color: colors.textSecondary, fontSize: 14, marginRight: 8 },
  chevron: { color: colors.textSecondary, fontSize: 18 },
});
