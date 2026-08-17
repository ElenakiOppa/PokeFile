import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme';
import { SETS } from '../data';
import { useAppContext } from '../AppContext';

export default function ProfileScreen({ navigate, goBack, binders = [], collectionQuantities = {}, logOut = async () => {} }) {
  const { userProfile, updateUserProfile, preferences } = useAppContext();
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(userProfile.displayName || 'Collector');
  const initials = String(userProfile.displayName || userProfile.email || 'Collector').split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
  const pickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Photo access needed', 'Allow PokeFile to access your photos to choose a profile image.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled && result.assets?.[0]?.uri) updateUserProfile({ avatarUri: result.assets[0].uri });
  };
  const saveName = () => {
    const displayName = draftName.trim();
    if (displayName) updateUserProfile({ displayName });
    setEditingName(false);
  };
  const confirmLogOut = () => Alert.alert(
    'Log out of PokeFile?',
    'Your collection will remain saved on this device.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => logOut().catch((error) => Alert.alert('Could not log out', error.message)) },
    ]
  );
  const preferenceRows = [
    { label: 'Theme', value: preferences.theme, route: 'Appearance' },
    { label: 'Language', value: 'English', route: 'Language' },
    { label: 'Notifications', value: null, route: 'Notifications' },
    { label: 'Data & Sync', value: 'On device', route: 'DataSync' },
    { label: 'About', value: null, route: 'About' },
  ];
  const stats = [
    { label: 'Cards', value: Object.values(collectionQuantities).reduce((sum, quantity) => sum + Number(quantity || 0), 0) },
    { label: 'Binders', value: String(binders.filter((binder) => binder.kind !== 'flex').length).padStart(2, '0') },
    { label: 'Sets', value: String(SETS.length).padStart(2, '0') },
    { label: 'Wishlist', value: '00' },
  ];
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.screenHeading}>
        <Text style={styles.screenEyebrow}>COLLECTOR IDENTITY</Text>
        <Text style={styles.screenTitle}>Profile</Text>
      </View>

      <View style={styles.profileRow}>
        <View>
          {editingName ? (
            <TextInput value={draftName} onChangeText={setDraftName} onBlur={saveName} onSubmitEditing={saveName} autoFocus style={styles.nameInput} />
          ) : (
            <TouchableOpacity onPress={() => setEditingName(true)}><Text style={styles.name}>{userProfile.displayName || 'Collector'} ✎</Text></TouchableOpacity>
          )}
          <Text style={styles.since}>{userProfile.email || 'Signed-in collector'}</Text>
        </View>
        <TouchableOpacity style={styles.avatarWrap} onPress={pickAvatar} accessibilityLabel="Change profile image">
          {userProfile.avatarUri ? <Image source={{ uri: userProfile.avatarUri }} style={styles.avatarImg} /> : <View style={[styles.avatarImg, styles.avatarFallback]}><Text style={styles.avatarInitials}>{initials}</Text></View>}
          <View style={styles.editBadge}>
            <Text style={styles.editIcon}>✎</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        {stats.map((s) => {
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
        {preferenceRows.map((p) => (
          <TouchableOpacity key={p.label} style={styles.prefRow} onPress={() => navigate(p.route)}>
            <Text style={styles.prefLabel}>{p.label}</Text>
            <View style={styles.prefRight}>
              {p.value && <Text style={styles.prefValue}>{p.value}</Text>}
              <Text style={styles.prefChevron}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.sectionLabel}>COLLECTOR</Text>
      <View style={styles.prefList}>
        {[['Collector DNA','CollectorDNA'],['Insights','Insights'],['Milestones','Milestones'],['Collection History','CollectionHistory']].map(([label,route]) => <TouchableOpacity key={route} style={styles.prefRow} onPress={() => navigate(route)}><Text style={styles.prefLabel}>{label}</Text><Text style={styles.prefChevron}>›</Text></TouchableOpacity>)}
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogOut}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
      <Text style={styles.localNote}>Your account is signed in. Collection data currently stays on this device.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  screenHeading: { paddingHorizontal: 24, paddingTop: 24 },
  screenEyebrow: { color: colors.textTertiary, fontSize: 8, fontWeight: '700', letterSpacing: 1.3 },
  screenTitle: { color: colors.text, fontSize: 29, fontWeight: '700', marginTop: 4 },
  profileRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, marginTop: 24,
  },
  name: { color: colors.text, fontSize: 34, fontWeight: '300' },
  nameInput: { color: colors.text, fontSize: 30, fontWeight: '300', borderBottomWidth: 1, borderBottomColor: colors.purple, minWidth: 180, paddingVertical: 2 },
  since: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
  avatarWrap: { width: 72, height: 72 },
  avatarImg: { width: 72, height: 72, borderRadius: 36, borderWidth: 1, borderColor: colors.purple },
  avatarFallback: { backgroundColor: colors.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  avatarInitials: { color: colors.text, fontSize: 20, fontWeight: '700' },
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
  logoutButton: { marginHorizontal: 24, marginTop: 4, height: 52, borderRadius: 26, borderWidth: 1, borderColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  logoutText: { color: colors.red, fontSize: 14, fontWeight: '700' },
  localNote: { color: colors.textTertiary, fontSize: 10, textAlign: 'center', marginTop: 10, marginBottom: 35 },
});
