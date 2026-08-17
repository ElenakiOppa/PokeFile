import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../AppContext';
import { colors } from '../theme';

const makeInitials = (value) => String(value || '')
  .split(/[\s@._-]+/)
  .filter(Boolean)
  .slice(0, 2)
  .map(part => part[0]?.toUpperCase())
  .join('');

export default function UserAvatar({ size = 42, profile, name, uri, accent = true }) {
  const { userProfile } = useAppContext();
  const resolved = profile || userProfile || {};
  const imageUri = uri || resolved.avatarUri;
  const initials = makeInitials(name || resolved.displayName || resolved.email);
  const radius = size / 2;
  return <View style={[s.frame, { width: size, height: size, borderRadius: radius, borderColor: accent ? colors.purple : colors.borderStrong }]}>
    {imageUri ? <Image source={{ uri: imageUri }} style={{ width: size - 4, height: size - 4, borderRadius: radius - 2 }} /> : initials ? <Text style={[s.initials, { fontSize: Math.max(9, size * .3) }]}>{initials}</Text> : <Ionicons name="person-outline" size={size * .48} color={colors.purple} />}
  </View>;
}

const s = StyleSheet.create({
  frame: { borderWidth: 1.5, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  initials: { color: colors.text, fontWeight: '800' },
});
