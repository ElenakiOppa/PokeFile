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
              <Ionicons name={active ? item.activeIcon : item.icon} size={22} color={active ? colors.purple : '#71717a'} />
              <Text style={[styles.label, active && styles.activeLabel]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flexShrink: 0, backgroundColor: '#121212', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', zIndex: 40 },
  bar: { height: 59, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  item: { width: 70, height: 59, alignItems: 'center', justifyContent: 'center' },
  label: { color: '#71717a', fontSize: 10, fontWeight: '500', marginTop: 4 },
  activeLabel: { color: colors.purple },
});
