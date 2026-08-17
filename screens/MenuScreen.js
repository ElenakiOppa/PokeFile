import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';

const ITEMS = [
  { key: 'Home', label: 'Home', hasArrow: true },
  { key: 'Search', label: 'Search' },
  { key: 'CollectionAll', label: 'Collection' },
  { key: 'SeriesView', label: 'Sets' },
  { key: 'Binders', label: 'Binders' },
  { key: 'Wishlist', label: 'Wishlist' },
  { key: 'Profile', label: 'Profile' },
];

export default function MenuScreen({ navigate, goBack }) {
  const [isDark, setIsDark] = useState(true);
  const [active, setActive] = useState('Home');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} hitSlop={12}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate('Profile')} style={styles.avatar}>
          <Text style={styles.avatarText}>PF</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {ITEMS.map((item) => {
          const isActive = active === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              style={styles.itemRow}
              onPress={() => {
                setActive(item.key);
                navigate(item.key);
              }}
            >
              <Text style={[styles.itemText, isActive ? styles.itemTextActive : styles.itemTextInactive]}>
                {item.label}
              </Text>
              {isActive && <Text style={styles.itemArrow}>→</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footer}>
        <View style={styles.themeToggle}>
          <TouchableOpacity
            style={[styles.themeBtn, isDark ? null : styles.themeBtnActive]}
            onPress={() => setIsDark(false)}
          >
            <Text style={styles.themeIcon}>☀</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeBtn, isDark ? styles.themeBtnActive : null]}
            onPress={() => setIsDark(true)}
          >
            <Text style={styles.themeIcon}>☾</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity hitSlop={12} onPress={() => navigate('Profile')}>
          <Text style={styles.gear}>⚙</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24, paddingTop: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  close: { color: colors.text, fontSize: 20 },
  avatar: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: colors.borderStrong,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: colors.text, fontSize: 11, fontWeight: '600' },
  list: { marginTop: 48 },
  itemRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14,
  },
  itemText: { fontSize: 34, fontWeight: '300' },
  itemTextActive: { color: colors.text },
  itemTextInactive: { color: 'rgba(255,255,255,0.35)' },
  itemArrow: { color: colors.text, fontSize: 24 },
  footer: {
    position: 'absolute', bottom: 40, left: 24, right: 24,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  themeToggle: {
    flexDirection: 'row', backgroundColor: '#161616', borderRadius: 20, padding: 4,
  },
  themeBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  themeBtnActive: { backgroundColor: '#2a2a2a' },
  themeIcon: { color: colors.text, fontSize: 14 },
  gear: { color: colors.textSecondary, fontSize: 20 },
});
