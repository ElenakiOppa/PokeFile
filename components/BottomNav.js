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
    <View style={[styles.shell, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.bar}>
        {ITEMS.map((item) => {
          const active = activeRoute === item.route || (item.route === 'Search' && activeRoute === 'Scanner');
          const center = item.route === 'Search';
          return (
            <TouchableOpacity key={item.route} style={[styles.item, center && styles.centerItem]} onPress={() => onNavigate(item.route)} activeOpacity={0.72} accessibilityLabel={item.label}>
              <View style={[styles.iconStage, center && styles.centerStage, center && active && styles.centerStageActive]}>
                <Ionicons name={active ? item.activeIcon : item.icon} size={center ? 23 : 21} color={active || center ? colors.purple : '#8b8b92'} />
              </View>
              {!center ? <Text style={[styles.label, active && styles.activeLabel]}>{item.label}</Text> : null}
              {active && !center ? <View style={styles.activeDot} /> : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flexShrink: 0, backgroundColor: '#0b0b0c', borderTopWidth: 1, borderTopColor: '#242427', zIndex: 40 },
  bar: { height: 64, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5 },
  item: { flex: 1, height: 62, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  centerItem: { justifyContent: 'flex-start' },
  iconStage: { width: 34, height: 28, alignItems: 'center', justifyContent: 'center' },
  centerStage: { width: 62, height: 62, borderRadius: 31, marginTop: -17, backgroundColor: '#080808', borderWidth: 1, borderColor: '#252529', shadowColor: '#000', shadowOpacity: 0.55, shadowRadius: 12, shadowOffset: { width: 0, height: 5 } },
  centerStageActive: { borderColor: 'rgba(212,175,55,0.55)', shadowColor: colors.purple, shadowOpacity: 0.18 },
  label: { color: '#77777e', fontSize: 7, fontWeight: '600', marginTop: 3 },
  activeLabel: { color: colors.purple },
  activeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.purple, marginTop: 3 },
});
