import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme';
import TopBar from '../components/TopBar';
import { PROFILE } from '../data';

const STATS = [
  { label: 'Cards', value: PROFILE.stats.cards },
  { label: 'Binders', value: String(PROFILE.stats.binders).padStart(2, '0') },
  { label: 'Sets', value: String(PROFILE.stats.sets).padStart(2, '0') },
  { label: 'Wishlist', value: String(PROFILE.stats.wishlist).padStart(2, '0') },
];

const PREFERENCES = [
  { label: 'Theme', value: PROFILE.preferences.theme, route: 'Appearance' },
  { label: 'Language', value: PROFILE.preferences.language, route: 'Language' },
  { label: 'Notifications', value: null, route: 'Notifications' },
  { label: 'Data & Sync', value: null, route: 'DataSync' },
  { label: 'About', value: null, route: 'About' },
];

export default function ProfileScreen({ navigate, goBack }) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TopBar variant="back" onBackPress={goBack} onAvatarPress={() => {}} />

      <View style={styles.profileRow}>
        <View>
          <Text style={styles.name}>{PROFILE.name}</Text>
          <Text style={styles.since}>{PROFILE.since}</Text>
        </View>
        <View style={styles.avatarWrap}>
          <Image source={{ uri: PROFILE.avatar }} style={styles.avatarImg} />
          <View style={styles.editBadge}>
            <Text style={styles.editIcon}>✎</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        {STATS.map((s) => {
          const routeMap = {
            Cards: 'CollectionAll',
            Binders: 'Binders',
            Sets: 'AllSets',
            Wishlist: 'Wishlist',
          };

          return (
            <TouchableOpacity key={s.label} style={styles.statCol} onPress={() => navigate(routeMap[s.label] || 'Profile')}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.sectionLabel}>PREFERENCES</Text>
      <View style={styles.prefList}>
        {PREFERENCES.map((p) => (
          <TouchableOpacity key={p.label} style={styles.prefRow} onPress={() => navigate(p.route)}>
            <Text style={styles.prefLabel}>{p.label}</Text>
            <View style={styles.prefRight}>
              {p.value && <Text style={styles.prefValue}>{p.value}</Text>}
              <Text style={styles.prefChevron}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  profileRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, marginTop: 24,
  },
  name: { color: colors.text, fontSize: 34, fontWeight: '300' },
  since: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
  avatarWrap: { width: 72, height: 72 },
  avatarImg: { width: 72, height: 72, borderRadius: 36, borderWidth: 1, borderColor: colors.purple },
  editBadge: {
    position: 'absolute', bottom: -2, right: -2, width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.purple, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: colors.bg,
  },
  editIcon: { color: colors.text, fontSize: 11 },
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, marginTop: 36,
  },
  statCol: {},
  statValue: { color: colors.text, fontSize: 26, fontWeight: '300' },
  statLabel: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
  sectionLabel: {
    color: colors.textTertiary, fontSize: 11, fontWeight: '600', letterSpacing: 1.5,
    paddingHorizontal: 24, marginTop: 40,
  },
  prefList: { marginTop: 12, paddingBottom: 40 },
  prefRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 16, borderTopWidth: 1, borderTopColor: colors.border,
  },
  prefLabel: { color: colors.text, fontSize: 15 },
  prefRight: { flexDirection: 'row', alignItems: 'center' },
  prefValue: { color: colors.textSecondary, fontSize: 14, marginRight: 8 },
  prefChevron: { color: colors.textSecondary, fontSize: 18 },
});
