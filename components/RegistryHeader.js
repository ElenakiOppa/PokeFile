import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

export default function RegistryHeader({ eyebrow, title, onBack, onMenu, onSearch, rightIcon, onRightPress }) {
  const leftAction = onBack || onMenu;
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.button} onPress={leftAction} disabled={!leftAction} accessibilityLabel={onBack ? 'Go back' : 'Open menu'}>
        <Ionicons name={onBack ? 'chevron-back' : 'menu'} size={18} color={colors.text} />
      </TouchableOpacity>
      <View style={styles.copy}>
        {eyebrow ? <Text style={styles.eyebrow}>{String(eyebrow).toUpperCase()}</Text> : null}
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
      </View>
      {(onSearch || onRightPress) ? (
        <TouchableOpacity style={styles.button} onPress={onSearch || onRightPress} accessibilityLabel={onSearch ? 'Search' : 'Open action'}>
          <Ionicons name={onSearch ? 'search' : (rightIcon || 'ellipsis-horizontal')} size={17} color={colors.text} />
        </TouchableOpacity>
      ) : <View style={styles.buttonPlaceholder} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { minHeight: 58, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border },
  button: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  buttonPlaceholder: { width: 34, height: 34 },
  copy: { flex: 1, minWidth: 0, marginHorizontal: 10 },
  eyebrow: { color: colors.purple, fontSize: 8, lineHeight: 10, fontWeight: '700', letterSpacing: 0.4 },
  title: { color: colors.text, fontSize: 15, lineHeight: 19, fontWeight: '700' },
});
