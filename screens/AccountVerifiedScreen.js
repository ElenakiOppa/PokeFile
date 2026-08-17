
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function AccountVerifiedScreen({ navigate }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>✓</Text>
      </View>

      <Text style={styles.title}>Account verified</Text>
      <Text style={styles.subtitle}>Your email has been confirmed. Let's finish setting up your profile.</Text>

      <TouchableOpacity style={styles.primaryBtn} onPress={() => navigate('CompleteProfile')}>
        <Text style={styles.primaryText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36, borderWidth: 1.5, borderColor: colors.purple,
    justifyContent: 'center', alignItems: 'center', backgroundColor: colors.purpleSoft,
  },
  icon: { fontSize: 30, color: colors.purple, fontWeight: '700' },
  title: { color: colors.text, fontSize: 26, fontWeight: '700', marginTop: 24, textAlign: 'center' },
  subtitle: { color: colors.textSecondary, fontSize: 14, textAlign: 'center', marginTop: 12, lineHeight: 20 },
  primaryBtn: { backgroundColor: colors.purple, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 36, width: '100%' },
  primaryText: { color: colors.bg, fontSize: 15, fontWeight: '800' },
});
