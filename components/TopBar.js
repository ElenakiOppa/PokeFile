import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors, type } from '../theme';

/**
 * variant: 'brand'  -> hamburger left, avatar right, brand wordmark below (Home screen style)
 *          'title'  -> hamburger left, centered "POKÉ HAUS" title, avatar right
 *          'back'   -> back chevron left, avatar right (no title)
 */
export default function TopBar({
  variant = 'title',
  onMenuPress,
  onAvatarPress,
  onBackPress,
  avatarUri,
}) {
  return (
    <View style={styles.row}>
      {variant === 'back' ? (
        <TouchableOpacity onPress={onBackPress} hitSlop={12} style={styles.iconBtn}>
          <Text style={styles.chevron}>‹</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onMenuPress} hitSlop={12} style={styles.menuBtn}>
          <View style={styles.menuLine} />
          <View style={[styles.menuLine, { width: 14 }]} />
        </TouchableOpacity>
      )}

      {variant === 'title' ? (
        <Text style={type.brand}>POKÉ HAUS</Text>
      ) : (
        <View style={{ flex: 1 }} />
      )}

      <TouchableOpacity onPress={onAvatarPress} style={styles.avatar}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
        ) : (
          <Text style={styles.avatarText}>PH</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 6,
  },
  menuBtn: { justifyContent: 'center', width: 24 },
  menuLine: {
    width: 22,
    height: 1.5,
    backgroundColor: colors.text,
    marginVertical: 2,
    borderRadius: 1,
  },
  iconBtn: { width: 24 },
  chevron: { color: colors.text, fontSize: 28, fontWeight: '300' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%' },
  avatarText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
