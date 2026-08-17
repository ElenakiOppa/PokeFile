import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

const ITEMS = [
  { route: 'Home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { route: 'CollectionAll', label: 'Collection', icon: 'albums-outline', activeIcon: 'albums' },
  { route: 'Search', label: 'Scan', icon: 'camera-outline', activeIcon: 'camera' },
  { route: 'Trades', label: 'Trades', icon: 'swap-horizontal-outline', activeIcon: 'swap-horizontal' },
  { route: 'Profile', label: 'Profile', icon: 'people-outline', activeIcon: 'people' },
];

export const MAIN_TAB_ROUTES = ITEMS.map((item) => item.route);

export default function BottomNav({ activeRoute, onNavigate }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.shell, { paddingBottom: insets.bottom }]}>
      <View style={styles.bar}>
        {ITEMS.map((item) => {
          const active = activeRoute === item.route || (item.route === 'Search' && activeRoute === 'Scanner');
          return (
            <TouchableOpacity key={item.route} style={styles.item} onPress={() => onNavigate(item.route)} activeOpacity={0.72} accessibilityLabel={item.label}>
              <Ionicons name={active ? item.activeIcon : item.icon} size={20} color={active ? colors.purple : colors.textSecondary} />
              <Text style={[styles.label, active && styles.activeLabel]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flexShrink: 0, backgroundColor: '#090909', borderTopWidth: 1, borderTopColor: colors.purple, zIndex: 40 },
  bar: { height: 58, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4 },
  item: { flex: 1, height: 54, alignItems: 'center', justifyContent: 'center' },
  label: { color: colors.textSecondary, fontSize: 7, fontWeight: '600', marginTop: 4 },
  activeLabel: { color: colors.purple },
});
