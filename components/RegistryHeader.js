import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

export default function RegistryHeader({ title, onBack, onMenu, onSearch, right, eyebrow, rightIcon, onRightPress, flush = false }) {
  const leftAction = onBack || onMenu;
  return (
    <View style={[styles.row, flush && styles.flush]}>
      <TouchableOpacity style={styles.icon} onPress={leftAction} disabled={!leftAction} hitSlop={10}>
        <Ionicons name={onBack ? 'chevron-back' : 'menu'} size={17} color={colors.text} />
      </TouchableOpacity>
      <View style={styles.copy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
      </View>
      {right || (
        <TouchableOpacity style={styles.icon} onPress={onSearch || onRightPress} disabled={!onSearch && !onRightPress} hitSlop={10}>
          <Ionicons name={onBack ? 'options-outline' : onSearch ? 'search' : (rightIcon || 'ellipsis-horizontal')} size={16} color={colors.text} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { height: 68, paddingHorizontal: 0, flexDirection: 'row', alignItems: 'center', gap: 14 },
  flush: { paddingHorizontal: 0 },
  icon: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1 },
  eyebrow: { color: colors.purple, fontSize: 9, fontWeight: '800', letterSpacing: 1.3, textTransform: 'uppercase' },
  title: { color: colors.text, fontSize: 19, fontWeight: '800', marginTop: 2 },
});
