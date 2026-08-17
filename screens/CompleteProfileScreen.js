
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme';
import { useAppContext } from '../AppContext';

const AVATAR_COLORS = ['6d28d9', 'c2410c', '1e3a8a', '15803d', 'a21caf'];

export default function CompleteProfileScreen({ navigate }) {
  const { updateUserProfile } = useAppContext();
  const [displayName, setDisplayName] = useState('');
  const [favoriteType, setFavoriteType] = useState('');
  const [startedYear, setStartedYear] = useState('');
  const [avatarIndex, setAvatarIndex] = useState(0);

  const canSubmit = displayName.trim().length > 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Complete your profile</Text>
      <Text style={styles.subtitle}>This is what other collectors will see.</Text>

      <TouchableOpacity
        style={styles.avatarWrap}
        onPress={() => setAvatarIndex((i) => (i + 1) % AVATAR_COLORS.length)}
      >
        <View style={[styles.avatarImg, { backgroundColor: `#${AVATAR_COLORS[avatarIndex]}` }]}><Text style={styles.avatarInitial}>PF</Text></View>
        <View style={styles.editBadge}>
          <Text style={styles.editIcon}>✎</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.avatarHint}>Tap to change photo</Text>

      <Text style={styles.label}>DISPLAY NAME</Text>
      <TextInput
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Username"
        placeholderTextColor={colors.textTertiary}
        style={styles.input}
      />

      <Text style={styles.label}>FAVORITE TYPE (OPTIONAL)</Text>
      <TextInput
        value={favoriteType}
        onChangeText={setFavoriteType}
        placeholder="e.g. Fire, Psychic..."
        placeholderTextColor={colors.textTertiary}
        style={styles.input}
      />

      <Text style={styles.label}>COLLECTING SINCE (OPTIONAL)</Text>
      <TextInput
        value={startedYear}
        onChangeText={setStartedYear}
        placeholder="e.g. 2019"
        placeholderTextColor={colors.textTertiary}
        style={styles.input}
        keyboardType="number-pad"
      />

      <TouchableOpacity
        style={[styles.primaryBtn, !canSubmit && styles.primaryBtnDisabled]}
        disabled={!canSubmit}
        onPress={() => { updateUserProfile({ displayName: displayName.trim() }); navigate('Onboarding'); }}
      >
        <Text style={styles.primaryText}>Continue</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigate('Onboarding')}>
        <Text style={styles.skipLink}>Skip for now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  title: { color: colors.text, fontSize: 26, fontWeight: '300', marginTop: 24 },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginTop: 8 },
  avatarWrap: { alignSelf: 'center', marginTop: 28, width: 96, height: 96 },
  avatarImg: { width: 96, height: 96, borderRadius: 48, borderWidth: 1, borderColor: colors.purple },
  avatarInitial: { color: colors.text, fontSize: 22, fontWeight: '700', textAlign: 'center', lineHeight: 94 },
  editBadge: {
    position: 'absolute', bottom: -2, right: -2, width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.purple, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: colors.bg,
  },
  editIcon: { color: colors.text, fontSize: 12 },
  avatarHint: { color: colors.textTertiary, fontSize: 12, textAlign: 'center', marginTop: 10 },
  label: { color: colors.textTertiary, fontSize: 11, fontWeight: '600', letterSpacing: 1.5, marginTop: 24 },
  input: {
    backgroundColor: colors.card, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 14,
    marginTop: 8, color: colors.text, fontSize: 14,
  },
  primaryBtn: { backgroundColor: colors.purple, borderRadius: 24, paddingVertical: 16, alignItems: 'center', marginTop: 32 },
  primaryBtnDisabled: { backgroundColor: 'rgba(139,92,246,0.35)' },
  primaryText: { color: colors.text, fontSize: 15, fontWeight: '600' },
  skipLink: { color: colors.textSecondary, fontSize: 13, textAlign: 'center', marginTop: 18 },
});
