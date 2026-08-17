import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import BrandLogo from './BrandLogo';

/**
 * Top-level pages use the drawer action. Nested/detail pages use back.
 * Search is always retained on the right.
 */
export default function TopBar({
  variant = 'title',
  onMenuPress,
  onSearchPress,
  onBackPress,
}) {
  return (
    <View style={styles.row}>
      {variant === 'back' ? (
        <TouchableOpacity onPress={onBackPress} hitSlop={12} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onMenuPress} hitSlop={12} style={styles.iconBtn}>
          <Ionicons name="menu" size={18} color={colors.text} />
        </TouchableOpacity>
      )}

      {variant === 'title' ? (
        <BrandLogo width={116} />
      ) : (
        <View style={{ flex: 1 }} />
      )}

      <TouchableOpacity onPress={onSearchPress} hitSlop={12} style={styles.iconBtn} accessibilityLabel="Search">
        <Ionicons name="search" size={17} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconBtn: { width: 36, height: 36, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
});
