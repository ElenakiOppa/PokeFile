import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useAppContext } from '../AppContext';
import UserAvatar from '../components/UserAvatar';

const ITEMS = [
  ['Home', 'Home', 'home-outline'],
  ['CollectionAll', 'My Collection', 'chatbox-outline'],
  ['Binders', 'Binders', 'book-outline'],
  ['Wishlist', 'Wishlist', 'heart-outline'],
  ['Vault', 'Vault', 'lock-closed-outline'],
  ['SeriesView', 'Sets', 'layers-outline'],
  ['Trades', 'Trades', 'sync-outline'],
  ['Insights', 'Insights', 'trending-up-outline'],
  ['Milestones', 'Milestones', 'ribbon-outline'],
];

export default function MenuScreen({ navigate, goBack }) {
  const { userProfile, logOut } = useAppContext();
  const open = (route) => {
    goBack?.();
    setTimeout(() => navigate(route), 0);
  };
  const signOut = async () => {
    try {
      await logOut?.();
      goBack?.();
    } catch (error) {
      console.warn('Unable to sign out', error);
    }
  };

  return (
    <View style={s.page}>
      <View style={s.header}>
        <TouchableOpacity style={s.profile} onPress={() => open('Profile')} activeOpacity={0.75}>
          <UserAvatar size={48} />
          <Text style={s.name} numberOfLines={1}>{userProfile.displayName || 'Collector'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.accountButton} onPress={() => open('Profile')} activeOpacity={0.65}>
          <Ionicons name="person-outline" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={s.nav} contentContainerStyle={s.navContent} showsVerticalScrollIndicator={false}>
        {ITEMS.map(([route, label, icon], index) => {
          const selected = index === 0;
          return (
            <TouchableOpacity
              key={route}
              style={[s.row, selected && s.rowSelected]}
              onPress={() => open(route)}
              activeOpacity={0.7}
            >
              {selected ? <View style={s.activeIndicator} /> : null}
              <Ionicons name={icon} size={19} color={selected ? colors.purple : colors.textSecondary} />
              <Text style={[s.rowText, selected && s.rowTextSelected]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity style={s.signOut} onPress={signOut} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={18} color="#ff5252" />
          <Text style={s.signOutText}>Sign Out</Text>
        </TouchableOpacity>
        <Text style={s.version}>v1.2.0</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 },
  header: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  profile: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 12 },
  name: { flex: 1, color: colors.text, fontSize: 16, fontWeight: '700' },
  accountButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  nav: { flex: 1 },
  navContent: { gap: 4, paddingBottom: 12 },
  row: { height: 57, borderRadius: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12, overflow: 'hidden' },
  rowSelected: { backgroundColor: colors.purpleSoft, borderWidth: 1, borderColor: colors.border },
  activeIndicator: { position: 'absolute', left: -1, top: 14, width: 3, height: 28, borderTopRightRadius: 2, borderBottomRightRadius: 2, backgroundColor: colors.purple },
  rowText: { color: colors.text, fontSize: 16, fontWeight: '600' },
  rowTextSelected: { fontWeight: '700' },
  footer: { minHeight: 48, paddingHorizontal: 16, paddingTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  signOut: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 36 },
  signOutText: { color: '#ff5252', fontSize: 14, fontWeight: '600' },
  version: { color: colors.textTertiary, fontSize: 12, fontWeight: '500', letterSpacing: 0.4 },
});
